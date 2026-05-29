package database

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/lokerkupy/backend/internal/models"
)

var (
	firebaseURL string
	authSecret  string
	useFirebase bool
	httpClient  = &http.Client{Timeout: 30 * time.Second}
)

type MasterStore struct {
	mu         sync.RWMutex
	jobs       map[string]models.Job
	dedupIndex map[string]string
	loaded     bool
}

var Store *MasterStore

func firebaseAPIURL(path string) string {
	url := fmt.Sprintf("%s/%s.json", firebaseURL, path)
	if authSecret != "" {
		url += fmt.Sprintf("?auth=%s", authSecret)
	}
	return url
}

func firebaseRequest(ctx context.Context, method, path string, body interface{}) ([]byte, error) {
	var reqBody io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewReader(b)
	}
	req, err := http.NewRequestWithContext(ctx, method, firebaseAPIURL(path), reqBody)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("Firebase API error %d: %s", resp.StatusCode, string(respBody))
	}
	return respBody, nil
}

func InitMasterStore() error {
	url := os.Getenv("FIREBASE_DATABASE_URL")
	if url != "" {
		firebaseURL = strings.TrimRight(url, "/")
		authSecret = os.Getenv("FIREBASE_SECRET")
		if authSecret == "" {
			authSecret = os.Getenv("FIREBASE_AUTH_SECRET")
		}
		useFirebase = true
	}
	Store = &MasterStore{
		jobs:       make(map[string]models.Job),
		dedupIndex: make(map[string]string),
	}
	Store.load()
	Store.loaded = true
	mode := "local JSON"
	if useFirebase {
		mode = "Firebase"
	}
	fmt.Printf("Master store loaded: %d jobs (%s)\n", len(Store.jobs), mode)
	return nil
}

func dedupKey(source, url string) string {
	h := sha256.Sum256([]byte(strings.ToLower(source + "|" + url)))
	return fmt.Sprintf("%x", h[:8])
}

func (s *MasterStore) UpsertJob(job models.Job) {
	s.mu.Lock()
	defer s.mu.Unlock()
	key := dedupKey(job.Source, job.URL)
	now := time.Now().Unix()
	if existingID, ok := s.dedupIndex[key]; ok {
		existing := s.jobs[existingID]
		job.CreatedAt = existing.CreatedAt
		job.ID = existingID
	} else {
		s.dedupIndex[key] = job.ID
	}
	job.UpdatedAt = now
	s.jobs[job.ID] = job
}

func (s *MasterStore) UpsertJobs(jobs []models.Job) {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now().Unix()
	for _, job := range jobs {
		key := dedupKey(job.Source, job.URL)
		if existingID, ok := s.dedupIndex[key]; ok {
			existing := s.jobs[existingID]
			job.CreatedAt = existing.CreatedAt
			job.ID = existingID
		} else {
			s.dedupIndex[key] = job.ID
		}
		job.UpdatedAt = now
		s.jobs[job.ID] = job
	}
}

func (s *MasterStore) SearchJobs(keyword, location string, education []string, limit int) []models.Job {
	s.mu.RLock()
	defer s.mu.RUnlock()
	type scoredJob struct {
		job   models.Job
		score int
	}
	kw := strings.ToLower(keyword)
	kwWords := strings.Fields(kw)
	eduSet := make(map[string]bool, len(education))
	for _, e := range education {
		eduSet[strings.ToLower(strings.TrimSpace(e))] = true
	}
	var results []scoredJob
	for _, job := range s.jobs {
		if keyword != "" {
			lower := strings.ToLower(job.Title + " " + job.Company + " " + job.Description)
			if !strings.Contains(lower, kw) {
				continue
			}
		}
		if location != "" {
			loc := strings.ToLower(job.Location)
			locQuery := strings.ToLower(location)
			if !strings.Contains(loc, locQuery) {
				continue
			}
		}
		if len(eduSet) > 0 {
			jobEdu := strings.ToLower(strings.TrimSpace(job.Education))
			if !eduSet[jobEdu] {
				continue
			}
		}
		score := 0
		if keyword != "" {
			titleLower := strings.ToLower(job.Title)
			companyLower := strings.ToLower(job.Company)
			descLower := strings.ToLower(job.Description)
			if titleLower == kw {
				score += 100
			} else if strings.HasPrefix(titleLower, kw) {
				score += 80
			} else if strings.Contains(titleLower, kw) {
				score += 60
			} else {
				allWords := true
				for _, w := range kwWords {
					if !strings.Contains(titleLower, w) {
						allWords = false
						break
					}
				}
				if allWords {
					score += 40
				} else {
					for _, w := range kwWords {
						if strings.Contains(titleLower, w) {
							score += 10
						}
					}
				}
			}
			if strings.Contains(companyLower, kw) {
				score += 20
			}
			if strings.Contains(descLower, kw) {
				score += 5
			}
		}
		results = append(results, scoredJob{job: job, score: score})
	}
	sort.Slice(results, func(i, j int) bool {
		if results[i].score != results[j].score {
			return results[i].score > results[j].score
		}
		return results[i].job.UpdatedAt > results[j].job.UpdatedAt
	})
	result := make([]models.Job, 0, len(results))
	for _, sj := range results {
		result = append(result, sj.job)
	}
	return result
}

func (s *MasterStore) Count() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.jobs)
}

func (s *MasterStore) save() {
	if useFirebase {
		data := struct {
			Jobs       map[string]models.Job `json:"jobs"`
			DedupIndex map[string]string     `json:"dedup_index"`
		}{
			Jobs:       s.jobs,
			DedupIndex: s.dedupIndex,
		}
		_, _ = firebaseRequest(context.Background(), "PUT", "master_jobs", data)
	} else {
		data := struct {
			Jobs       map[string]models.Job `json:"jobs"`
			DedupIndex map[string]string     `json:"dedup_index"`
		}{
			Jobs:       s.jobs,
			DedupIndex: s.dedupIndex,
		}
		b, _ := json.MarshalIndent(data, "", "  ")
		os.MkdirAll("data", 0755)
		os.WriteFile("data/master_jobs.json", b, 0644)
	}
}

func (s *MasterStore) load() {
	if useFirebase {
		b, err := firebaseRequest(context.Background(), "GET", "master_jobs", nil)
		if err != nil {
			fmt.Println("Master store: cannot load from Firebase, starting fresh:", err)
			return
		}
		if string(b) == "null" {
			return
		}
		var data struct {
			Jobs       map[string]models.Job `json:"jobs"`
			DedupIndex map[string]string     `json:"dedup_index"`
		}
		if err := json.Unmarshal(b, &data); err != nil {
			fmt.Println("Master store: cannot decode Firebase data, starting fresh:", err)
			return
		}
		if data.Jobs != nil {
			s.jobs = data.Jobs
		}
		if data.DedupIndex != nil {
			s.dedupIndex = data.DedupIndex
		}
	} else {
		os.MkdirAll("data", 0755)
		b, err := os.ReadFile("data/master_jobs.json")
		if err != nil {
			return
		}
		var data struct {
			Jobs       map[string]models.Job `json:"jobs"`
			DedupIndex map[string]string     `json:"dedup_index"`
		}
		if err := json.Unmarshal(b, &data); err != nil {
			return
		}
		if data.Jobs != nil {
			s.jobs = data.Jobs
		}
		if data.DedupIndex != nil {
			s.dedupIndex = data.DedupIndex
		}
	}
}

func AutoPersist(interval time.Duration) {
	go func() {
		for {
			time.Sleep(interval)
			if Store != nil {
				Store.mu.RLock()
				loaded := Store.loaded
				Store.mu.RUnlock()
				if loaded {
					Store.mu.Lock()
					Store.save()
					Store.mu.Unlock()
				}
			}
		}
	}()
}

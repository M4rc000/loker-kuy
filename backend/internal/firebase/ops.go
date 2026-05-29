package firebase

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/lokerkupy/backend/internal/models"
)

var httpClient = &http.Client{Timeout: 30 * time.Second}

func doRequest(ctx context.Context, method, url string, body interface{}) ([]byte, error) {
	var reqBody io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewReader(b)
	}
	req, err := http.NewRequestWithContext(ctx, method, url, reqBody)
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
		return nil, fmt.Errorf("firebase API error %d: %s", resp.StatusCode, string(respBody))
	}
	return respBody, nil
}

func CreateTask(ctx context.Context, task models.SearchTask) error {
	if useLocal {
		localStore.mu.Lock()
		defer localStore.mu.Unlock()
		localStore.tasks[task.ID] = task
		localStore.saveTasks()
		return nil
	}
	url := apiURL(fmt.Sprintf("search_tasks/%s", task.ID))
	_, err := doRequest(ctx, "PUT", url, task)
	return err
}

func GetPendingTasks(ctx context.Context) ([]models.SearchTask, error) {
	if useLocal {
		localStore.mu.RLock()
		defer localStore.mu.RUnlock()
		var result []models.SearchTask
		for _, t := range localStore.tasks {
			if t.Status == "pending" {
				result = append(result, t)
			}
		}
		return result, nil
	}
	url := apiURLWithQuery("search_tasks", "orderBy=\"status\"&equalTo=\"pending\"")
	data, err := doRequest(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}
	var tasks map[string]models.SearchTask
	if err := json.Unmarshal(data, &tasks); err != nil {
		return nil, err
	}
	var result []models.SearchTask
	for _, t := range tasks {
		if t.Status == "pending" {
			result = append(result, t)
		}
	}
	return result, nil
}

func GetTask(ctx context.Context, id string) (*models.SearchTask, error) {
	if useLocal {
		localStore.mu.RLock()
		defer localStore.mu.RUnlock()
		t, ok := localStore.tasks[id]
		if !ok {
			return nil, fmt.Errorf("task not found")
		}
		return &t, nil
	}
	url := apiURL(fmt.Sprintf("search_tasks/%s", id))
	data, err := doRequest(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}
	var task models.SearchTask
	if err := json.Unmarshal(data, &task); err != nil {
		return nil, err
	}
	return &task, nil
}

func UpdateTaskStatus(ctx context.Context, id, status string) error {
	if useLocal {
		localStore.mu.Lock()
		defer localStore.mu.Unlock()
		t, ok := localStore.tasks[id]
		if !ok {
			return fmt.Errorf("task not found")
		}
		t.Status = status
		localStore.tasks[id] = t
		localStore.saveTasks()
		return nil
	}
	url := apiURL(fmt.Sprintf("search_tasks/%s/status", id))
	_, err := doRequest(ctx, "PUT", url, status)
	return err
}

func UpdateTaskTotal(ctx context.Context, id string, total int) error {
	if useLocal {
		localStore.mu.Lock()
		defer localStore.mu.Unlock()
		t, ok := localStore.tasks[id]
		if !ok {
			return fmt.Errorf("task not found")
		}
		t.TotalJobs = total
		localStore.tasks[id] = t
		localStore.saveTasks()
		return nil
	}
	url := apiURL(fmt.Sprintf("search_tasks/%s/total_jobs", id))
	_, err := doRequest(ctx, "PUT", url, total)
	return err
}

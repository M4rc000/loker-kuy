package scraper

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/lokerkupy/backend/internal/models"
)

type MockScraper struct{}

func (s *MockScraper) Name() string { return "mock" }

func (s *MockScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	titles := []string{"Software Engineer", "Store Associate", "Sales Assistant", "Cashier", "Retail Staff", "Store Manager", "Admin Staff", "Customer Service", "Merchandiser", "Warehouse Staff", "Graphic Designer", "Marketing Staff"}
	companies := []string{"PT Maju Jaya", "PT Sejahtera Abadi", "CV Karya Mandiri", "PT Bintang Utama", "PT Sukses Selalu", "PT Retail Indah", "PT Fashion Nusantara", "CV Berkah Jaya"}
	cities := []string{"Jakarta", "Bandung", "Surabaya", "Tangerang", "Bekasi", "Depok", "Bogor"}
	educations := []string{"SMA/SMK", "D3", "S1", "S2"}
	jobTypes := []string{"Full Time", "Part Time", "Contract"}
	workModes := []string{"On Site", "Remote", "Hybrid"}

	now := time.Now().Unix()
	var jobs []models.Job
	for i := 0; i < 12; i++ {
		salary := fmt.Sprintf("Rp %d.%d.%d - Rp %d.%d.%d",
			3+rand.Intn(5), 500+rand.Intn(500), 0,
			8+rand.Intn(10), 0, 0)
		jobs = append(jobs, models.Job{
			ID:          uuid.New().String(),
			Title:       titles[rand.Intn(len(titles))],
			Company:     companies[rand.Intn(len(companies))],
			Location:    cities[rand.Intn(len(cities))],
			Salary:      salary,
			Description: fmt.Sprintf("Kami mencari %s yang berpengalaman untuk bergabung dengan tim kami. Kualifikasi: minimal %s, pengalaman minimal 1 tahun.", keyword, educations[rand.Intn(len(educations))]),
			Source:      "mock",
			URL:         "https://example.com/job/" + uuid.New().String(),
			PostedAt:    time.Now().Format("2006-01-02"),
			Category:    "General",
			JobType:     jobTypes[rand.Intn(len(jobTypes))],
			WorkMode:    workModes[rand.Intn(len(workModes))],
			Education:   educations[rand.Intn(len(educations))],
			Experience:  fmt.Sprintf("%d-%d tahun", 1+rand.Intn(2), 3+rand.Intn(3)),
			CreatedAt:   now,
		})
	}
	return jobs, nil
}

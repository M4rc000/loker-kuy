package worker

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/lokerkupy/backend/internal/database"
	"github.com/lokerkupy/backend/internal/firebase"
	"github.com/lokerkupy/backend/internal/models"
	"github.com/lokerkupy/backend/internal/scraper"
)

var scrapers = []scraper.Scraper{
	&scraper.IndeedScraper{},
	&scraper.LinkedinScraper{},
	&scraper.JobstreetScraper{},
	&scraper.GlintsScraper{},
	&scraper.GoogleJobsScraper{},
	&scraper.KalibrrScraper{},
	&scraper.KitaLulusScraper{},
	&scraper.GlassdoorScraper{},
	&scraper.KarirComScraper{},
	&scraper.TopKarirScraper{},
}

var mockScraper = &scraper.MockScraper{}

var (
	mu      sync.Mutex
	running = make(map[string]bool)
)

func StartWorker() {
	for {
		tasks, err := firebase.GetPendingTasks(context.Background())
		if err != nil {
			log.Printf("Error fetching pending tasks: %v", err)
			time.Sleep(5 * time.Second)
			continue
		}
		for _, task := range tasks {
			mu.Lock()
			if running[task.ID] {
				mu.Unlock()
				continue
			}
			running[task.ID] = true
			mu.Unlock()
			go processTask(task)
		}
		time.Sleep(3 * time.Second)
	}
}

func processTask(task models.SearchTask) {
	defer func() {
		mu.Lock()
		delete(running, task.ID)
		mu.Unlock()
	}()
	ctx := context.Background()
	if err := firebase.UpdateTaskStatus(ctx, task.ID, "processing"); err != nil {
		log.Printf("Error updating task %s to processing: %v", task.ID, err)
	}
	var allJobs []models.Job
	var muJobs sync.Mutex
	var wg sync.WaitGroup
	for _, sc := range scrapers {
		sourceEnabled := false
		for _, src := range task.Sources {
			if sc.Name() == src {
				sourceEnabled = true
				break
			}
		}
		if !sourceEnabled {
			continue
		}
		wg.Add(1)
		go func(s scraper.Scraper) {
			defer wg.Done()
			log.Printf("Scraping %s for keyword: %s, location: %s", s.Name(), task.Keyword, task.Location)
			jobs, err := s.Scrape(task.Keyword, task.Location, task.RangeKm)
			if err != nil {
				log.Printf("Error scraping %s: %v", s.Name(), err)
				return
			}
			muJobs.Lock()
			allJobs = append(allJobs, jobs...)
			muJobs.Unlock()
			log.Printf("Scraped %d jobs from %s", len(jobs), s.Name())
		}(sc)
	}
	wg.Wait()
	if len(allJobs) == 0 {
		log.Printf("No jobs from real scrapers, using mock data for demo")
		jobs, err := mockScraper.Scrape(task.Keyword, task.Location, task.RangeKm)
		if err == nil {
			allJobs = jobs
		}
	}
	now := time.Now().Unix()
	for i := range allJobs {
		allJobs[i].TaskID = task.ID
		allJobs[i].CreatedAt = now
	}
	if len(allJobs) > 0 {
		database.Store.UpsertJobs(allJobs)
		log.Printf("Upserted %d jobs into master store for task %s", len(allJobs), task.ID)
	}
	if err := firebase.UpdateTaskStatus(ctx, task.ID, "completed"); err != nil {
		log.Printf("Error updating task %s to completed: %v", task.ID, err)
	}
	if err := firebase.UpdateTaskTotal(ctx, task.ID, len(allJobs)); err != nil {
		log.Printf("Error updating total for task %s: %v", task.ID, err)
	}
	log.Printf("Task %s completed with %d total jobs (master store now has %d)", task.ID, len(allJobs), database.Store.Count())
}

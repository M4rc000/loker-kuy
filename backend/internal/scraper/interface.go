package scraper

import "github.com/lokerkupy/backend/internal/models"

type Scraper interface {
	Name() string
	Scrape(keyword string, location string, rangeKm int) ([]models.Job, error)
}

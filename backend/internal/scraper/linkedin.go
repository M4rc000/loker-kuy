package scraper

import (
	"fmt"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/lokerkupy/backend/internal/models"
)

type LinkedinScraper struct {
	Timeout time.Duration
}

func (s *LinkedinScraper) Name() string { return "linkedin" }

func (s *LinkedinScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	timeout := s.Timeout
	if timeout == 0 {
		timeout = 40 * time.Second
	}
	ctx, cancel := newChromeContext(timeout)
	defer cancel()

	searchURL := fmt.Sprintf("https://www.linkedin.com/jobs/search/?keywords=%s", formatQuery(keyword))
	if location != "" {
		searchURL += "&location=" + formatQuery(location)
	}

	var jobsJSON string
	err := chromedp.Run(ctx,
		chromedp.Navigate(searchURL),
		chromedp.WaitReady("body", chromedp.ByQuery),
		chromedp.Sleep(5*time.Second),
		chromedp.Evaluate(parseJobsJS, &jobsJSON),
	)
	if err != nil {
		return nil, fmt.Errorf("linkedin scrape failed: %w", err)
	}

	return parseJobsJSON(jobsJSON, "linkedin")
}

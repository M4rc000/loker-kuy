package scraper

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/lokerkupy/backend/internal/models"
)

type JobstreetScraper struct {
	Timeout time.Duration
}

func (s *JobstreetScraper) Name() string { return "jobstreet" }

func (s *JobstreetScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	timeout := s.Timeout
	if timeout == 0 {
		timeout = 35 * time.Second
	}
	ctx, cancel := newChromeContext(timeout)
	defer cancel()

	q := strings.ReplaceAll(strings.TrimSpace(keyword), " ", "-")
	searchURL := fmt.Sprintf("https://www.jobstreet.co.id/id/%s-jobs", q)
	if location != "" {
		loc := strings.ReplaceAll(strings.TrimSpace(location), " ", "-")
		searchURL = fmt.Sprintf("https://www.jobstreet.co.id/id/%s-jobs-in-%s", q, loc)
	}

	var jobsJSON string
	err := chromedp.Run(ctx,
		chromedp.Navigate(searchURL),
		chromedp.WaitReady("body", chromedp.ByQuery),
		chromedp.Sleep(6*time.Second),
		chromedp.ActionFunc(func(ctx context.Context) error {
			_ = chromedp.Evaluate(`window.scrollTo(0, document.body.scrollHeight)`, nil).Do(ctx)
			return nil
		}),
		chromedp.Sleep(2*time.Second),
		chromedp.Evaluate(parseJobsJS, &jobsJSON),
	)
	if err != nil {
		return nil, fmt.Errorf("jobstreet scrape failed: %w", err)
	}

	return parseJobsJSON(jobsJSON, "jobstreet")
}

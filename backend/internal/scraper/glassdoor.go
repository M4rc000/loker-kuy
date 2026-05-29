package scraper

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/lokerkupy/backend/internal/models"
)

type GlassdoorScraper struct {
	Timeout time.Duration
}

func (s *GlassdoorScraper) Name() string { return "glassdoor" }

func (s *GlassdoorScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	timeout := s.Timeout
	if timeout == 0 {
		timeout = 35 * time.Second
	}
	ctx, cancel := newChromeContext(timeout)
	defer cancel()

	q := url.QueryEscape(keyword)
	searchURL := fmt.Sprintf("https://www.glassdoor.com/Job/jobs.htm?sc.keyword=%s", q)
	if location != "" {
		searchURL += "&sc.location=" + url.QueryEscape(location)
		if rangeKm > 0 {
			searchURL += fmt.Sprintf("&radius=%d", rangeKm)
		}
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
		return nil, fmt.Errorf("glassdoor scrape failed: %w", err)
	}

	return parseJobsJSON(jobsJSON, "glassdoor")
}

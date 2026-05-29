package scraper

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/lokerkupy/backend/internal/models"
)

type KalibrrScraper struct {
	Timeout time.Duration
}

func (s *KalibrrScraper) Name() string { return "kalibrr" }

func (s *KalibrrScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	timeout := s.Timeout
	if timeout == 0 {
		timeout = 30 * time.Second
	}
	ctx, cancel := newChromeContext(timeout)
	defer cancel()

	q := url.QueryEscape(keyword)
	searchURL := fmt.Sprintf("https://www.kalibrr.com/jobs?search=%s", q)
	if location != "" {
		searchURL += "&location=" + url.QueryEscape(location)
	}

	var jobsJSON string
	err := chromedp.Run(ctx,
		chromedp.Navigate(searchURL),
		chromedp.WaitReady("body", chromedp.ByQuery),
		chromedp.Sleep(5*time.Second),
		chromedp.ActionFunc(func(ctx context.Context) error {
			_ = chromedp.Evaluate(`window.scrollTo(0, document.body.scrollHeight)`, nil).Do(ctx)
			return nil
		}),
		chromedp.Sleep(2*time.Second),
		chromedp.Evaluate(parseJobsJS, &jobsJSON),
	)
	if err != nil {
		return nil, fmt.Errorf("kalibrr scrape failed: %w", err)
	}

	return parseJobsJSON(jobsJSON, "kalibrr")
}

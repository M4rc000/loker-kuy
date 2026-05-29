package scraper

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/lokerkupy/backend/internal/models"
)

type GoogleJobsScraper struct {
	Timeout time.Duration
}

func (s *GoogleJobsScraper) Name() string { return "google" }

func (s *GoogleJobsScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	timeout := s.Timeout
	if timeout == 0 {
		timeout = 40 * time.Second
	}
	ctx, cancel := newChromeContext(timeout)
	defer cancel()

	query := strings.ReplaceAll(keyword, " ", "+")
	searchURL := fmt.Sprintf("https://www.google.com/search?q=%s+jobs", query)
	if location != "" {
		searchURL += "+in+" + strings.ReplaceAll(location, " ", "+")
	}

	var jobsJSON string
	err := chromedp.Run(ctx,
		chromedp.Navigate(searchURL),
		chromedp.WaitReady("body", chromedp.ByQuery),
		chromedp.Sleep(6*time.Second),
		chromedp.ActionFunc(func(ctx context.Context) error {
			_ = chromedp.Evaluate(`window.scrollTo(0, 600)`, nil).Do(ctx)
			return nil
		}),
		chromedp.Sleep(1*time.Second),
		chromedp.Evaluate(parseJobsJS, &jobsJSON),
	)
	if err != nil {
		return nil, fmt.Errorf("google jobs scrape failed: %w", err)
	}

	return parseJobsJSON(jobsJSON, "google")
}

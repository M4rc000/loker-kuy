package scraper

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/lokerkupy/backend/internal/models"
)

type TopKarirScraper struct {
	Timeout time.Duration
}

func (s *TopKarirScraper) Name() string { return "topkarir" }

func (s *TopKarirScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	timeout := s.Timeout
	if timeout == 0 {
		timeout = 30 * time.Second
	}
	ctx, cancel := newChromeContext(timeout)
	defer cancel()

	q := url.QueryEscape(keyword)
	searchURL := fmt.Sprintf("https://www.topkarir.com/lowongan?keyword=%s", q)
	if location != "" {
		searchURL += "&lokasi=" + url.QueryEscape(location)
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
		return nil, fmt.Errorf("topkarir scrape failed: %w", err)
	}

	return parseJobsJSON(jobsJSON, "topkarir")
}

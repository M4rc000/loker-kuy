package scraper

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/lokerkupy/backend/internal/models"
)

type GlintsScraper struct {
	Timeout time.Duration
}

func (s *GlintsScraper) Name() string { return "glints" }

func (s *GlintsScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	timeout := s.Timeout
	if timeout == 0 {
		timeout = 30 * time.Second
	}
	ctx, cancel := newChromeContext(timeout)
	defer cancel()

	q := strings.ReplaceAll(keyword, " ", "%20")
	searchURL := fmt.Sprintf("https://glints.com/id/opportunities/jobs?keyword=%s", q)
	if location != "" {
		loc := strings.ReplaceAll(location, " ", "%20")
		searchURL += "&location=" + loc
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
		return nil, fmt.Errorf("glints scrape failed: %w", err)
	}

	return parseJobsJSON(jobsJSON, "glints")
}

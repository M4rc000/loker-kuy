package scraper

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/google/uuid"
	"github.com/lokerkupy/backend/internal/models"
)

type IndeedScraper struct {
	Timeout time.Duration
}

func (s *IndeedScraper) Name() string { return "indeed" }

func (s *IndeedScraper) Scrape(keyword string, location string, rangeKm int) ([]models.Job, error) {
	timeout := s.Timeout
	if timeout == 0 {
		timeout = 35 * time.Second
	}
	ctx, cancel := newChromeContext(timeout)
	defer cancel()

	q := url.QueryEscape(keyword)
	searchURL := fmt.Sprintf("https://id.indeed.com/jobs?q=%s&limit=20", q)
	if location != "" {
		searchURL += "&l=" + url.QueryEscape(location)
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
		return nil, fmt.Errorf("indeed scrape failed: %w", err)
	}

	return parseJobsJSON(jobsJSON, "indeed")
}

const parseJobsJS = `(() => {
    const cards = document.querySelectorAll('[class*="job"], [class*="Job"], [class*="card"], [data-testid*="job"], article, li[class*="job"]');
    const results = [];
    const seen = new Set();
    cards.forEach(el => {
        const title = (el.querySelector('[class*="title"], [class*="jobTitle"], h2, h3, a[class*="job"]')?.innerText || '').trim();
        const company = (el.querySelector('[class*="company"], [class*="employer"], [class*="EmpInfo"]')?.innerText || '').trim();
        const locText = (el.querySelector('[class*="location"], [class*="Location"]')?.innerText || '').trim();
        const salaryText = (el.querySelector('[class*="salary"], [class*="Salary"], [class*="est"]')?.innerText || '').trim();
        const link = el.querySelector('a')?.href || '';
        if (title && title.length > 2 && !seen.has(title+company)) {
            seen.add(title+company);
            results.push({title, company: company || '', location: locText, salary: salaryText, link});
        }
    });
    return JSON.stringify(results);
})()`

func parseJobsJSON(jobsJSON string, source string) ([]models.Job, error) {
	var raw []struct {
		Title    string `json:"title"`
		Company  string `json:"company"`
		Location string `json:"location"`
		Salary   string `json:"salary"`
		Link     string `json:"link"`
	}
	if err := json.Unmarshal([]byte(jobsJSON), &raw); err != nil {
		return nil, err
	}
	var jobs []models.Job
	for _, j := range raw {
		if j.Title == "" || j.Company == "" {
			continue
		}
		jobs = append(jobs, models.Job{
			ID:       uuid.New().String(),
			Title:    j.Title,
			Company:  j.Company,
			Location: j.Location,
			Salary:   j.Salary,
			Source:   source,
			URL:      j.Link,
			PostedAt: time.Now().Format("2006-01-02"),
		})
	}
	return jobs, nil
}

package scraper

import (
	"context"
	"io"
	"log"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
)

var discardLogger = log.New(io.Discard, "", 0)

func formatQuery(s string) string {
	return strings.ReplaceAll(strings.TrimSpace(s), " ", "%20")
}

func newChromeContext(timeout time.Duration) (context.Context, context.CancelFunc) {
	allocCtx, allocCancel := chromedp.NewExecAllocator(context.Background(),
		append(chromedp.DefaultExecAllocatorOptions[:],
			chromedp.Flag("headless", true),
			chromedp.Flag("disable-gpu", true),
			chromedp.Flag("no-sandbox", true),
			chromedp.Flag("disable-dev-shm-usage", true),
			chromedp.Flag("disable-web-security", true),
			chromedp.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"),
		)...,
	)

	ctx, cancel := chromedp.NewContext(allocCtx,
		chromedp.WithLogf(discardLogger.Printf),
		chromedp.WithErrorf(discardLogger.Printf),
		chromedp.WithDebugf(discardLogger.Printf),
	)
	ctx, timeoutCancel := context.WithTimeout(ctx, timeout)

	return ctx, func() {
		timeoutCancel()
		cancel()
		allocCancel()
	}
}

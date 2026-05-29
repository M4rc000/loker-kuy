package worker

import (
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/lokerkupy/backend/internal/database"
	"github.com/lokerkupy/backend/internal/models"
	"github.com/lokerkupy/backend/internal/scraper"
)

var autoScrapers = []scraper.Scraper{
	&scraper.IndeedScraper{Timeout: 120 * time.Second},
	&scraper.LinkedinScraper{Timeout: 120 * time.Second},
	&scraper.JobstreetScraper{Timeout: 120 * time.Second},
	&scraper.GlintsScraper{Timeout: 120 * time.Second},
	&scraper.GoogleJobsScraper{Timeout: 120 * time.Second},
	&scraper.KalibrrScraper{Timeout: 120 * time.Second},
	&scraper.KitaLulusScraper{Timeout: 120 * time.Second},
	&scraper.GlassdoorScraper{Timeout: 120 * time.Second},
	&scraper.KarirComScraper{Timeout: 120 * time.Second},
	&scraper.TopKarirScraper{Timeout: 120 * time.Second},
}

var autoLocations = []string{
	"Jakarta", "Jakarta Pusat", "Jakarta Selatan", "Jakarta Timur",
	"Jakarta Barat", "Jakarta Utara", "Bogor", "Depok",
	"Tangerang", "Tangerang Selatan", "Bekasi",
	"Cikarang", "Karawang", "Cikampek", "Bandung",
}

var autoKeywords = []string{
	"Store Associate", "Store Crew", "Store Manager", "Store Leader",
	"Store Supervisor", "Store Admin", "Store Keeper", "Store Staff",
	"Retail Staff", "Retail Sales", "Retail Supervisor", "Retail Executive",
	"Retail Operations", "Retail Marketing", "Retail Trainer", "Retail Buyer",
	"Retail Analyst", "Retail Business Development", "Retail Assistant",
	"Sales Associate", "Sales Assistant", "Sales Consultant",
	"Sales Representative", "Sales Promotion", "Sales Counter",
	"Sales Lead", "Sales Supervisor", "Sales Manager",
	"Cashier", "Customer Service", "Customer Experience",
	"Merchandiser", "Visual Merchandiser", "Display Coordinator",
	"Brand Ambassador", "Product Specialist", "Product Demonstrator",
	"Fashion Consultant", "Beauty Advisor", "Counter Sales",
	"Stockist Staff", "Inventory Clerk", "Inventory Staff",
	"Warehouse Staff", "Warehouse Clerk", "Logistics Staff",
	"Department Manager", "Assistant Store Manager", "Branch Manager",
	"Area Manager", "Category Specialist", "Category Manager",
	"Concierge", "Showroom Host", "Showroom Staff",
	"E-commerce Staff", "E-commerce Specialist", "Online Shop Admin",
	"Marketplace Specialist", "Marketplace Admin",
	"Digital Marketing Retail", "Customer Relation",
	"Membership Staff", "Loyalty Specialist",
	"Purchasing Staff", "Procurement Staff",
	"Supply Chain Staff", "Demand Planner",
	"Allocation Staff", "Distribution Staff",
	"Quality Control Retail", "Loss Prevention", "Security Retail",
	"Visual Display", "VM Coordinator", "VM Staff",
	"Fitting Staff", "Tailor Retail", "Alteration Staff",
	"Receiving Staff", "Shipping Clerk", "Packer Retail",
	"Floor Supervisor", "Team Leader Retail", "Shift Leader Retail",
	"Customer Service Supervisor", "Complaint Handling",
	"Cashier Supervisor", "Frontliner", "Host Retail", "Greeter",
	"POP Coordinator", "Promo Staff", "Event Retail",
	"Outlet Manager", "Toko Manager", "Retail Operation Manager",
	"Admin Staff", "General Affair", "HR Staff",
	"Accounting Staff", "Office Assistant", "IT Support",
	"Graphic Designer", "Marketing Staff", "Finance Staff", "Legal Staff",
}

func StartAutoScraper() {
	shuffleLocations()
	shuffleKeywords()
	go func() {
		for {
			log.Println("[AutoScraper] Starting scheduled scrape cycle")
			runAutoScrapeCycle()
			log.Println("[AutoScraper] Cycle complete, next in ~2h24m")
			time.Sleep(2*time.Hour + 24*time.Minute)
		}
	}()
}

func shuffleLocations() {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	rng.Shuffle(len(autoLocations), func(i, j int) {
		autoLocations[i], autoLocations[j] = autoLocations[j], autoLocations[i]
	})
}

func shuffleKeywords() {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	rng.Shuffle(len(autoKeywords), func(i, j int) {
		autoKeywords[i], autoKeywords[j] = autoKeywords[j], autoKeywords[i]
	})
}

func runAutoScrapeCycle() {
	var wg sync.WaitGroup
	var mu sync.Mutex
	var allJobs []models.Job
	for _, sc := range autoScrapers {
		wg.Add(1)
		go func(s scraper.Scraper) {
			defer wg.Done()
			loc := pickRandomLocation()
			kw := pickRandomKeyword()
			log.Printf("[AutoScraper] Scraping %s | keyword=%s location=%s", s.Name(), kw, loc)
			jobs, err := s.Scrape(kw, loc, 50)
			if err != nil {
				log.Printf("[AutoScraper] Error scraping %s: %v", s.Name(), err)
				return
			}
			mu.Lock()
			allJobs = append(allJobs, jobs...)
			mu.Unlock()
			log.Printf("[AutoScraper] Got %d jobs from %s", len(jobs), s.Name())
		}(sc)
	}
	wg.Wait()
	if len(allJobs) == 0 {
		log.Println("[AutoScraper] No jobs found, skipping upsert")
		return
	}
	now := time.Now().Unix()
	for i := range allJobs {
		allJobs[i].CreatedAt = now
	}
	database.Store.UpsertJobs(allJobs)
	log.Printf("[AutoScraper] Upserted %d jobs into master store (total: %d)", len(allJobs), database.Store.Count())
}

func pickRandomLocation() string {
	return autoLocations[rand.Intn(len(autoLocations))]
}

func pickRandomKeyword() string {
	return autoKeywords[rand.Intn(len(autoKeywords))]
}

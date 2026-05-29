package main

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/lokerkupy/backend/internal/api"
	"github.com/lokerkupy/backend/internal/database"
	"github.com/lokerkupy/backend/internal/firebase"
	"github.com/lokerkupy/backend/internal/worker"
)

func main() {
	godotenv.Load()
	if err := firebase.Init(); err != nil {
		log.Fatalf("Failed to initialize Firebase: %v", err)
	}
	log.Println("Firebase connected successfully")
	if err := database.InitMasterStore(); err != nil {
		log.Fatalf("Failed to initialize master store: %v", err)
	}
	database.AutoPersist(30 * time.Second)
	log.Println("Master store initialized")
	go worker.StartWorker()
	log.Println("Background worker started")
	go worker.StartAutoScraper()
	log.Println("Auto-scraper started (every ~2h24m)")
	router := api.SetupRouter()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	router.Run(":" + port)
}

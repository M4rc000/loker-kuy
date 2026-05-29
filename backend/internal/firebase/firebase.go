package firebase

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"sync"

	"github.com/lokerkupy/backend/internal/models"
)

var (
	databaseURL string
	authSecret  string
	useLocal    bool
	localStore  *localDB
)

type localDB struct {
	mu     sync.RWMutex
	tasks  map[string]models.SearchTask
	loaded bool
}

func Init() error {
	databaseURL = os.Getenv("FIREBASE_DATABASE_URL")
	if databaseURL == "" {
		useLocal = true
		localStore = &localDB{
			tasks: make(map[string]models.SearchTask),
		}
		localStore.loadFromDisk()
		fmt.Println("Firebase not configured, using local task storage (data/tasks.json)")
		return nil
	}
	databaseURL = strings.TrimRight(databaseURL, "/")
	authSecret = os.Getenv("FIREBASE_SECRET")
	if authSecret == "" {
		authSecret = os.Getenv("FIREBASE_AUTH_SECRET")
	}
	return nil
}

func apiURL(path string) string {
	url := fmt.Sprintf("%s/%s.json", databaseURL, path)
	if authSecret != "" {
		url += fmt.Sprintf("?auth=%s", authSecret)
	}
	return url
}

func apiURLWithQuery(path, query string) string {
	url := fmt.Sprintf("%s/%s.json?%s", databaseURL, path, query)
	if authSecret != "" {
		url += fmt.Sprintf("&auth=%s", authSecret)
	}
	return url
}

func (db *localDB) loadFromDisk() {
	os.MkdirAll("data", 0755)
	if b, err := os.ReadFile("data/tasks.json"); err == nil {
		var raw map[string]json.RawMessage
		if err := json.Unmarshal(b, &raw); err == nil {
			for k, v := range raw {
				var t models.SearchTask
				if err := json.Unmarshal(v, &t); err == nil {
					db.tasks[k] = t
				}
			}
		}
	}
	db.loaded = true
}

func (db *localDB) saveTasks() {
	b, _ := json.MarshalIndent(db.tasks, "", "  ")
	os.WriteFile("data/tasks.json", b, 0644)
}

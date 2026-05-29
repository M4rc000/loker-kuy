package models

type SearchTask struct {
	ID        string   `json:"id" firestore:"id"`
	Keyword   string   `json:"keyword" firestore:"keyword"`
	Location  string   `json:"location" firestore:"location"`
	RangeKm   int      `json:"range_km" firestore:"range_km"`
	Status    string   `json:"status" firestore:"status"`
	Sources   []string `json:"sources" firestore:"sources"`
	Education []string `json:"education,omitempty"`
	CreatedAt int64    `json:"created_at" firestore:"created_at"`
	TotalJobs int      `json:"total_jobs" firestore:"total_jobs"`
}

type Job struct {
	ID          string `json:"id" firestore:"id"`
	TaskID      string `json:"task_id,omitempty" firestore:"task_id"`
	Title       string `json:"title" firestore:"title"`
	Company     string `json:"company" firestore:"company"`
	Location    string `json:"location" firestore:"location"`
	Salary      string `json:"salary" firestore:"salary"`
	Description string `json:"description" firestore:"description"`
	Source      string `json:"source" firestore:"source"`
	URL         string `json:"url" firestore:"url"`
	PostedAt    string `json:"posted_at" firestore:"posted_at"`
	Category    string `json:"category" firestore:"category"`
	JobType     string `json:"job_type" firestore:"job_type"`
	WorkMode    string `json:"work_mode" firestore:"work_mode"`
	Education   string `json:"education" firestore:"education"`
	Experience  string `json:"experience" firestore:"experience"`
	CreatedAt   int64  `json:"created_at" firestore:"created_at"`
	UpdatedAt   int64  `json:"updated_at,omitempty"`
}

type SearchRequest struct {
	Keyword   string   `json:"keyword" binding:"required"`
	Sources   []string `json:"sources"`
	Location  string   `json:"location"`
	RangeKm   int      `json:"range_km"`
	Education []string `json:"education"`
}

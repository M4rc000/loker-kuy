package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lokerkupy/backend/internal/database"
	"github.com/lokerkupy/backend/internal/firebase"
	"github.com/lokerkupy/backend/internal/models"
)

func SearchJobs(c *gin.Context) {
	var req models.SearchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}
	if req.Keyword == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Keyword is required"})
		return
	}
	if len(req.Sources) == 0 {
		req.Sources = []string{"indeed", "jobstreet", "glints", "google", "linkedin"}
	}
	task := models.SearchTask{
		ID:        uuid.New().String(),
		Keyword:   req.Keyword,
		Location:  req.Location,
		RangeKm:   req.RangeKm,
		Status:    "pending",
		Sources:   req.Sources,
		Education: req.Education,
		CreatedAt: time.Now().Unix(),
	}
	if err := firebase.CreateTask(c.Request.Context(), task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create search task"})
		return
	}
	cachedJobs := database.Store.SearchJobs(req.Keyword, req.Location, req.Education, 100)
	c.JSON(http.StatusOK, gin.H{
		"task_id":    task.ID,
		"status":     task.Status,
		"jobs":       cachedJobs,
		"total_jobs": len(cachedJobs),
		"cached":     len(cachedJobs) > 0,
	})
}

func GetTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task ID is required"})
		return
	}
	task, err := firebase.GetTask(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}
	jobs := database.Store.SearchJobs(task.Keyword, task.Location, task.Education, 100)
	c.JSON(http.StatusOK, gin.H{
		"task_id":    task.ID,
		"keyword":    task.Keyword,
		"location":   task.Location,
		"range_km":   task.RangeKm,
		"status":     task.Status,
		"sources":    task.Sources,
		"total_jobs": len(jobs),
		"jobs":       jobs,
	})
}

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type LogEvent struct {
	Timestamp string `json:"timestamp"`
	Service   string
	Level     string
	Message   string
	Route     string

}

func main() {
	// ✅ Read server URL from environment (for Docker)
	serverURL := os.Getenv("SERVER_URL")
	if serverURL == "" {
		serverURL = "http://localhost:8080" // Fallback for local dev
	}

	services := []string{"payment-service", "auth-service", "api-gateway", "database"}

	// 3 Burst cycles: HEALTHY → CRASH → HEALTHY (perfect Time-Travel demo)
	for cycle := 1; cycle <= 3; cycle++ {
		fmt.Printf("\n🔄 CYCLE %d: HEALTHY PHASE (20 logs, INFO)...\n", cycle)

		// HEALTHY: Low volume INFO logs (2min window)
		for i := 0; i < 20; i++ {
			log := LogEvent{
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Service:   services[i%4],
				Level:     "INFO",
				Message:   fmt.Sprintf("User session #%d active, latency=45ms", i+1),
				Route:     "/api/users/login",
			}
			sendLog(serverURL, log)
			time.Sleep(3 * time.Second) // Realistic rate
		}

		fmt.Printf("\n💥 CYCLE %d: CRASH PHASE (100 ERRORs, flood)...\n", cycle)

		// CRASH: ERROR flood (30s window)
		for i := 0; i < 100; i++ {
			log := LogEvent{
				Timestamp: time.Now().UTC().Format(time.RFC3339), // FRESH timestamps!
				Service:   services[i%4],
				Level:     "ERROR",
				Message:   fmt.Sprintf("Stripe API timeout #%d - key=sk_live_xxx expired", i+1),
				Route:     "/api/payments/process",
			}
			sendLog(serverURL, log)
			time.Sleep(200 * time.Millisecond) // FLOOD!
		}

		fmt.Printf("\n✅ CYCLE %d COMPLETE - Time-Travel ready! (Check UI: healthy=just now, crash=2min ago)\n\n", cycle)
		time.Sleep(10 * time.Second)
	}
}

func sendLog(url string, log LogEvent) {
	data, _ := json.Marshal(log)
	resp, err := http.Post(url+"/ingest", "application/json", bytes.NewReader(data))
	if err == nil && resp.StatusCode == 201 {
		fmt.Printf("✅ %s %s %s\n", log.Timestamp[:19], log.Service, log.Level)
	}
}

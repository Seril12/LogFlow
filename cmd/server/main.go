package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

type LogEvent struct {
	Service   string
	Level     string
	Message   string
	Timestamp string
}

var (
	mu   sync.Mutex
	logs []LogEvent
)

func main() {

	http.HandleFunc("/ingest", func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		body, _ := io.ReadAll(r.Body)

		var evt LogEvent
		if err := json.Unmarshal(body, &evt); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		evt.Timestamp = time.Now().UTC().Format(time.RFC3339)

		mu.Lock()
		logs = append(logs, evt)
		mu.Unlock()

		fmt.Println("STORED:", evt)
		w.WriteHeader(http.StatusOK)
	})

	http.HandleFunc("/logs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		serviceFilter := r.URL.Query().Get("service")

		mu.Lock()
		defer mu.Unlock()

		var out []LogEvent
		for _, evt := range logs {
			if serviceFilter == "" || evt.Service == serviceFilter {
				out = append(out, evt)
			}
		}

		json.NewEncoder(w).Encode(out)
	})

	fmt.Println("LogFlow server listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}

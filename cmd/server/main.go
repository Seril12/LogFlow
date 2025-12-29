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

		levelFilter := r.URL.Query().Get("level")
		serviceFilter := r.URL.Query().Get("service")
		fromStr := r.URL.Query().Get("from")
		toStr := r.URL.Query().Get("to")

		var fromTime, toTime time.Time
		var haveFrom, haveTo bool

		if fromStr != "" {
			if t, err := time.Parse(time.RFC3339, fromStr); err == nil {
				fromTime = t
				haveFrom = true
			}
		}
		if toStr != "" {
			if t, err := time.Parse(time.RFC3339, toStr); err == nil {
				toTime = t
				haveTo = true
			}
		}

		mu.Lock()
		defer mu.Unlock()

		var out []LogEvent
		for _, evt := range logs {
			if serviceFilter != "" && evt.Service != serviceFilter {
				continue
			}
			if levelFilter != "" && evt.Level != levelFilter {
				continue
			}

			evtTime, err := time.Parse(time.RFC3339, evt.Timestamp)
			if err != nil {
				continue
			}

			if haveFrom && evtTime.Before(fromTime) {
				continue
			}
			if haveTo && evtTime.After(toTime) {
				continue
			}

			out = append(out, evt)
		}

		json.NewEncoder(w).Encode(out)
	})

	fmt.Println("LogFlow server listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}

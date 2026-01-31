# Quick Reference - Frontend-Backend Connection

## Files Modified/Created

```
LogFlow/
├── UI/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js ✅ NEW - Centralized API service
│   │   ├── App.jsx ✅ UPDATED
│   │   ├── Dashboard.jsx ✅ UPDATED
│   │   └── components/
│   │       └── LogFlow/
│   │           ├── Sidebar.jsx ✅ UPDATED
│   │           └── Tabs/
│   │               ├── TimeTravelDebugger.jsx ✅ UPDATED
│   │               ├── AiAssistant.jsx ✅ UPDATED
│   │               └── SystemMetrics.jsx ✅ UPDATED
│   ├── .env.example ✅ NEW
│   └── vite.config.js (proxy already configured)
├── cmd/server/main.go (CORS already enabled)
├── FRONTEND_BACKEND_CONNECTION.md ✅ NEW - Setup guide
├── CONNECTION_SETUP_SUMMARY.md ✅ NEW - This summary
└── start-dev.bat ✅ NEW - Quick launcher
```

## Backend Endpoints

| Path          | Method | Purpose                                     |
| ------------- | ------ | ------------------------------------------- |
| `/health`     | GET    | Check backend status                        |
| `/logs`       | GET    | Get logs (query: start, end, limit)         |
| `/metrics`    | GET    | Get system metrics                          |
| `/ai/compare` | GET    | Compare log periods (query: healthy, crash) |
| `/ai/query`   | POST   | Query AI (body: {question})                 |
| `/ai/summary` | GET    | Get AI summary                              |
| `/ingest`     | POST   | Submit log (body: LogEvent)                 |

## API Service Functions

```javascript
import {
  checkHealth, // → GET /health
  getLogs, // → GET /logs
  getMetrics, // → GET /metrics
  compareLogsPeriods, // → GET /ai/compare
  queryAI, // → POST /ai/query
  getSummary, // → GET /ai/summary
  ingestLog, // → POST /ingest
} from "./services/api";
```

## Quick Start

### Windows (One Command)

```powershell
.\start-dev.bat
```

### Manual (PowerShell)

```powershell
# Terminal 1 - Backend
$env:GEMINI_API_KEY="YOUR_KEY"
$env:DATABASE_URL="YOUR_DB_URL"
go run ./cmd/server/main.go

# Terminal 2 - Frontend
cd UI
npm run dev
```

## Ports

- Frontend: `3000`
- Backend: `8080`

## Frontend URLs

- Main App: http://localhost:3000
- Time-Travel Debugger: http://localhost:3000 (tab)
- AI Assistant: http://localhost:3000 (tab)
- System Metrics: http://localhost:3000 (tab)

## How Requests Work

```
React Component
    ↓
Calls api.js function (e.g., getMetrics())
    ↓
Sends request to http://localhost:8080/metrics
    ↓
Vite proxy intercepts /api/* paths and removes /api prefix
    ↓
Backend handles request
    ↓
Response JSON returned to component
    ↓
Component updates UI
```

## Testing Connection

### From Frontend (DevTools Console)

```javascript
// Test API connection
fetch("http://localhost:8080/health")
  .then((r) => r.json())
  .then((d) => console.log(d));
```

### From Terminal

```powershell
# Test backend health
curl http://localhost:8080/health

# Test metrics endpoint
curl http://localhost:8080/metrics
```

## Common Errors & Fixes

| Error              | Fix                                                            |
| ------------------ | -------------------------------------------------------------- |
| CORS error         | Backend already has CORS. Check backend is running.            |
| Connection refused | Backend not running. Start with: `go run ./cmd/server/main.go` |
| Port in use        | Change port in environment or kill process                     |
| API 404            | Check endpoint name matches backend routes                     |
| Timeout            | Backend not responding, check logs                             |

## Environment Setup

Create `UI/.env`:

```
REACT_APP_API_URL=http://localhost:8080
```

Or set system variables (Windows):

```powershell
$env:GEMINI_API_KEY="your_key"
$env:DATABASE_URL="your_url"
$env:PORT="8080"
```

## Development Workflow

1. Make changes to frontend components
2. Vite auto-reloads (saves time!)
3. Changes to backend require manual restart
4. Use DevTools Network tab to debug API calls
5. Check both terminal outputs for errors

---

**All components are now properly connected to the backend! 🎉**

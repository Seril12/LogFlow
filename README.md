# 🌊 LogFlow: The Gemini-3 Cloud Sentinel
### Next-Generation SRE Observability & Multimodal AI Diagnostics

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://logflow.onrender.com)
[![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)](https://logflow.onrender.com)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=for-the-badge&logo=go)](https://go.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)

**LogFlow** is a professional-grade SRE (Site Reliability Engineering) platform designed for the **Google Gemini 3 Global Hackathon**. It transforms traditional logging into an interactive, AI-driven experience that "sees" your infrastructure architecture to diagnose failures faster than any human operator.

---

## ⚡ Live Deployment
*   **Backend (API Server)**: [https://logflow.onrender.com](https://logflow.onrender.com)
*   **Health Check**: [https://logflow.onrender.com/health](https://logflow.onrender.com/health)
*   **Frontend (Dashboard)**: *[Paste your Vercel URL here!]*

---

## 🔥 Winning Features (Judge Highlights)

### 📸 1. Multimodal Architecture Vision
Upload your system's architecture diagram (Excalidraw, LucidChart, or even a whiteboard sketch). **Gemini 3** "looks" at the diagram to understand service dependencies. 
> *"I see that the Payment-Service depends on the Auth-DB. Since the Auth-DB is reporting latency in the logs, this is likely why payments are failing."*

### 🕐 2. Time-Travel Differential Debugger
Compare two arbitrary points in time (e.g., "10:00 AM - All Green" vs "11:05 AM - Critical Failure"). The AI performs a **Differential Log Analysis**, highlighting exactly what changed in the system state between the two periods.

### 📍 3. Truth-Citations (Zerro Hallucination)
Every AI insight is backed by a specific Log ID. Clicking a citation in the chat will **auto-scroll** the log sidebar and trigger a **Royal Blue focus glow** on the exact log entry.

### 🛡️ 4. PII-Safe Sanitization (Go-Native)
Our high-concurrency Go backend automatically scrubs Emails, IP Addresses, and API Keys using regex patterns before data is sent to the AI, ensuring enterprise-grade compliance.

### � 5. Automated IR (Incident Response) Reports
Instantly generate branded, professional SRE post-mortem reports in PDF format based on the AI's findings.

---

## 🏗️ Architecture & Tech Stack

- **The Sentinel (Go Backend)**: A high-performance REST API managing log ingestion, PII scrubbing, and AI orchestration.
- **The Brain (Gemini 3 Flash)**: Utilizing the latest `gemini-1.5-flash` (via the v1beta endpoint) for multimodal reasoning.
- **The Vault (PostgreSQL)**: Secure, persistent storage for logs and metadata via Supabase.
- **The Command Center (React/Vite)**: A premium "Enterprise Elite" dashboard with high-contrast UI and real-time state synchronization.

---

## 🚀 Deployment & Local Setup

### 🐳 The One-Command Cloud (Docker)
Run the entire production-grade stack locally with zero configuration:
```bash
docker-compose up --build
```

### 🛠️ Local Development

1. **Backend**:
   ```bash
   # Add your GEMINI_API_KEY and DATABASE_URL to .env
   go run ./cmd/server/main.go
   ```

2. **Log Agent (Live Data Stream)**:
   This background agent simulates a distributed system. To point it at the **live cloud server**:
   ```powershell
   $env:SERVER_URL="https://logflow.onrender.com"
   go run ./cmd/agent/main.go
   ```

3. **Frontend**:
   ```bash
   cd UI
   npm install
   # Set VITE_API_URL in .env to point to your backend
   npm run dev
   ```

---

## 🛡️ Hackathon Verification Guide

1. **Verify AI Vision**: Go to **Time-Travel**, upload a diagram, and ask: *"How does my architecture impact the current errors?"*
2. **Verify Portability**: The system is fully containerized and cloud-ready, currently running on Render (Backend) and Vercel/Docker (Frontend).
3. **Verify Integrity**: Check the sidebar logs after an AI query to see the **Truth-Citation** highlight system in action.

---

Built with ❤️ by the **LogFlow Team** for the Google Gemini 3 Global Hackathon.

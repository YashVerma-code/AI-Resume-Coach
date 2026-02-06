# AI-Resume-Coach

A full-stack application that extracts text from resumes, analyzes them using LLMs, and provides mock interview chats and feedback.

The repository contains **three main services**:

* **Frontend** – Next.js (React, TypeScript)
* **Backend** – Node.js (Express, Prisma, PostgreSQL)
* **OCR Server** – Python FastAPI (Tesseract + Poppler)

---

##  Key Features

* Resume text extraction using a **dedicated OCR microservice** (FastAPI + Tesseract)
* Resume analysis, interview question generation, and **streaming chat powered by LLMs**
* Next.js frontend with **Clerk authentication**
* Modular microservice architecture
* Docker & Docker Compose support for easy local setup

---

##  Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Clerk Authentication

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL

### OCR Server

* Python
* FastAPI
* Tesseract OCR
* Poppler (PDF processing)

### Dev & Infra

* Docker
* Docker Compose

---

##  Repository Structure

```
.
├── frontend/              # Next.js frontend
├── backend/               # Express backend + Prisma
├── ocr-server/            # FastAPI OCR microservice
├── prisma/
│   └── migrations/        # Database migrations
├── docker-compose.yml     # Orchestrates all services
└── README.md
```

---

## 🗄 Database Schema (Prisma)

The Prisma schema and migrations include the following models:

* Resume
* Chat
* Message
* InterviewQuestion
* Feedback
* TokenUsage

Migration SQL files are available under `prisma/migrations`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@host:5432/db
CLIENT_URL=http://localhost:3000
PORT=8080

CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx

# LLM / AI keys
OPENAI_API_KEY=...
```

---

### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_OCR_URL=http://localhost:8000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

---

## 🚀 Quick Start (Recommended: Docker Compose)

This is the easiest way to run **all services together**.

From the repository root:

```bash
docker-compose up --build
```

This will start:

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:8080](http://localhost:8080)
* OCR Server → [http://localhost:8000](http://localhost:8000)

---

## 🛠 Local Development (Manual Setup)

If you prefer running services individually, follow the steps below.

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create `.env` in `backend/` (see env section above).

Run migrations and generate Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

Start backend server:

```bash
npm run dev
```

Backend entry point:
`backend/index.js`
Routes are defined under `src/routes/*`.

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` in `frontend/` (see env section above).

Start the frontend:

```bash
npm run dev
```

The frontend runs on **[http://localhost:3000](http://localhost:3000)**.

---

## 🔍 OCR Server Setup (Important)

### System Dependencies (Required)

The OCR server **requires Tesseract and Poppler** to be installed on your system.

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y tesseract-ocr poppler-utils
```

#### macOS (Homebrew)

```bash
brew install tesseract poppler
```

> ⚠️ On Windows, Tesseract must be installed manually and added to PATH.
> Docker is strongly recommended to avoid platform issues.

---

### Python Dependencies

Inside `ocr-server/requirements.txt`:

```txt
fastapi
uvicorn

pytesseract
Pillow
opencv-python
numpy

pdfplumber
pdf2image
```

---

### Run OCR Server Locally

```bash
cd ocr-server
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Swagger UI available at:
[http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🐳 OCR Server (Docker Note)

The `ocr-server/Dockerfile` installs required **system dependencies**:

* `tesseract-ocr`
* `poppler-utils`
* `libgl1` (for OpenCV)

Refer to `ocr-server/Dockerfile` for details.

---

## 🔁 Typical Development Workflow

1. Upload resume → OCR server extracts text
2. Backend stores raw text in `Resume`
3. LLM analyzes resume and generates interview content
4. Frontend displays feedback and interactive chat

---

## 📌 Notes & Pointers

* Backend API routes:

  * `/api/resume`
  * `/api/chat`
  * `/api/webhooks/clerk`
* OCR server accepts file uploads and returns extracted text
* Frontend communicates with backend and OCR server via environment-based URLs
* Streaming responses are handled in backend chat services

---

## 📦 Scripts Summary

| Service  | Command                        |
| -------- | ------------------------------ |
| Frontend | `npm run dev`                  |
| Backend  | `npm run dev`                  |
| OCR      | `uvicorn main:app --port 8000` |
| Docker   | `docker-compose up --build`    |

---


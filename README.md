# ChainProof

A full-stack project with a Next.js frontend and an Express backend, containerized with Docker.

## 📦 Project Structure

```
chainproof/
│
├─ frontend/   # Next.js frontend
├─ backend/    # Express backend
└─ docker-compose.yml  # Orchestration for frontend + backend
```
## 🚀 Quick Start (Docker Compose)


### 1. Prerequisites

* Docker and Docker Compose installed
* Node.js (optional, only if you run without Docker)

### 2. Clone the Repository

First, clone this repository to your local machine:
```
git clone https://github.com/monark-community/ChainProof
cd chainproof
```
### 3. Start All Services

From the root folder (chainproof/), run:
```
docker-compose up --build
```
This will:

- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:3000](http://localhost:3000)

Environment in Docker:
- Copy `.env.example` → `.env` at repo root and edit values.
- `NEXT_PUBLIC_API_URL` should point to backend service, e.g. `http://backend:5000`.
- Backend loads `.env` automatically; frontend receives `NEXT_PUBLIC_API_URL`.

### 4. Stop Services

Press CTRL + C in the terminal or run:
```
docker-compose down
```
### 5. Rebuild Everything (if dependencies change)

```
docker-compose up --build
```

## 🔧 Local Development (npm/pnpm)

If you prefer running locally:

```
cd backend
npm install
npm run dev   # Backend at [http://localhost:5000](http://localhost:5000)

cd frontend
npm install
npm run dev   # Frontend at [http://localhost:3000](http://localhost:3000)

Environment for local dev:
- Copy `.env.example` → `.env.local` at repo root and edit values.
- Frontend: define `NEXT_PUBLIC_API_URL=http://localhost:5000` in `.env.local`.
- Backend: auto-loads `.env.local` when not in Docker; falls back to `.env`.

Troubleshooting:
- If frontend cannot reach backend, verify `NEXT_PUBLIC_API_URL` and that backend is running on the same port.
- For Docker, ensure `.env` exists at repo root and `docker-compose` is run from that directory.
```

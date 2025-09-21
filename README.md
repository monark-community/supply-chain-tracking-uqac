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
## 🚀 Quick Start (Docker)


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

* Build and start the backend on [http://localhost:5000](http://localhost:5000)
* Build and start the frontend on [http://localhost:3000](http://localhost:3000)

### 4. Stop Services

Press CTRL + C in the terminal or run:
```
docker-compose down
```
### 5. Rebuild Everything (if dependencies change)

```
docker-compose up --build
```

## 🔧 Local Development (without Docker)

If you prefer running locally:

```
cd backend
npm install
npm run dev   # Backend at [http://localhost:5000](http://localhost:5000)

cd frontend
npm install
npm run dev   # Frontend at [http://localhost:3000](http://localhost:3000)
```

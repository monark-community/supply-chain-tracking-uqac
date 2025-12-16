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

# ChainProof

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![GitHub Issues](https://img.shields.io/github/issues/monark-community/ChainProof)
![GitHub Issues](https://img.shields.io/github/issues-pr/monark-community/ChainProof)
![GitHub Stars](https://img.shields.io/github/stars/monark-community/ChainProof)
![GitHub Forks](https://img.shields.io/github/forks/monark-community/ChainProof)

ChainProof is an MVP for blockchain-based supply-chain provenance and product authenticity verification. It records signed events from producers, shippers and retailers on-chain and lets end-users verify product provenance via QR codes.

## Overview

ChainProof provides an end-to-end minimal viable product that demonstrates immutable provenance recording, an admin interface for actors to submit transactions, and a public verification flow where consumers can scan a QR code to view decoded, verifiable event data. The stack uses a Next.js frontend, an Express + PostgreSQL backend, and a simple on-chain contract for signing transactions.

## Key Features

- 🚀 Immutable tracking: on-chain transaction records for each product event.
- ✅ Quick verification: QR-based consumer verification with decoded event history.
- 📃 Admin tools: CRUD for categories, units, contacts and transaction listings.

## Project Structure

```
ChainProof/
├── frontend/                  # Next.js app (app router)
│   ├── src/app/               # App routes and pages
│   └── src/components/        # UI components
├── backend/                   # Express API (TypeScript)
│   └── src/                   # Server source, routes, db helper
├── contracts/                 # Smart contract sources (Solidity)
├── mock-blockchain/           # Local blockchain (Hardhat) + deployment/test scripts
├── db-init/                   # SQL schema / initial data
├── docker-compose.yml         # Local development with Docker Compose
└── .env.example               # Example environment variables
```

## Getting Started

Prerequisites:
- Node.js 18+ (for local runs)
- Docker & Docker Compose (for containerized runs)

Recommended: copy `.env.example` to `.env.local` for local development or to `.env` when using Docker Compose.

Local (npm/pnpm):

```pwsh
# backend
cd backend
npm install
npm run dev

# frontend
cd ../frontend
npm install
npm run dev
```

Docker Compose:

```pwsh
# from repository root
cp .env.example .env
docker-compose up --build
```

## Available Scripts

Backend (from `backend/`):
- `npm run dev` — run in development with tsx/ts-node
- `npm run build` — compile for production
- `npm start` — start compiled server

Frontend (from `frontend/`):
- `npm run dev` — Next.js dev server
- `npm run build` — build for production
- `npm start` — run production server

## Deployment

- For production, build the frontend (`npm run build`) and backend, set appropriate production env vars (use `.env` in your CI/CD), and deploy behind a reverse proxy. Docker images can be produced from the included Dockerfiles and orchestrated with Kubernetes or Docker Compose in production-like environments.

## Documentation

- API routes include inline OpenAPI-style comments. See `backend/src/routes/` for route details.
- Smart contract: `contracts/SupplyChain.sol` contains the minimal transaction schema and event.
 - Local development blockchain: see `mock-blockchain/` for Hardhat config, contracts, and scripts to deploy and test locally.
 - Local development blockchain: see `mock-blockchain/` for Hardhat config, contracts, and scripts to deploy and test locally.

### Local blockchain & Tenderly (verify & inspect)

If you want to run the contract locally and push a transaction to Tenderly for inspection and verification, follow these steps.

1) Start a local Hardhat node

```pwsh
cd mock-blockchain
npm install
npx hardhat node
```

2) Deploy the contract to the running local node

```pwsh
# in a new terminal
cd mock-blockchain
npx hardhat run --network localhost scripts/deploy.ts
```

The deploy script will print the deployed contract address and the deployment transaction hash. Keep the transaction hash.

3) (Optional) Send a test transaction

```pwsh
npx hardhat run --network localhost scripts/sendTransaction.ts
```

4) Verify/inspect in Tenderly

- Create a Tenderly account and a project if you don't have one.
- In Tenderly, you can import a transaction by its hash (Transactions → Import Transaction). Paste the deploy or call transaction hash to inspect the execution, stack traces and state.
- To make the contract human-readable in Tenderly and enable debugging/alerts, add the contract ABI in the Tenderly project: go to Contracts → Add Contract → provide the contract address and paste the ABI (found in `mock-blockchain/artifacts/contracts/SupplyChain.sol/SupplyChain.json`).
- Once the ABI is uploaded, Tenderly will show decoded call data and let you simulate or debug transactions.

Notes:
- Tenderly also provides integrations with Hardhat (plugins / CLI) that can automate verification — see Tenderly docs if you want fully automated verification in CI.
- Verifying a contract in Tenderly requires providing the ABI (and optionally source) so Tenderly can decode inputs and show human-readable traces.

## Contribution

See [CONTRIBUTION.md](./CONTRIBUTION.md) to learn about contributions guidelines.

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) to learn about the code of conduct.

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](./LICENSE) file for details.

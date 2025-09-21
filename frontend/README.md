# ChainProof Frontend

This is the Next.js frontend for the ChainProof project.

## ⚙️ Tech Stack

* Next.js
* React
* Tailwind CSS
* TypeScript

## 🚀 Quick Start (Docker)

### Start with Docker only

From the project root (`chainproof/`), run:

```
docker-compose up --build frontend
```

Frontend will be available at:
[http://localhost:3000](http://localhost:3000)
(Host port 3000 → Container port 3000)

### Stop

```
docker-compose down
```

## 🖥️ Local Development (without Docker)

### 1. Install Dependencies

```
cd frontend
npm install
```

### 2. Run in Dev Mode

```
npm run dev
```

Frontend will run on:
[http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```
npm run build
npm start
```

## 📂 File Structure

```
frontend/
├─ app/               # Next.js 13+ App Router
│  ├─ page.tsx        # Home page
│  └─ layout.tsx      # Root layout
├─ public/            # Static assets
├─ styles/            # Global styles
├─ package.json
├─ Dockerfile
└─ tailwind.config.js
```

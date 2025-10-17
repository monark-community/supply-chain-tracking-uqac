
# ChainProof Backend

This is the Express.js backend service for the ChainProof project.

## ⚙️ Tech Stack

* Node.js + Express
* TypeScript support via tsx

##  Quick Start (Docker)

### Start with Docker only

From the project root (chainproof/), run:
```
docker-compose up --build backend
```

Backend will be available at:
[http://localhost:5000](http://localhost:5000)
(Host port 5000 → Container port 5000)

### Stop

```
docker-compose down
```

## 🖥️ Local Development (without Docker)

### 1. Install Dependencies

```
cd backend
npm install
```

### 2. Run in Dev Mode

```
npm run dev
```

Backend will run on:
[http://localhost:5000](http://localhost:5000)

### 3. Build for Production

```
npm run build
npm start
```

## 📂 File Structure
```
backend/
(project root)
├─ .env
├─ package.json
├─ tsconfig.json
└─ src/
   ├─ server.ts
   ├─ db.ts
   └─ routes/
      ├─ health.ts
      └─ trace.ts   

```



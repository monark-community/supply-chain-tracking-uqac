# ☕ ChainProof Backend

Backend du projet **ChainProof Coffee Supply**, développé avec **Node.js**, **Express**, **TypeScript**, **PostgreSQL** et **Swagger UI**.

Ce service gère :
- la **traçabilité** des produits (table `trace`)
- le **mapping blockchain** des événements (`blockchain_trace`)
- la **documentation Swagger** interactive pour tester l’API

---

## ⚙️ Tech Stack

- **Node.js + Express** – serveur web et API REST
- **TypeScript** – typage statique
- **PostgreSQL** – base de données principale (`coffee_db`)
- **pg** – client Node pour PostgreSQL
- **Swagger (swagger-ui-express + swagger-jsdoc)** – documentation API

---

## 🚀 Quick Start (avec Docker)

### Démarrage avec Docker uniquement

Depuis la racine du projet (ex: `chainproof/`):

```bash
docker-compose up --build backend
Le backend sera disponible sur :
👉 http://localhost:5000

(Host port 5000 → Container port 5000)

Arrêt
docker-compose down

Développement local (sans Docker)
1️⃣ Installer les dépendances
cd backend
npm install

2️⃣ Configurer l’environnement

Créer un fichier .env dans le dossier backend/ :

DB_HOST=localhost
DB_PORT=5432
DB_NAME=chainpoofcafe
DB_USER=chainuser
DB_PASS=.........
PORT=5000


⚠️ Ne pas versionner ce fichier (.gitignore).

3️⃣ Lancer en mode développement
npm run dev


API disponible sur :
👉 http://localhost:5000

Swagger UI :
👉 http://localhost:5000/swagger

4️⃣ Compiler et lancer en production
npm run build
npm start

📚 Documentation API (Swagger)

Swagger UI est accessible à l’adresse :

👉 http://localhost:5000/swagger

Elle permet de visualiser et tester directement :

GET /products/{id}/trace → Historique complet d’un produit

POST /trace → Ajouter un nouvel évènement de traçabilité

PATCH /trace/{uid}/blockchain → Associer une transaction blockchain

🗂️ Structure du projet
backend/
├─ src/
│  ├─ server.ts            # Point d’entrée Express + Swagger
│  ├─ db.ts                # Connexion PostgreSQL
│  └─ routes/
│     ├─ health.ts         # Route de test de santé
│     └─ trace.ts          # Routes de traçabilité (GET/POST/PATCH)
├─ package.json
├─ tsconfig.json
├─ .env.example            # Exemple de configuration d'environnement
└─ README.md

🧪 Tests rapides
Vérifier la santé de l’API
curl http://localhost:5000/health

Récupérer la timeline d’un produit
curl http://localhost:5000/products/P-001/trace

Créer un évènement de traçabilité
curl -X POST http://localhost:5000/trace \
  -H "Content-Type: application/json" \
  -d '{
    "trace_uid": "T-100",
    "product_id": "P-001",
    "event_type": "Transport",
    "occurred_at": "2025-09-18T10:00:00-04:00"
  }'
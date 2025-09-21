# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port Next.js (3000)
EXPOSE 3000

# Commande pour démarrer Next.js
CMD ["npm", "run", "dev"]

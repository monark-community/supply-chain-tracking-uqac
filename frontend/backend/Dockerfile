# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code to the container
COPY . .

# Expose port 5000 (match app.listen)
EXPOSE 5000

# Start backend server
CMD ["npm", "run", "dev"]

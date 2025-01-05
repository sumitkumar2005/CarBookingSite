# Step 1: Build the React Frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Step 2: Build the Node.js Backend
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Step 3: Combine Frontend and Backend into a Single Image
FROM node:18
WORKDIR /app

# Copy backend files
COPY --from=backend-build /app/backend /app

# Copy frontend build output to the backend's public folder
COPY --from=frontend-build /app/frontend/build /app/public

EXPOSE 5000
CMD ["node", "server.js"]

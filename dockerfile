# Step 1: Build the React Frontend
FROM node:18 AS frontend-build
WORKDIR /app/Frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ .
RUN npm run build

# Step 2: Build the Node.js Backend
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Step 3: Combine Frontend and Backend into a Single Image
FROM node:18

# Set the working directory for the entire application
WORKDIR /app

# Copy the backend files into the image
COPY --from=backend-build /app/backend /app/backend

# Copy the React build files into the backend's public folder (so that Express serves them)
COPY --from=frontend-build /app/Frontend/build /app/backend/public

# Expose the backend port (5000 or whichever port your backend uses)
EXPOSE 5000

# Command to run the Node.js backend server
CMD ["node", "backend/server.js"]

# Step 1: Build the React Frontend
FROM node:18 AS frontend-build
WORKDIR /carbookingsite/frontend
COPY frontend/package*.json ./  
RUN npm install
COPY frontend/ .  
RUN npm run build

# Step 2: Build the Node.js Backend
FROM node:18 AS backend-build
WORKDIR /carbookingsite/backend
COPY backend/package*.json ./  
RUN npm install
COPY backend/ .  

# Step 3: Combine Frontend and Backend into a Single Image
FROM node:18

# Set the working directory to the project root (where frontend and backend are located)
WORKDIR /carbookingsite

# Copy the backend files into the image
COPY --from=backend-build /carbookingsite/backend /carbookingsite/backend

# Copy the React build files into the backend's public folder (so that Express serves them)
COPY --from=frontend-build /carbookingsite/frontend/build /carbookingsite/backend/public

# Expose the backend port (5000 or whichever port your backend uses)
EXPOSE 5000

# Command to run the Node.js backend server
CMD ["node", "backend/server.js"]

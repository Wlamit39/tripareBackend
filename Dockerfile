# backend/Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 3100

# Start server
CMD ["npm", "run", "dev"]

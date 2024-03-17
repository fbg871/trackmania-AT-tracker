# Base image
FROM node:latest as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]


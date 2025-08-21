# Use an official Node.js image as a base
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy only package.json and install dependencies
COPY package.json ./
RUN npm install 

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 5000

# Command to run the backend server
CMD ["node", "server.js"]

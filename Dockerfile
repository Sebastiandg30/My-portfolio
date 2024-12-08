# Use Node.js as the base image
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all application files
COPY . .

# Build the application
RUN npm run build

# Start the application using Next.js's built-in server
CMD ["node", "server.js"]

# Expose the default Next.js port
EXPOSE 3000

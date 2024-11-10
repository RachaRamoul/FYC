# Use Node.js as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy only the package files initially and install dependencies
COPY server/package*.json ./
RUN npm install

# Copy the server code and client directory into the container
COPY server/ /app
COPY client/ /app/client

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]

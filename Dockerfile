# Use Node.js as the base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy only the package files initially and install dependencies
COPY server/package*.json ./
RUN npm install

RUN npm install -g nodemon

# Copy the server code and client directory into the container
COPY server/ /usr/src/app/server
COPY client/ /usr/src/app/client
COPY grpc/ /usr/src/app/grpc

EXPOSE 50051
# Expose port 3000
EXPOSE 3000

COPY start.sh /usr/src/app/start.sh

RUN chmod +x /usr/src/app/start.sh

# Command to run the application
CMD ["/usr/src/app/start.sh"]

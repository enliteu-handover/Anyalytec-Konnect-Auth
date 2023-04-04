# Define the base image
FROM node:18-alpine

# Create a working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port that the application listens on
EXPOSE $PORT

HEALTHCHECK --interval=5m --timeout=3s CMD curl -f http://localhost/$PORT || exit 1

# Start the application
CMD ["npm", "start"]

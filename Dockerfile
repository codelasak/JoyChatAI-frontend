# Use an official Node runtime as a parent image
FROM node:latest as build

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages
RUN yarn --exact

# Make port 4173 available to the world outside this container
EXPOSE 4173

# Start the React application in dev mode
CMD ["yarn", "start"]

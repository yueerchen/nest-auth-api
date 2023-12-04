# Use the official Node.js 16 image as the base image
FROM node:16.20.1-alpine

# Create and set the working directory in the container
WORKDIR /src

# Copy the application code to the container
COPY . /src

# Install application dependencies
RUN yarn

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]

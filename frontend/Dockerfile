# Use Node.js 20 as the base image
FROM node:20.18.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy files from the host to the container
COPY . .

# Install dependencies
RUN rm -rf node_modules package-lock.json && \
    npm install

# Expose the port the app runs on
EXPOSE 3000

# Set the environment variable for production
ENV NODE_ENV=production

# Command to start the application
CMD ["npm", "run", "dev"]
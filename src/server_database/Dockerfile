# 1. Use a lightweight Node.js image as base
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# 4. Install project dependencies
RUN npm install

# 5. Copy the rest of the application files
COPY . .

# 6. Expose the port the app listens on
EXPOSE 3000

# 7. Command to run the application when the container starts
CMD ["node", "app.js"]

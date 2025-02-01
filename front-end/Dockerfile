FROM node:22.13.1

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your frontend files
COPY . .

# Next.js typically runs on port 3000
EXPOSE 3000

# For development with hot reload, use:
CMD ["npm", "run", "dev"]

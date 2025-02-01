FROM node:22.13.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Express typically runs on port 4000 (or any other)
EXPOSE 4000

CMD ["npm", "run", "dev"]

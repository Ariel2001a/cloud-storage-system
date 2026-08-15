FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

RUN npm install -g @expo/ngrok

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel", "--non-interactive"]
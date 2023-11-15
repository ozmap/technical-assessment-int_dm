FROM node:20-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

EXPOSE ${API_PORT}

COPY . .

CMD ["npm", "start"]
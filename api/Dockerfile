FROM node:latest

WORKDIR /api 

COPY . .

RUN rm -rf node_modules
RUN npm i 

CMD ["npx", "ts-node", "src/index.ts"]

EXPOSE 3005
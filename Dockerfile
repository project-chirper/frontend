FROM node:latest

RUN npm install -g http-server

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

ENV API http://api-gateway:3001/

RUN npm run build

EXPOSE 80

CMD [ "http-server", "dist" ]
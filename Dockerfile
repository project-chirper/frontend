FROM node:latest
WORKDIR /app
COPY . /app
RUN npm install @vue/cli && npm rebuild node-sass
EXPOSE 8080
CMD npm run serve
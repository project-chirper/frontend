# build stage
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VUE_APP_API /api
ENV VUE_APP_SOCKET /socket
RUN npm run build

# production stage
FROM nginx:latest as production-stage
COPY --from=build-stage /app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
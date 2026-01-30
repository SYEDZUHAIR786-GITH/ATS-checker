# Frontend Dockerfile
FROM node:18-alpine AS frontend-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ .
RUN npm run build

# Backend Stage
FROM node:18-alpine AS backend

WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --production

COPY server/ .

EXPOSE 5001

CMD ["npm", "run", "dev"]

# Production Frontend Nginx
FROM nginx:alpine AS frontend-prod

COPY --from=frontend-build /app/client/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

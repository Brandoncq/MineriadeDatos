FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# IMPORTANTE: Aquí definiremos la URL real pública de tu backend
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx escucha en el 80 por defecto
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]


FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3000
ENV MODEL_URL=http://model:5000
ENV FRONTEND_URL=http://frontend:5173

EXPOSE 3000

CMD ["npm", "run", "start"]

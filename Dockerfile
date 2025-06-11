FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install ts-node typescript tsconfig-paths -g

COPY . .

# Copia o script para /usr/local/bin e dá permissão
COPY scripts/wait-for-redis.sh /usr/local/bin/wait-for-redis.sh
RUN chmod +x /usr/local/bin/wait-for-redis.sh

EXPOSE 3001

CMD ["npm", "run", "start:dev"]

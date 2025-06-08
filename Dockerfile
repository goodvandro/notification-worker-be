FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Copia os scripts para /usr/local/bin
COPY scripts/wait-for-redis.sh /usr/local/bin/wait-for-redis.sh
COPY scripts/wait-for-rabbit.sh /usr/local/bin/wait-for-rabbit.sh
RUN chmod +x /usr/local/bin/wait-for-redis.sh /usr/local/bin/wait-for-rabbit.sh

EXPOSE 3001

CMD ["npm", "run", "start:dev"]

FROM node:22-alpine

LABEL org.opencontainers.image.source=https://github.com/paulscherrerinstitute/rocrate-api

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "test"]

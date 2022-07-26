FROM node:16-alpine

RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

# copy source code to /app/src folder
COPY src /app/src
RUN npm run build

EXPOSE 3000
CMD [ "node", "./dist/main.js" ]
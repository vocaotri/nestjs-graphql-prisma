FROM node:20.9.0

WORKDIR /usr/app

COPY . .

RUN npm i
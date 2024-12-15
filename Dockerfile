FROM node:20.18.0-slim

WORKDIR /usr/src

RUN apt-get update -y

RUN npm install -g pnpm

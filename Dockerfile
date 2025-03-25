FROM node:22.14.0-slim

WORKDIR /usr/src

RUN apt-get update -y

RUN npm install -g pnpm

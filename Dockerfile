FROM node:20.18.1-slim

WORKDIR /usr/src

RUN apt-get update -y

RUN npm install -g pnpm@10.7

FROM node:18.19.0-slim

WORKDIR /usr/src

RUN apt-get update -y

RUN apt-get install curl unzip -y
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

RUN npm install -g pnpm
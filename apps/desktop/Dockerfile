FROM electronuserland/builder:wine

WORKDIR /usr/src/app

RUN apt-get update -y
RUN apt-get install libgtk-3-0 libatk-bridge2.0-0 libasound2 -y

RUN npm install -g pnpm

COPY apps/desktop/package.json .

RUN pnpm install
COPY apps/desktop .
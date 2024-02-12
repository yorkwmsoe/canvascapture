FROM electronuserland/builder:wine

WORKDIR /usr/src

RUN apt-get update -y
RUN apt-get install libgtk-3-0 libatk-bridge2.0-0 libasound2 -y

RUN npm install -g pnpm
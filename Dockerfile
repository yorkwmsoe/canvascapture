FROM electronuserland/builder:wine

WORKDIR /usr/src

RUN apt-get update -y

RUN npm install -g pnpm@10.7

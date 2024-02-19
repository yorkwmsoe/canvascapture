FROM ubuntu:23.10

WORKDIR /usr/src

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC

RUN apt-get update

# Install dependencies
RUN apt-get install -y curl

# Install Node.js 18.x
RUN curl -SLO https://deb.nodesource.com/nsolid_setup_deb.sh
RUN chmod 500 nsolid_setup_deb.sh
RUN ./nsolid_setup_deb.sh 18
RUN apt-get install nodejs -y
# Verify Node.js installation
RUN node -v

RUN npm install -g pnpm

# Install pandoc and texlive
RUN apt-get install -y pandoc texlive-full
# Verify pandoc installation
RUN pandoc --version
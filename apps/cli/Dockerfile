# Creates a Docker image for the command line interface
FROM ubuntu:23.10

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

# Install pandoc and texlive
RUN apt-get install -y pandoc texlive-full
# Verify pandoc installation
RUN pandoc --version
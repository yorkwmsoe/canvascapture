FROM node:18

RUN apt-get update && apt-get install -y pandoc texlive-full
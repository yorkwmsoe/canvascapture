FROM electronuserland/builder:latest

# Install dependencies
COPY *.json .

RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build:linux

FROM electronuserland/builder:latest

# Install dependencies
COPY package-lock.json .

RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build:linux

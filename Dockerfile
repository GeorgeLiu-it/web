# Stage 1: Build the app
FROM node:20.16.0-slim as build-stage

# Install ca-certificates tools
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# Add your private CA
COPY Zscaler_Root_CA.crt /usr/local/share/ca-certificates/ca.crt
RUN update-ca-certificates

# Set working dir
WORKDIR /app

# Install node packages
COPY package*.json ./
RUN npm install --no-cache

# Build dist
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.24-alpine

# Copy built source
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Set nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy CA certs (including your private CA)
COPY --from=build-stage /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# expose port
EXPOSE 80

# Start command
ENTRYPOINT ["nginx", "-g", "daemon off;"]

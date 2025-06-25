# Stage 1: Build the app
FROM node:20.16.0-slim as build-stage

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
FROM nginx:1.25.4-alpine3.19

# Copy built source
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Set nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# expose port
EXPOSE 80

# Start command
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# WEB application deployment using docker

## System setup

Refer to README_env.md in server repository

## Docker images

```
# Export
docker save -o [image.tar] [local-image:version]

# Import
docker load < [image.tar]
```

## Application deployment

### Web application

**Code level initialization**

```bash
npm install

# build dist folder
npm run build
```

**Build docker image**

- Dockerfile

  ```bash
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
  FROM nginx:1.24-alpine
  
  # Copy built source
  COPY --from=build-stage /app/dist /usr/share/nginx/html
  
  # Set nginx configuration
  COPY nginx.conf /etc/nginx/nginx.conf
  
  # Copy CA certs (including your private CA)
  COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
  
  # expose port
  EXPOSE 80
  
  # Start command
  ENTRYPOINT ["nginx", "-g", "daemon off;"]
  ```

- Run

  ```bash
  # Generate docker image
  docker build -t web_server .
  
  # Run docker container
  docker run -d -p 80:80 -v $HOME/web/nginx.conf:/etc/nginx/nginx.conf --name web_server web_server:latest
  ```

### Docker-compose to run all-in-0ne

**docker-compose.yml**

```yml
version: "3.9"

networks:
  web-network:
    driver: bridge

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - web-network
    restart: unless-stopped
```

**Docker-compose command**

```
docker compose up --build -d
```

## Host deployment

### Pull from github

```
# pull source code
git clone -b develop --single-branch https://github.com/GeorgeLiu-it/web.git
```

**Run docker compose**

```
# cd to server folder
docker compose build
docker compose up -d

# stop container
docker compose stop

# remove container
docker compose down
```

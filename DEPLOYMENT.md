# Deployment Guide

## Requirements

- Docker
- Docker Compose

## Steps

1. Clone the repository

2. Navigate to the project root

3. Build containers

```bash
docker-compose build
```

4. Start services

```bash
docker-compose up
```

5. Open API docs

http://localhost:8000/docs

## Checks

- GET /health
- GET /ready
- POST /auth/register
- POST /auth/login
- POST /diagnosis/start

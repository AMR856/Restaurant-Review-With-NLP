# NLP Restaurant Service

This repository contains a restaurant reviews platform split into two services:

- `reviews-api-service`: Node.js + TypeScript REST API for users, restaurants, and reviews.
- `sentiment-grpc-service`: Python gRPC service that performs sentiment analysis with a Transformers model.

The API service sends review text to the gRPC service, stores reviews in PostgreSQL via Prisma, and maintains review sentiment aggregates/rankings in Redis.

## Repository Structure

- `reviews-api-service/`: Express API, Prisma schema/migrations, Swagger docs, queue workers, tests.
- `sentiment-grpc-service/`: gRPC server and sentiment inference logic.
- `shared-proto/`: shared gRPC contract (`sentiment.proto`).

## High-Level Flow

1. Client calls `POST /reviews` or `PATCH /reviews/{id}`.
2. API enqueues a BullMQ job and responds immediately with `202` and `jobId`.
3. BullMQ worker processes the job:
- creates/updates review in PostgreSQL
- calls gRPC NLP service for sentiment prediction
- persists sentiment and confidence
- updates Redis restaurant sentiment stats and ranking sorted set

## Tech Stack

- API: Express, TypeScript, Zod, Prisma, BullMQ
- Data: PostgreSQL
- Cache/Queue backend: Redis
- NLP service: Python, gRPC, Hugging Face Transformers (`distilbert-base-uncased-finetuned-sst-2-english`)
- API docs: Swagger
- Tests: Jest

## Prerequisites

Install and run these dependencies locally:

- Node.js 18+
- Python 3.10+
- PostgreSQL
- Redis

## Environment Variables

### reviews-api-service

Create a `.env` file in `reviews-api-service/` with:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nlp_restaurant
JWT_SECRET=change_me

# Redis (used by BullMQ and sentiment stats)
REDIS_URL=redis://127.0.0.1:6379

# gRPC NLP service target
NLP_GRPC_HOST=127.0.0.1
NLP_GRPC_PORT=50051
NLP_GRPC_TARGET=127.0.0.1:50051
# Optional override to proto location
# NLP_GRPC_PROTO_PATH=/absolute/path/to/shared-proto/sentiment.proto
```

### sentiment-grpc-service

Create a `.env` file in `sentiment-grpc-service/` with:

```env
NLP_GRPC_HOST=0.0.0.0
NLP_GRPC_PORT=50051
```

## Setup and Run

### 1. Start infrastructure

Start PostgreSQL and Redis first.

### 2. Start the gRPC sentiment service

```bash
cd sentiment-grpc-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

The service listens on `0.0.0.0:50051` by default.

### 3. Start the API service

```bash
cd reviews-api-service
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

API default URL: `http://localhost:3000`

Swagger UI: `http://localhost:3000/api-docs`

## Useful Commands

From `reviews-api-service/`:

```bash
npm run dev
npm test
npm run test:coverage
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

From `sentiment-grpc-service/`:

```bash
python main.py
python test_client.py "The food was amazing"
```

## Redis Data Model

- Per-restaurant sentiment hash:
- key: `restaurant:sentiment:{restaurantId}`
- fields: `positiveReviews`, `negativeReviews`

- Ranking sorted set:
- key: `restaurants:ranking:positive-reviews`
- score: number of positive reviews
- member: `restaurantId`

## Notes

- Review create/update API calls are asynchronous by design and return immediately after queueing.
- Worker startup is triggered in API bootstrap.
- If the NLP service is down, jobs will retry according to BullMQ retry settings.

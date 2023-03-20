## What This is About

In this demo project, we try to scale SSE (Server Sent Events) by running our NodeJS server (a simple NestJS app) by running it in cluster mode using PM2.

Since SSEs are a stateful service like WebSockets, they don't scale horizontally with our REST API. We'll try and use Redis PubSub to see if we can fix that.

There is also a problem if our app is running behind a reverse proxy like nginx (for load balancing and stuff) where it kills the SSE connection after some time.

## Tech Involved

- NodeJS/NestJS for backend REST API
- SSEs using EventEmitter and some RxJS magic (one way solution for realtime updates)
- EventSource API on the clientside to connect to our SSE service
- nginx as a load balancer
- Redis PubSub to make SSE scalable
- pm2 to run our REST API in cluster mode. It can run multiple instances of our node process on multiple cores.
- Docker to make some stuff simpler to setup.

## Getting Started

```
cd api
npm install
npm run start
```

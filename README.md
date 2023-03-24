## What This is About

In this demo project, we try to scale SSE (Server Sent Events) by running our NodeJS server (a simple NestJS app) by running it in cluster mode using PM2.

Since SSEs are a stateful service like WebSockets, they don't scale horizontally with our REST API. We'll try and use Redis PubSub to see if we can fix that.

There is also a problem when our app is running behind a reverse proxy like nginx (for load balancing and stuff) where it kills the SSE connection after some time (usually 60s). We'll try and fix that too.

> The `master` branch will contain code that fixes these problems. To see unfixed problems, use `problems` branch.

## Tech Involved

- NodeJS/NestJS for backend REST API
- SSEs using EventEmitter and some RxJS magic (one way solution for realtime updates)
- EventSource API on the clientside to connect to our SSE service
- nginx as a load balancer
- Redis PubSub to make SSE scalable
- pm2 to run our REST API in cluster mode. It can run multiple instances of our node process on multiple cores.
- Docker to make some stuff simpler to setup.

## Getting Started

### Running The Application Server
```
cd api
npm install
npm run start # Or npm run start:dev to reload on changes
```

Now, it should be available on `localhost:3000`. Once you open it, you'll see the process ID of the application server. If you hit `Shift + Refresh button` (or `Ctrl+Shift+R` in Firefox), it'll hard reload (reload after clearing cache). Keep doing it multiple times, you'll see the same process ID. This will change once we scale our application server horizontally using `pm2`.

### Running `nginx`

*Optional - Skip this step if you're only concerned with scaling SSE using pm2 + Redis*.

```
cd ..
# Skip if docker is already running
systemctl start docker # use sudo if needed

# Run nginx
sudo docker compose up nginx
```

Now you should be able to access the app server using `localhost:8080`

### Test SSE using the Client

*If you skipped nginx step, change port :8080 to :3000 in `web/index.html`*.

```
cd web/
python -m http.server # maybe you'll need python3
```

Now open up `localhost:8000`, then open your browser's JS console, and you should see some log messages sent to the client (your browser) using SSE.

Click on the Send Event button. This will make an API call to the backend app, that'll fire an SSE event.

### Scaling The App Server using `pm2`

Make sure you have `pm2` installed, check using `pm2 --version`. Quit your application server. Next,

```
cd ../api
pm2 start dist/main.js -i max
```

This will run our NestJS app server on all available cores. Now if you open `localhost:3000` or through nginx (`localhost:8080`), and hard reload the browser multiple times, you'll see different process IDs everytime.

Also, now in the client web app running on port `8000`, when you try to send an event you might not receive it. Keep clicking the send button multiple times, you'll notice that you recieve the event back very few times.

This is because our SSE connection is open on only one instance of our app (remember we are now running our app in cluster mode). And when we click the Send Event button, it makes an API call, but which instance receives the API call we don't know. It depends on the load balancing decision `pm2` makes.


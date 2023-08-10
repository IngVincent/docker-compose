const http = require('http');
const url = require('url');
const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

register.registerMetric(httpRequestDurationMicroseconds);

const server = http.createServer(async (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();

  const route = url.parse(req.url).pathname;

  if (route === '/metrics') {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  } else {
    // Simulate some work before responding
    await new Promise((resolve) => setTimeout(resolve, 100));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, this is the root endpoint!\n');
  }

  end({ route, code: res.statusCode, method: req.method });
});

const port = 5050;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
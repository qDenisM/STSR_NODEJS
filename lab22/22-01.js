const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8443;
const CERT_DIR = path.join(__dirname, 'resource');

const options = {
  key: fs.readFileSync(path.join(CERT_DIR, 'resource.key')),
  cert: fs.readFileSync(path.join(CERT_DIR, 'resource.crt')),
};

https
  .createServer(options, (req, res) => {
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Method Not Allowed');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      `<h1>Lab 22 — HTTPS</h1>` +
        `<p>Host: ${req.headers.host || 'unknown'}</p>` +
        `<p>GET-запрос обработан успешно</p>`,
    );
  })
  .listen(PORT, '0.0.0.0', () => {
    console.log(`HTTPS: https://LAB22-MDS:${PORT}/`);
    console.log(`HTTPS: https://MDS:${PORT}/`);
  });

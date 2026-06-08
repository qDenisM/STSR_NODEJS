const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 9000;
const DIR = path.resolve(process.argv[2] || path.join(process.cwd(), 'send'));

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

http
  .createServer((req, res) => {
    const fileName = decodeURIComponent(req.url.slice(1).split('?')[0]);

    if (!fileName) {
      const files = fs.readdirSync(DIR);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        `<h1>Lab 22 — file server</h1><p>Directory: ${DIR}</p><ul>${files
          .map((file) => `<li><a href="/${file}">${file}</a></li>`)
          .join('')}</ul>`,
      );
      return;
    }

    const filePath = path.join(DIR, fileName);

    if (!filePath.startsWith(DIR) || !fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(PORT, '0.0.0.0', () => {
    console.log(`File server: http://172.20.10.2:${PORT}/`);
    console.log(`Directory: ${DIR}`);
  });

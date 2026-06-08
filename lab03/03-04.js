const http = require("http");
const url = require("url");

const PORT = 2000;

function factorial(a, callback) {
  if (a === 0) return process.nextTick(callback, 1);
  if (a === 1) return process.nextTick(callback, 1);
  return process.nextTick(factorial, a-1, (result) => process.nextTick(callback, a * result));
}

http
  .createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    if (parsed.pathname == '/fact/') {
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        'access-control-allow-origin': '*'
      });
      const k = Math.max(0, +parsed.query.k || 0)
      factorial(k, (fact) => res.end(JSON.stringify({ k: k, fact: fact })));
    } else {
      res.end("Not found");
    }
  })
  .listen(PORT, () =>
    console.log(`Server is running at http://localhost:${PORT}`),
  );

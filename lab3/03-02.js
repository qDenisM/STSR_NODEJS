const http = require("http");
const url = require("url");

const PORT = 2000;

function factorial(a) {
  if (a === 0) return 1;
  if (a === 1) return 1;
  return a * factorial(a - 1);
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
      const fact = factorial(k);
      result = { k: k, fact: fact };
      res.end(JSON.stringify(result));
    } else {
      res.end("Not found");
    }
  })
  .listen(PORT, () =>
    console.log(`Server is running at http://localhost:${PORT}`),
  );

const http = require("http");
const fs = require('fs')

const PORT = 2000;

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
    });
    if (req.url == "/xmlhttprequest") {
        let data = fs.readFileSync('./xmlhttprequest.html')
        res.end(data)
    }
  })
  .listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });

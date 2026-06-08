const http = require('http')
const url = require('url')

const PORT = 8080

http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true)
    console.log(req.url)
    const x = parsedUrl.query.x
    const y = parsedUrl.query.y
    res.end(`parameter x = ${x}, parameter y = ${y}`)
}).listen(PORT, () => `Server is running on http://localhost:${PORT}`)
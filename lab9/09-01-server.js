const http = require('http')

const PORT = 8080

http.createServer((req, res) => {
    res.writeHead(200, 'Successfully receiving', {
        'content-type': 'text/plain; charset=utf-8'
    })
    res.end('Data from server')
}).listen(PORT, () => `Server is running on http://localhost:${PORT}`)
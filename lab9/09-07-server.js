const http = require('http')

const PORT = 8080

http.createServer((req, res) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => res.end(body))
    
}).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
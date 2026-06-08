const http = require('http')

const PORT = 8080

http.createServer((req, res) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
        const params = JSON.parse(body)
        const x = params.x
        const y = params.y
        const s = params.s
        res.end(`parameter x = ${x}, parameter y = ${y}, parameter s = ${s}`)
    })
}).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
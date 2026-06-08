const http = require('http')

const PORT = 2001

http.createServer((req, res) => {
    res.writeHead(200, {
        "content-type": 'text/plain; charset=utf-8',
        'access-control-allow-origin': '*'
    })

    if(req.url == '/api/name') {
        res.end('Мойсеёнок Денис Сергеевич')
    } else {
        res.statusCode = 404
        res.end('Not found')
    }
}).listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
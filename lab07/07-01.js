const http = require('http')
const static = require('./m07-01')('./static')
const PORT = 8080

http.createServer((req, res) => {
    if (req.method === 'GET') {
        console.log(req.url);
        if (static.isStatic('html', req.url)) static.sendFile(req, res, {'Content-Type': 'text/html; charset=utf-8'})
        else if (static.isStatic('css', req.url)) static.sendFile(req, res, {'Content-Type': 'text/css; charset=utf-8'})
        else if (static.isStatic('js', req.url)) static.sendFile(req, res, {'Content-Type': 'text/javascript; charset=utf-8'})
        else if (static.isStatic('png', req.url)) static.sendFile(req, res, {'Content-Type': 'image/png'})
        else if (static.isStatic('docx', req.url)) static.sendFile(req, res, {'Content-Type': 'application/msword'})
        else if (static.isStatic('json', req.url)) static.sendFile(req, res, {'Content-Type': 'application/json'})
        else if (static.isStatic('xml', req.url)) static.sendFile(req, res, {'Content-Type': 'application/xml'})
        else if (static.isStatic('mp4', req.url)) static.sendFile(req, res, {'Content-Type': 'video/mp4'})
        else static.code404(res)
    } else {
        res.statusCode = 405;
        res.statusMessage = 'Method Not Allowed'
        res.end('Method Not Allowed')
    }
}).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/`))
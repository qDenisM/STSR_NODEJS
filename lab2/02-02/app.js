const http = require('http')
const fs = require('fs')

const PORT = 2000
const FILEPATH = './image/png.png'

http.createServer((req, res) => {
    if (req.url == '/png') {
        fs.access(FILEPATH, fs.constants.R_OK, (err) => {
            if (err)
                console.log(`Error: ${err}`)
            else {
                res.writeHead(200, {
                    'content-type': 'image/png'
                })
                let data = fs.readFileSync(FILEPATH)
                res.end(data)
            }
        })
    }
    else {
        res.statusCode = 404
        res.end('Not found')
    }
}).listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
const http = require('http')
const fs = require('fs')

const PORT = 2000
const FILEPATH = './index.html'

http.createServer((req, res) => {

    if (req.url == '/html') {

        fs.access(FILEPATH, fs.constants.R_OK, err => {
            if (err) {
                res.statusCode = 404
                res.end("Resource not found")
            } else {
                let data = fs.readFileSync(FILEPATH)
                res.end(data)
            }
        })
    } else {
        res.statusCode = 404
        res.end("Not found")
    }
}).listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
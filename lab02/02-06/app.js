const http = require('http')
const fs = require('fs')
const PORT = 2000

http.createServer((req, res) => {
    if (req.url == '/jquery') {
        let data = fs.readFileSync('./jquery.html')
        res.end(data)
    }
}).listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
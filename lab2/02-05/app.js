const http = require('http')
const fs = require('fs')
const PORT = 2000

http.createServer((req, res) => {
    if (req.url == '/fetch') {
        let data = fs.readFileSync('./fetch.html')
        res.end(data)
    }
}).listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
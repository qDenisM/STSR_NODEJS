const http = require('http')
const fs = require('fs')

let bound = 'lab9-lab9-lab9'

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: 'POST',
    headers: {
        'content-type': 'multipart/form-data; boundary=' + bound
    }
}

let dataFromFile = `--${bound}\r\n
Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n
Content-Type:text/plain\r\n\r\n
${fs.readFileSync('./MyFile.txt')}
\r\n--${bound}--\r\n`

const req = http.request(options, res => {
    let body = ''
    res.on('data', chunk => body += chunk)
    res.on('end', () => {
        console.log(body)
    })
})

req.end(dataFromFile)
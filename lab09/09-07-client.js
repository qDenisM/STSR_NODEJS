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
Content-Disposition:form-data; name="file"; filename="MyFile.png"\r\n
Content-Type:image/png\r\n\r\n
${fs.readFileSync('./MyFile.png')}
\r\n--${bound}--\r\n`

const req = http.request(options, res => {
    let body = ''
    res.on('data', chunk => body += chunk)
    res.on('end', () => {
        console.log(body)
    })
})

req.end(dataFromFile)
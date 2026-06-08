const http = require('http')
const query = require('querystring')

const data = query.stringify({
    x: 1,
    y: 2
})

const options = {
    hostname: 'localhost',
    port: 8080,
    path: `/?${data}`,
    method: 'GET'
}

const req = http.request(options, res => {
    let body = ''
    res.on('data', chunk => body += chunk)
    console.log(res.statusCode)
    res.on('end', () => console.log('From server:', body))
})

req.end()
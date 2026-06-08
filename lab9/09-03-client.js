const http = require('http')
//const query = require('querystring')

const data = JSON.stringify({
    x: 1,
    y: 2,
    s: 'sss'
})

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: 'POST'
}

const req = http.request(options, res => {
    let body = ''
    res.on('data', chunk => body += chunk.toString())
    
    console.log(res.statusCode)
    res.on('end', () => console.log('Data from server:', body))
})

req.write(data)
req.end()
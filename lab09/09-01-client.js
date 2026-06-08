const http = require('http')

options = {
    host: 'localhost',
    path: '/',
    port: 8080,
    method: 'GET'
}

const req = http.request(options, res => {
    let body = ''
    res.on('data', chunk => body += chunk)

    console.log('Status code:', res.statusCode)
    console.log('Status message:', res.statusMessage)
    console.log('Server ip:', res.socket.remoteAddress)
    console.log('Server port:', res.socket.remotePort)
    res.on('end', () => console.log('Response data:', body))
})

req.end()
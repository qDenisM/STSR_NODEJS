const net = require('net')

const HOST = '0.0.0.0'
const PORT = 8080

net.createServer(sock => {
    sock.on('connect', () => console.log(`Server connected: ${sock.remoteAddress}:${sock.remotePort}`))

    sock.on('data', data => {
        console.log(data.toString())
        sock.write(`ECHO: ${data}`)
    })

    sock.on('close', () => console.log('Connection close'))
}).listen(PORT, HOST)


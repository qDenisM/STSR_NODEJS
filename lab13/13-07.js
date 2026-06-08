const net = require('net')

const HOST = '0.0.0.0'
const PORT_A = 40000
const PORT_B = 50000

const serverA = net.createServer(sock => {
    sock.on('connect', () => console.log(`Server connected: ${sock.remoteAddress}:${sock.remotePort}`))

    sock.on('data', data => {
        sock.write(`ECHO: ${data.toString()}`)
    })
}).listen(PORT_A, HOST)

const serverB = net.createServer(sock => {
    sock.on('connect', () => console.log(`Server connected: ${sock.remoteAddress}:${sock.remotePort}`))

    sock.on('data', data => {
        sock.write(`ECHO: ${data.toString()}`)
    })
}).listen(PORT_B, HOST)
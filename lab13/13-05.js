const net = require('net')

const HOST = '0.0.0.0'
const PORT = 8080

net.createServer(sock => {
    sock.on('connect', () => console.log(`Server connected: ${sock.remoteAddress}:${sock.remotePort}`))

    let sum = 0
    let i = 0
    sock.on('data', data => {
        let num = Number(data)
        sum += num;
    })
    setInterval(() => {
        sock.write(`Sum ${i++}: ${sum.toString()}`)
    }, 5000)
}).listen(PORT, HOST)
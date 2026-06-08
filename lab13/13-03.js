const net = require('net')

const HOST = '0.0.0.0'
const PORT = 8080

net.createServer(sock => {
    let sum = 0
    let i = 0
    sock.on('data', data => {
        let num = Number(data)
        sum += num;
        
    })
    setInterval(() => {
        sock.write(`Sum ${i++}: ${sum.toString()}`)
    }, 5000)
    setInterval(() => process.exit(), 20000)
}).listen(PORT, HOST)
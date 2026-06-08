const net = require('net')

const HOST = '127.0.0.1'
const PORT = 8080

const client = new net.Socket()

client.connect(PORT, HOST, () => {
    let msg = Number(process.argv[2]) || 0
    console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`)
    client.on('data', data => {
        console.log(data.toString())
    })
    setInterval(() => {
        client.write(msg.toString())
    }, 1000)
})

client.on('close', () => console.log('Client disconnected'))
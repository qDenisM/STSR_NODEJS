const net = require('net')

const HOST = '172.20.10.4'
const PORT = 8080

let msg = ''

const client = new net.Socket()

client.connect(PORT, HOST, () => {
    console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`)
    
    process.stdin.on('data', chunk => {
        msg = chunk.toString().trim()
        client.write(msg)
    })
    client.on('data', data => {
        console.log(data.toString())
    })
})

client.on('close', () => console.log('Client disconnected'))
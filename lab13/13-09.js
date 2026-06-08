const udp = require('dgram')

const PORT = 8080

const server = udp.createSocket('udp4')

server.bind(PORT)

server.on('listening', () => {
    console.log(`UDP Server running on ${server.address().address}:${server.address().port}`)
})

server.on('message', (requestMessage, remoteInfo) => {
    let responseMessage = Buffer.from(`ECHO: ${requestMessage.toString()}`)
    server.send(responseMessage, remoteInfo.port, remoteInfo.address)
})

server.on('close', () => console.log('UDP Server is shutdowned'))
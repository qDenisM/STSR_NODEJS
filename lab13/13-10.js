const udp = require('dgram')
const client = udp.createSocket('udp4')

const PORT = 8080

let requestMessage = ''

process.stdin.on('data', data => {
    requestMessage = Buffer.from(data.toString().trim())
    client.send(requestMessage, PORT, '127.0.0.1')
})

client.on('message', responseMessage => {
    console.log(responseMessage.toString())
})
const webSocket = require('ws')
const fs = require('fs')

const socketClient = new webSocket('ws://localhost:4000/')
let k = 0

socketClient.on('open', () => {
    console.log('WebSocket Client is connected to WebSocket Server')
    const duplex = webSocket.createWebSocketStream(socketClient, {encoding: 'utf8'})
    const file = fs.createWriteStream(`./file-download-${k++}.txt`)
    duplex.pipe(file)
})

socketClient.on('close', () => {
    console.log('WebSocket Client is disconnected')
})
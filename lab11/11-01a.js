const webSocket = require('ws')
const fs = require('fs')

const socketClient = new webSocket('ws://localhost:4000/')

socketClient.on('open', () => {
    console.log('Web Socket Client connected to Web Socket Server')
    const duplex = webSocket.createWebSocketStream(socketClient, {encoding: 'utf-8'})
    const file = fs.createReadStream('./MyFile.txt')
    console.log('Uploading file')
    file.pipe(duplex)
    console.log('File is uploaded')
})
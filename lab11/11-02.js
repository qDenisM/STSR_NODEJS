const webSocket = require('ws')
const fs = require('fs')

const socketServer = new webSocket.Server({
    hostname: 'localhost',
    port: 4000,
    path: '/'
})

socketServer.on('connection', ws => {
    const duplex = webSocket.createWebSocketStream(ws, {encoding: 'utf8'})
    const file = fs.createReadStream('./download/FileDownload.txt')
    file.pipe(duplex)
})

socketServer.on('close', () => console.log('WebSocket Server shutdown'))

socketServer.on('listening', () => console.log(`WebSocket Server is running on ws://${socketServer.options.hostname}:${socketServer.options.port}${socketServer.options.path}`))
const webSocket = require('ws')
const fs = require('fs')

const socketServer = new webSocket.Server({
    host: 'localhost',
    port: 4000,
    path: '/'
})
let k = 0
socketServer.on('connection', ws => {
    const duplex = webSocket.createWebSocketStream(ws, {encoding: 'utf-8'})
    const fileFolder = fs.createWriteStream(`./upload/file-${k++}.txt`)
    console.log('Receiving file')
    duplex.pipe(fileFolder)
    console.log(`File is written to /upload/file-${k}.txt`)
})

socketServer.on('listening', () => console.log(`Web Socket server is running on ws://${socketServer.options.host}:${socketServer.options.port}${socketServer.options.path}`))
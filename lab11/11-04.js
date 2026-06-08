const webSocket = require('ws')

const socketServer = new webSocket.Server({
    hostname: 'localhost',
    path: '/',
    port: 4000,
})

let n = 0
socketServer.on('connection', ws => {
    ws.on('message', data => {
        console.log(JSON.parse(data.toString()))
    })
    ws.send(JSON.stringify({
        server: n++,
        client: clientData.client,
        timestamp: new Date().toISOString()
    }))
})

socketServer.on('listening', () => console.log('WebSocket Server is running on ws://localhost:4000/'))
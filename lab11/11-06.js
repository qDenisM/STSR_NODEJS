const webSocket = require('rpc-websockets').Server

const socketServer = new webSocket({
    hostname: 'localhost',
    port: 4000,
    path: '/'
})

socketServer.on('listening', () => console.log('WebSocket Server is running on ws://localhost:4000/'))

socketServer.event('A')
socketServer.event('B')
socketServer.event('C')

process.stdin.on('data', chunk => {
    let eventName = chunk.toString().trim()
    switch (eventName) {
        case 'A': socketServer.emit('A'); break;
        case 'B': socketServer.emit('B'); break;
        case 'C': socketServer.emit('C'); break;
        default: console.log('Don`t exist this event')
    }
})
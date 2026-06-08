const rpcWS = require('rpc-websockets').Server

const socketServer = new rpcWS({
    hostname: 'localhost',
    port: 4000,
    path: '/'
})

socketServer.on('listening', () => console.log('WebSocket Server is running on ws://localhost:4000/'))

socketServer.register('A', () => console.log('Event A')).public()
socketServer.register('B', () => console.log('Event B')).public()
socketServer.register('C', () => console.log('Event C')).public()


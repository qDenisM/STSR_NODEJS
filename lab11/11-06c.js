const rpcws = require('rpc-websockets').Client

const socketClient = new rpcws('ws://localhost:4000')

socketClient.on('open', () => {
    socketClient.subscribe('C')
    
    socketClient.on('C', () => console.log('Event C'))
})
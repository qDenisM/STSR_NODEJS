const rpcws = require('rpc-websockets').Client

const socketClient = new rpcws('ws://localhost:4000')

socketClient.on('open', () => {
    socketClient.subscribe('A')
    
    socketClient.on('A', () => console.log('Event A'))
})
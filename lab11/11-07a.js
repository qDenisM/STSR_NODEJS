const rpcws = require('rpc-websockets').Client

const socketClient = new rpcws('ws://localhost:4000/')

socketClient.on('open', () => {
    process.stdin.on('data', chunk => {
    let eventName = chunk.toString().trim()
    switch(eventName) {
        case 'A': socketClient.notify('A'); break;
        case 'B': socketClient.notify('B'); break;
        case 'C': socketClient.notify('C'); break;
        default: console.log('Don`t exist this event');
    }
})
})

socketClient.on('close', () => {
    console.log('WebSocket Client is disconnected')
})
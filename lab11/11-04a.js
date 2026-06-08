const webSocket = require('ws')

const socketClient = new webSocket('ws://localhost:4000/')

socketClient.on('open', () => {
    socketClient.send(JSON.stringify({
        client: process.argv[2],
        timestamp: new Date().toISOString()
    }))
    socketClient.on('message', data => {
        console.log(JSON.parse(data.toString()))
    })
})

socketClient.on('close', () => console.log('WebSocket Client is disconnected'))
const webSocket = require('ws')

const socketClient = new webSocket('ws://localhost:4000/')

socketClient.on('open', () => {
    console.log('WebSocket Client connected')
    socketClient.on('message', data => {
        console.log(data.toString())
    })
    socketClient.on('ping', (data) => {
        console.log(data.toString())
        socketClient.pong('Pong from client')
    })
})

socketClient.on('close', () => console.log('WebSocket Client disconnected'))
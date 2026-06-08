const webSocket = require('ws')

const socketClient = new webSocket('ws://localhost:4000/')
let n = 0;
socketClient.on('open', () => {
    setInterval(() => socketClient.send(`10-01-client: ${n++}`), 3000)

    socketClient.on('message', data => {
        console.log(data.toString())
    })

    setTimeout(() => socketClient.close(), 25000)
    
    socketClient.on('close', () => console.log('WebSocket client shutdown'))
})
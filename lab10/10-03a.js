const webSocket = require('ws')

const socketClient = new webSocket('ws://localhost:4000')

const clientId = process.argv[2]

socketClient.on('open', () => {
    console.log('WebSocket Client connected to WebSocket Server')
    let k = 0;

    setInterval(() => socketClient.send(`Message ${k++} from Client ${clientId}`), 1000)

    socketClient.on('message', data => {
        console.log(data.toString())
    })
})
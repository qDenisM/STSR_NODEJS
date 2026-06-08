const webSocket = require('ws')

const WS_PORT = 4000

const socketServer = new webSocket.Server({
    host: 'localhost',
    port: WS_PORT,
    path: '/'
})

let k = 0

socketServer.on('connection', ws => {
    ws.on('message', data => {
        console.log(data.toString())
        socketServer.clients.forEach((client) => {
            if (client.readyState === webSocket.OPEN)
                client.send(`Message ${k++} from Server`)
        })    
    })

})

socketServer.on('listening', () => console.log(`WebSocket Server is running on ws://${socketServer.options.host}:${socketServer.options.port}${socketServer.options.path}`))
const webSocket = require('ws')

const socketServer = new webSocket.Server({
    hostname: 'localhost',
    port: 4000,
    path: '/'
})

let k = 0
let amountClients = 0
socketServer.on('connection', ws => {
    amountClients++
    setInterval(() => {
        ws.send(`11-03-server: ${k++}`)
    }, 15000)
    setInterval(() => {
        ws.ping('Ping from server')
    }, 5000)
    ws.on('pong', data => {
        console.log(data.toString())
    })
    console.log(`Connected Clients: ${amountClients}`)
    ws.on('close', () => {
        amountClients--
        console.log(`Connected Clients: ${amountClients}`)
    })
})

socketServer.on('listening', () => console.log(`WebSocket Server is running on ws://${socketServer.options.hostname}:${socketServer.options.port}${socketServer.options.path}`))
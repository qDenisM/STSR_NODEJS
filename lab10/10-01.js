const http = require('http')
const fs = require('fs')
const webSocket = require('ws')

const HTTP_PORT = 3000
const WS_PORT = 4000

http.createServer((req, res) => {
    if (req.url === '/start' && req.method === "GET") {
        res.end(fs.readFileSync('./10-01.html'))
    }
    else {
        res.writeHead(400, 'Incorrect URI')
        res.end(res.statusMessage)
    }
}).listen(HTTP_PORT, () => console.log(`HTTP Server is running on http://localhost:${HTTP_PORT}/`))

const socketServer = new webSocket.Server({
    port: WS_PORT,
    host: 'localhost',
    path: '/'
})

let n;
let k = 0;

socketServer.on('connection', ws => {
    ws.on('message', message => {
        console.log(message.toString())
        const arrayFromMessage = message.toString().split(' ')
        n = arrayFromMessage[1]
        
    })

    const sendInterval = setInterval(() => ws.send(`10-01-server: ${n}->${k++}`), 5000)
    
    socketServer.on('close', () => {
        console.log('Web Socket server shutdown')
        clearInterval(sendInterval)
    })

    ws.send()
})

socketServer.on('listening', () => console.log(`WebSocket Server is running on ws://${socketServer.options.host}:${socketServer.options.port}${socketServer.options.path}`))
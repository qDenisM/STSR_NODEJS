const jsonRPCServer = require('jsonrpc-server-http-nats')

const server = new jsonRPCServer()

server.on('sum', (params, response) => response(null, params.reduce((acc, next) => acc + next, 0)))
server.on('mul', (params, response) => response(null, params.reduce((acc, next) => acc * next, 1)))
server.on('div', (params, response) => response(null, params[0] / params[1]))
server.on('proc', (params, response) => response(null, (params[0]/params[1]) * 100))

server.listenHttp({
    host: 'localhost',
    port: 8080
}, () => console.log('Server is running on http://localhost:8080'))
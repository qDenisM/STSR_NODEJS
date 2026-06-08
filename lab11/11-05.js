const rpcws = require('rpc-websockets').Server

const socketServer = new rpcws({
    host: 'localhost',
    port: 4000
})

socketServer.setAuth((login) => (login.login === 'denis' && login.password === '123'))

socketServer.on('connect', () => console.log('RPC WebSocket Server is running on ws://localhost:4000'))

socketServer.register('square', params => {
    switch (params.length) {
        case 1: {
            return 'Circle Square: ' + Math.pow(params[0], 2) * 3.14;
        }; 
        case 2: {
            return 'Rectangle Square: ' + params[0] * params[1]
        };
        default: {
            return 'Too many params, required 1 to calculate circle square or 2 to calculate rectangle square'
        }
    }
}).public()
socketServer.register('sum', params => {
    return 'Sum: ' + params.reduce((acc, next) => acc + next, 1)
}).public()
socketServer.register('mul', params => {
    return 'Product: ' + params.reduce((acc, next) => acc * next, 1)
}).public()
socketServer.register('fib', params => {
    let array = []
    if (params === 1) {
        array[0] = 1
    }
    else {
        array[0] = 1
        array[1] = 1
        for (let i = 2; i < params; i++) {
            array[i] = array[i - 2] + array[i - 1]
        }
    }
    return 'Fibonachi Sequence: ' + array
}).protected()
socketServer.register('fact', params => {
    let a = Array.isArray(params) ? params[0] : params
    function fact(n) {
        if (n < 2)
            return 1
        return n * fact(n - 1)
    }
    return 'Factorial ' + a + ': ' + fact(a)
}).protected()
const rpcws = require('rpc-websockets').Client

const socketClient = new rpcws('ws://localhost:4000')

socketClient.on('open', () => {
    socketClient.call('square', [3]).then(result => console.log(result)).catch(err => console.log(err))
    socketClient.call('square', [5, 4]).then(result => console.log(result)).catch(err => console.log(err))
    socketClient.call('sum', [2]).then(result => console.log(result)).catch(err => console.log(err))
    socketClient.call('sum', [2, 4, 6, 8, 10]).then(result => console.log(result)).catch(err => console.log(err))
    socketClient.call('mul', [3]).then(result => console.log(result)).catch(err => console.log(err))
    socketClient.call('mul', [3, 5, 7, 9, 11, 13]).then(result => console.log(result)).catch(err => console.log(err))
    
    socketClient.login({
        login: 'denis',
        password: '123'
    }).then((login) => {
        if (login) {
            socketClient.call('fib', 1).then(result => console.log(result)).catch(err => console.log(err))
            socketClient.call('fib', 2).then(result => console.log(result)).catch(err => console.log(err))
            socketClient.call('fib', 7).then(result => console.log(result)).catch(err => console.log(err))
            socketClient.call('fact', [0]).then(result => console.log(result)).catch(err => console.log(err))
            socketClient.call('fact', 5).then(result => console.log(result)).catch(err => console.log(err))
            socketClient.call('fact', 10).then(result => console.log(result)).catch(err => console.log(err))
        }
        else {
            console.log('Login error')
        }
    }).catch(err => console.log(err))
})
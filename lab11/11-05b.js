const rpcws = require('rpc-websockets').Client
const async = require('async')

const socketClient = new rpcws('ws://localhost:4000')

socketClient.on('open', () => {
    async.parallel({
        square: cb => {
            Promise.all([
                socketClient.call('square', [3]),
                socketClient.call('square', [5, 4])
            ]).then(result => cb(null, result)).catch(err => cb(err))
        },
        sum: cb => {
            Promise.all([
                socketClient.call('sum', [2]),
                socketClient.call('sum', [2, 4, 6, 8, 10])
            ]).then(result => cb(null, result)).catch(err => cb(err))
        },
        mul: cb => {
            Promise.all([
                socketClient.call('mul', [3]),
                socketClient.call('mul', [3, 5, 7, 9, 11, 13])
            ]).then(result => cb(null, result)).catch(err => cb(err, null))
        },
        fib: cb => {
            socketClient.login({
                login: 'denis',
                password: '123'
            }).then(login => {
                if (login) {
                    Promise.all([
                        socketClient.call('fib', 1),
                        socketClient.call('fib', 2),
                        socketClient.call('fib', 7)
                    ]).then(result => cb(null, result)).catch(err => cb(err))
                }
                else
                    console.log('Login failed')
            }).catch(err => console.log(err))
        },
        fact: cb => {
            socketClient.login({
                login: 'denis',
                password: '123'
            }).then(login => {
                if (login) {
                    Promise.all([
                        socketClient.call('fact', [0]),
                        socketClient.call('fact', 5),
                        socketClient.call('fact', 10)
                    ]).then(result => cb(null, result)).catch(err => cb(err))
                }
                else
                    console.log('Login failed')
            }).catch(err => console.log(err))
        },
    },
    (err, result) => {
        if (err) console.log(err)
        else {
            for (const key in result) {
                result[key].map((item) => console.log(item))
            }
        }
    })
})
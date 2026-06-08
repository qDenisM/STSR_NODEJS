const rpcws = require('rpc-websockets').Client
const async = require('async')

const socketClient = new rpcws('ws://localhost:4000')

//sum(square(3), square(5,4), mul(3,5,7,9,11,13)) + fib(7) * mul(2,4,6)


socketClient.on('open', () => {
    async.waterfall([
        cb => Promise.all([
            socketClient.call('square', [3]),
            socketClient.call('square', [5, 4]),
            socketClient.call('mul', [3, 5, 7, 9, 11, 13]),
        ]).then(result => {
            let numberArray = []
            for (key of result) {
                let arrKey = key.split(':')
                numberArray.push(Number(arrKey[1]))
            }
            cb(null, numberArray)
        }).catch(err => cb(err)),
        (prev, cb) => socketClient.call('sum', prev).then(result => cb(null, result)).catch(err => cb(err)),
        (prev, cb) => socketClient.login({
            login: 'denis', 
            password: '123'
        }).then(login => {
            if(login) {
                socketClient.call('fib', 7).then(result => {
                    let prevSum = Number(prev.slice(5, -1))
                    let numberResultArray = result.slice(20).split(',').map(Number)
                    socketClient.call('sum', [prevSum, numberResultArray]).then(result => cb(null, result)).catch(err => cb(err))
                })
            }
        }),
        (prev, cb) => socketClient.call('mul', [2, 4, 6]).then(result => {
            let prevSum = Number(prev.slice(5, -1).split(',').join(''))
            let numberOfResultMul = Number(result.slice(8))
            socketClient.call('mul', [prevSum, numberOfResultMul]).then(result => cb(null, result)).catch(err => cb(err))
        })
    ],
    (err, result) => {
        if (err) console.log(err)
        else console.log(result)
    })
})
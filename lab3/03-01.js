const http = require('http')
const EventEmitter = require('node:events')

const PORT = 2000
const emitter = new EventEmitter()

let status = 'norm'

emitter.on('change', (oldStatus, newStatus) => {
    console.log(`reg = ${oldStatus}--> ${newStatus}`)
})

function setStatus(newStatus) {
    const oldStatus = status
    status = newStatus
    emitter.emit('change', oldStatus, newStatus)
}

process.stdin.setEncoding('utf-8')
process.stdin.on('data', (chunk) => {
    const line = chunk.trim()

    switch(line) {
        case `${status}->stop`: setStatus('stop'); break;
        case `${status}->test`: setStatus('test'); break;
        case `${status}->idle`: setStatus('idle'); break;
        case `${status}->norm`: setStatus('norm'); break;
        case `${status}->exit`: setStatus('exit'); process.exit();
        default: console.log(`Incorrect status: ${line}`);
    }
})

http.createServer((req, res) => {
    res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8'
    })
    res.end(`<h1>${status}</h1>`)
}).listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`)
})
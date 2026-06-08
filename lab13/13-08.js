const net = require('net')

const HOST = '127.0.0.1'
const PORT = Number(process.argv[2]) || 40000

const client = new net.Socket()

client.connect(PORT, HOST, () => {
   console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`)

   let msg = ''

   process.stdin.on('data', chunk => {
    msg = chunk.toString().trim()
    setInterval(() => client.write(chunk), 1000)
   })
   
   client.on('data', data => {
    console.log(data.toString())
   })
})
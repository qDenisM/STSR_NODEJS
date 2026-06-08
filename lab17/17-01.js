const redis = require('redis')

const client = redis.createClient({
    url: 'redis://localhost:6379',
    password: '123467'
})

client.connect()

client.on('connect', async () => {
    console.log('hello world')
    await client.quit()
})

client.on('end', () => {
    console.log('Connection closed')
})
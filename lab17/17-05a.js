const redis = require('redis')

const publisher = redis.createClient({
    url: 'redis://localhost:6379',
    password: '123467'
})

publisher.connect()

publisher.on('connect', async () => {
    console.log('Publisher connected')
    await publisher.publish('publish', 'hello!!!')
})
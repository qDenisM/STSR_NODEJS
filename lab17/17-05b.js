const redis = require('redis')

const subscriber = redis.createClient({
    url: 'redis://localhost:6379',
    password: '123467'
})

subscriber.connect()

subscriber.on('connect', async () => {
    console.log('Subscriber connected')
    await subscriber.subscribe('publish', message => {
        console.log(message)
    })
})
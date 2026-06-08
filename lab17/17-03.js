const redis = require('redis')

const client = redis.createClient({
    url: 'redis://localhost:6379',
    password: '123467'
})

client.connect()

async function operationToRedis(operation) {
    const startTime = Date.now()
    switch (operation) {
        case 'incr': {
            for (let n = 1; n <= 10000; n++) {
                await client.incr('incr')
            }
            break;
        }
        case 'decr': {
            for (let n = 1; n <= 10000; n++) {
                await client.decr('decr')
            }
            break;
        }
    }
    return Date.now() - startTime
}

client.on('connect', async () => {
    await client.set('incr', 0)
    console.log('Скорость для 10000 incr-запросов: ' + await operationToRedis('incr') + ' ms')
    console.log('Скорость для 10000 decr-запросов: ' + await operationToRedis('decr') + ' ms')
    await client.quit()
})
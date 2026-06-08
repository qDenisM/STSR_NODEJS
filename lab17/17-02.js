const redis = require('redis')

const client = redis.createClient({
    url: 'redis://localhost:6379',
    password: '123467'
})

client.connect()

async function operationToRedis(operation) {
    const startTime = Date.now()
    switch (operation) {
        case 'set': {
            for (let n = 1; n <= 10000; n++) {
                await client.set(n.toString(), `set${n}`)
            }
            break;
        }
        case 'get': {
            for (let n = 1; n <= 10000; n++) {
                await client.get(n.toString())
            }
            break;
        }
        case 'del': {
            for (let n = 1; n <= 10000; n++) {
                await client.del(n.toString())
            }
            break;
        }
    }
    return Date.now() - startTime
}

client.on('connect', async () => {
    console.log('Скорость для 10000 set-запросов: ' + await operationToRedis('set') + ' ms')
    console.log('Скорость для 10000 get-запросов: ' + await operationToRedis('get') + ' ms')
    console.log('Скорость для 10000 del-запросов: ' + await operationToRedis('del') + ' ms')
    await client.quit()
})
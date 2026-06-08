const redis = require('redis')

const client = redis.createClient({
    url: 'redis://localhost:6379',
    password: '123467'
})

client.connect()

async function operationToRedis(operation) {
    const startTime = Date.now()
    switch (operation) {
        case 'hset': {
            for (let n = 1; n <= 10000; n++) {
                await client.hSet(n.toString(), {
                    id: n.toString(),
                    val: `val-${n}`
                })
            }
            break;
        }
        case 'hget': {
            for (let n = 1; n <= 10000; n++) {
                await client.hGetAll(n.toString())
            }
            break;
        }
    }
    return Date.now() - startTime
}

client.on('connect', async () => {
    console.log('Скорость для 10000 set-запросов: ' + await operationToRedis('hset') + ' ms')
    console.log('Скорость для 10000 get-запросов: ' + await operationToRedis('hget') + ' ms')
    await client.quit()
})
const http = require('http')

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'accept': 'applications/json'
    },
}

const data = JSON.stringify({
    __comment: 'Запрос. Лабораторная работа 9/4',
    x: 1,
    y: 2,
    s: 'Сообщение',
    m: ['a', 'b', 'c', 'd'],
    o: {
        surname: 'Иванов',
        name: 'Иван'
    }
})

const req = http.request(options, res => {
    let body = ''
    res.on('data', chunk => body += chunk)
    console.log('Status code:', res.statusCode)
    res.on('end', () => console.log('Data from server:', JSON.parse(body)))
})

req.write(data)
req.end()
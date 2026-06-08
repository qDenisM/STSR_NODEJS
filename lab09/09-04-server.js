const http = require('http')

const PORT = 8080

http.createServer((req, res) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
        const data = JSON.parse(body)
        const responseObject = JSON.stringify({
            __comment: 'Ответ. Лабораторная работа 9/4',
            x_plus_y: data.x + data.y,
            Concatination_s_o: 'Сообщение: ' + data.o.surname + ', ' + data.o.name,
            Length_m: data.m.length
        })
        res.end(responseObject)
    })
}).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
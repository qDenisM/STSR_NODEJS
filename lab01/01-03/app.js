const http = require("http");

const PORT = 2000

let requestHeaders = (req) => {
    let rc = ''
    for (key in req.headers) rc += `<h3>${key}: ${req.headers[key]}</h3>`
    return rc;
}

http.createServer((request, response) => {
    let b = ''
    request.on('data', str => {
        b += str
        console.log('data', b)
    })

    response.writeHead(200, {
        'content-type': 'text/html; charset=utf-8'
    })

    request.on('end', () => {
        response.end(
            `<h1>Структура запроса</h1>
            <h2>Метод: ${request.method}</h2>
            <h2>URI: ${request.url}</h2>
            <h2>Версия: ${request.httpVersion}</h2>
            <h2>Заголовки: </h2>
            ${requestHeaders(request)}
            <h2>Тело: ${b}</h2>`
        )
    })
}).listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
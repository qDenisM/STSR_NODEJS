const http = require("http");

const PORT = 2000

http.createServer((request, response) => {
    response.writeHead(200, {
        'content-type': 'text/html'
    })
    response.end("<h1>Hello World</h1>");
}).listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

// 2-3 лабы
//eventloop - браузерный и nodejs, какая первая функция вызывается в eventloop
//setimmediate - node js event loop
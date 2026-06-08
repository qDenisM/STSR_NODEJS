const http = require('http')
const sendModule = require('m0603_node')

const PORT = 2000

const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Send Form Using Module</title>
        </head>
        <body>
            <style>
                button {
                    padding: 10px, 20px;
                }
            </style>
            <form method="POST" action="/">
                <label>Сообщение:</label><br/>
                <input type="text" name="message" /><br/>
                <button type="submit">
                    Отправить
                </button>
            </form>
        </body>
        </html>
    `;

http.createServer((req, res) => {
    res.end(html)
    if (req.method === 'POST') {
        let body = ''
        req.on('data', chunk => body += chunk)

        req.on('end', () => {
            const params = new URLSearchParams(body)
            const msgObj = Object.fromEntries(params)

            console.log(msgObj)

            sendModule.send(msgObj.message)
        })
    }
    
}).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/`))
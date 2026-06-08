const http = require('http')
const fs = require('fs')

const PORT = 8080
const boundary = 'sending-file'

http.createServer((req, res) => {
        res.writeHead(200, {
            "content-disposition": 'form-data; name="file"; filename="file.txt"',
            "content-type": 'multipart/form-data; boundary=' + boundary
        })
        const dataFromFile = fs.readFileSync('./file.txt')
        res.write(`--${boundary}\r\n`);
        res.write(
            'Content-Disposition: form-data; name="file"; filename="file.txt"\r\n'
        );
        res.write('Content-Type: text/plain\r\n\r\n');
        res.write(dataFromFile);
        res.write(`\r\n--${boundary}--\r\n`);
        res.end();
    }
).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
const http = require('http')
const xmlbuilder = require('xmlbuilder')
const xml2js = require('xml2js')

const PORT = 8080

http.createServer((req, res) => {
    let body = ''
    let obj = null
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
        xml2js.parseString(body, (_, result) => obj = result)
        let xmldata = xmlbuilder.create('response').att('id', parseInt(obj.request.$.id) + 5).att('request', obj.request.$.id)
        xmldata.ele('sum', {
            element: 'x',
            result: obj.request.x.reduce((acc, next) => acc + parseInt(next.$.value), 0)
        })
        xmldata.ele('concat', {
            element: 'm',
            result: obj.request.m.reduce((acc, next) => acc + next.$.value, '')
        })
        res.end(xmldata.toString({pretty: true}))
    })
}).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
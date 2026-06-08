const http = require('http')
const xmlbulder = require('xmlbuilder')
const xml2js = require('xml2js')

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: 'POST',
    headers: {
        'content-type': 'application/xml',
        'accept': 'application/xml'
    }
}

let xmldata = xmlbulder.create('request').att('id', 28)
xmldata.ele('x').att('value', 1)
xmldata.ele('x').att('value', 2)
xmldata.ele('m').att('value', 'a')
xmldata.ele('m').att('value', 'b')
xmldata.ele('m').att('value', 'c')

const req = http.request(options, res => {
    let body = ''
    res.on('data', chunk => body += chunk)
    console.log('Data to server:\r\n', xmldata.toString({pretty: true}))
    res.on('end', () => console.log('Data from server:\n', body))
})
req.write(xmldata.toString())
req.end()
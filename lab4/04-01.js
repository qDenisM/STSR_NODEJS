const http = require('http')
const data = require('./db_data')
const url = require('url')
const { nextTick } = require('process')

const PORT = 2000

const DB = new data.DB()

DB.on('GET', (req, res) => {
    console.log('GET')
    process.nextTick(() => res.end(JSON.stringify(DB.select())))
})
DB.on('POST', (req, res) => {
    console.log('POST')
    req.on('data', data => {
        process.nextTick(() => {
            let result = JSON.parse(data)
            DB.insert(result)
            res.end(JSON.stringify(result))
        })
    })
})
DB.on('PUT', (req, res) => {
    console.log('PUT')
    req.on('data', data => {
        process.nextTick(() => {
            result = JSON.parse(data)
            editedItem = DB.update(result)
            res.end(JSON.stringify(editedItem))
        })
    })
})
DB.on('DELETE', (req, res) => {
    console.log('DELETE')
    const parsed = url.parse(req.url, true)
    const id = parseInt(parsed.query.id)
    if (id) {
        process.nextTick(() => {
            const deletedItem = DB.delete(id)
            if (deletedItem)
                res.end(JSON.stringify({success: true, deletedItem: deletedItem}))
            else 
                res.end(JSON.stringify({error: 'Item not found'}))
        })
    }
})

http.createServer((req, res) => {
    res.writeHead(200, {
        'content-type': 'application/json;charset=utf-8'
    })
    const parsed = url.parse(req.url, true);
    if (parsed.pathname == '/api/db') {
        process.nextTick(() => DB.emit(req.method, req, res))
    }
}).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
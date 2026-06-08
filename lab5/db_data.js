const EventEmitter = require('node:events')

db_data = [
    {
        id: 1,
        name: 'Иванов И. И.',
        bday: '2001-01-01',
    },
    {
        id: 2,
        name: 'Петров П. П.',
        bday: '2001-01-02',
    },
    {
        id: 3,
        name: 'Сидоров С. С.',
        bday: '2001-01-03',
    },
]

class DB extends EventEmitter {
    select() {
        return db_data
    }

    insert(item) {
        if (item.id) 
            db_data.push(item)
        else {
            item.id = db_data.length + 1
            db_data.push(item)
        }
        return item
    }

    update(item) {
        const index = db_data.findIndex(dbItem => dbItem.id == item.id)
        if (index !== -1) {
            db_data[index] = item
        }
        return item
    }

    delete(id) {
        const index = db_data.findIndex(item => item.id == id)
        if (index !== -1) {
            const deletedItem = db_data[index]
            db_data.splice(index, 1)
            return deletedItem
        }
    }

    commit() {
        console.log('commit')
    }
}

exports.DB = DB;
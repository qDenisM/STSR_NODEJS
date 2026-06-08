const dataUsers = require('./data.js')

const string = 'admin:qwerty'
const logAndPass = string.split(':')

dataUsers.map((value => {
    console.log(value.login)
}))
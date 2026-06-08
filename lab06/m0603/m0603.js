const nodemailer = require('nodemailer');

const SENDER = 'belowhellfire@gmail.com'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER,
        pass: 'cctgvlzewnnupzxs'
    }
})

const send = (msg) => transporter.sendMail({
    from: SENDER,
    to: SENDER,
    title: 'send from module',
    text: msg
})

exports.send = send
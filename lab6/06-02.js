const http = require("http");
const nodemailer = require("nodemailer");

const PORT = 2000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "belowhellfire@gmail.com",
    pass: "cctgvlzewnnupzxs",
  },
})

const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Send Form</title>
        </head>
        <body>
            <style>
                button {
                    padding: 10px, 20px;
                }
            </style>
            <form method="POST" action="/">
                <label>Почта отправителя:</label><br/>
                <input type="email" name="sender" /><br/>
                <label>Почта получателя:</label><br/>
                <input type="email" name="receiver" /><br/>
                <label>Сообщение:</label><br/>
                <input type="text" name="message" /><br/>
                <button type="submit">
                    Отправить
                </button>
            </form>
        </body>
        </html>
    `;

http
  .createServer((req, res) => {
    res.end(html);

    if (req.method == "POST") {
      let body = "";

      req.on("data", (chunk) => (body += chunk.toString()));

      req.on("end", () => {
        const params = new URLSearchParams(body);
        const dataObj = Object.fromEntries(params);
        console.log(dataObj)

        transporter.sendMail({
          from: dataObj.sender,
          to: dataObj.receiver,
          subject: '06-02.js',
          text: dataObj.message
        }).then(() => console.log('success sending')).catch((err) => console.log(`Error: ${err}`))
        
      });
    }
  })
  .listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}/`),
  );

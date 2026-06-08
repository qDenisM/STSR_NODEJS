const http = require("http");
const url = require("url");
const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
const xml2js = require("xml2js");
const multiparty = require("multiparty");
const path = require("path");

const PORT = 8080;

const requestHeaders = (headers) => {
  let b = "";
  for (key in headers) {
    b += `<h3>${key}</h3><p>${headers[key]}</p>`;
  }
  return b;
};

const server = http
  .createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const arrayOfPath = parsedUrl.pathname.split("/");
    console.log(arrayOfPath);
    switch (arrayOfPath[1]) {
      case "connection":
        {
          const queryParams = parsedUrl.query.set;
          if (queryParams) {
            server.keepAliveTimeout = parseInt(queryParams);
          }
          res.write(`keepAliveTimeout = ${server.keepAliveTimeout}`);
          req.socket.on('close', () => console.log('Current client disconnect'))
          res.end()
        }
        break;
      case "headers":
        {
          console.log(req.headers);
          console.log(res.getHeaders());
          res.setHeaders(
            new Headers({
              custom: "lab8",
              "content-type": "text/html; charset=utf-8",
            }),
          );
          res.write(
            `<h1>Заголовки запроса:</h1> ${requestHeaders(req.headers)}`,
          );
          res.end(
            `<h1>Заголовки ответа: </h1> ${requestHeaders(res.getHeaders())}`,
          );
        }
        break;
      case "parameter": {
        if (!parsedUrl.query.y) {
          if (/^\/parameter\/\d+?\/?\d+?$/.test(parsedUrl.pathname)) {
            const firstNumber = parseInt(arrayOfPath[2]);
            const secondNumber = parseInt(arrayOfPath[3]);
            res.end(`<p>Сумма: ${firstNumber + secondNumber}</p>
                     <p>Разность: ${firstNumber - secondNumber}</p>
                     <p>Произведение: ${firstNumber * secondNumber}</p>
                     <p>Частное: ${firstNumber / secondNumber}</p>`);
            break;
          } else {
            {
              res.end(`Incorrect URI: ${req.url}`);
              break;
            }
          }
        } else {
          const firstNumber = parseInt(parsedUrl.query.x);
          const secondNumber = parseInt(parsedUrl.query.y);
          res.end(`<p>Сумма: ${firstNumber + secondNumber}</p>
                 <p>Разность: ${firstNumber - secondNumber}</p>
                 <p>Произведение: ${firstNumber * secondNumber}</p>
                 <p>Частное: ${firstNumber / secondNumber}</p>`);
          break;
        }
      }
      case "close":
        {
          res.end("Server will shutdown in 10 seconds");
          setTimeout(() => process.exit(), 10000);
        }
        break;
      case "socket":
        {
          res.end(`<p>Server IP: ${res.socket.localAddress}</p>
                 <p>Server Port: ${res.socket.localPort}</p>
                 <p>Client IP: ${req.socket.localAddress}</p>
                 <p>Client Port: ${req.socket.remotePort}</p>`);
        }
        break;
      case "req-data":
        {
          let body = [];
          req.on("data", (chunk) => {
            body.push(chunk);
          });
          req.on("end", () => {
            console.log(body);
            res.end();
          });
        }
        break;
      case "resp-status":
        {
          const params = parsedUrl.query;
          res.statusCode = parseInt(params.code);
          res.statusMessage = params.mess;
          res.end(`Status Code: ${res.statusCode}\n\rStatus Message: ${res.statusMessage}`);
        }
        break;
      case "formparameter":
        {
          let body = "";
          res.writeHead(200, {
            "access-control-allow-origin": "*",
            "content-type": "text/html; charset=utf-8",
          });
          if (req.method === "GET") {
            const dataForm = fs.readFileSync("./index.html");
            res.end(dataForm);
          }
          console.log(req.method);
          if (req.method === "POST") {
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              console.log(body);
              const formParams = new URLSearchParams(body);
              const formObject = Object.fromEntries(formParams);
              console.log(formObject);
              for (key in formObject) {
                res.write(`
                        <p>${key}: ${formObject[key] ? formObject[key] : "''"}</p>
                        `);
              }
              res.end();
            });
          }
        }
        break;
      case "json":
        {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
            const data = JSON.parse(body);
            console.log(data);
            res.writeHead(200, {
              "content-type": "application/json",
            });
            res.end(
              JSON.stringify({
                __comment: "Ответ. Лабораторная работа 8/10",
                x_plus_y: parseInt(data.x) + parseInt(data.y),
                Concatination_s_o:
                  "Сообщение: " + data.o.surname + ", " + data.o.name,
                Length_m: data.m.length,
              }),
            );
          });
        }
        break;
      case "xml":
        {
          res.writeHead(200, {
            "content-type": "application/xml; charset=utf-8",
          });
          let body = "";
          let obj = null;
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
            xml2js.parseString(body, (_, result) => {
              obj = result;
            });
            let xmldoc = xmlbuilder
              .create("response")
              .att("id", parseInt(obj.request.$.id) + 5)
              .att("request", obj.request.$.id);
            xmldoc 
              .ele("sum")
              .att("element", "x")
              .att(
                "result",
                obj.request.x.reduce(
                  (acc, next) => acc + parseInt(next.$.value),
                  0,
                ),
              );
            xmldoc
              .ele("concat")
              .att("element", "m")
              .att(
                "result",
                obj.request.m.reduce((acc, next) => acc + next.$.value, ""),
              );
            res.end(xmldoc.toString());
          });
        }
        break;
      case "files":
        {
          if (!arrayOfPath[2]) {
            const files = fs.readdirSync("./static");
            const amountFiles = files.length;
            res.setHeader("X-static-files-count", amountFiles);
            res.end();
          } else {
            const files = fs.readdirSync("./static");
            const filename = arrayOfPath[2];
            if (files.includes(filename)) {
              console.log(req.url);
              res.writeHead(200, {
                "content-disposition": "attachment",
                "content-type": "text/plain; charset=utf-8",
              });
              fs.createReadStream(`./static/${filename}`).pipe(res);
            } else {
              res.writeHead(404, {
                "content-type": "text/plain",
              });
              res.statusMessage = "Resource not found";
              res.end("Resource not found");
            }
          }
        }
        break;
      case "upload":
        {
          if (req.method === "GET") {
            res.writeHead(200, {
              "content-type": "text/html",
            });
            res.end(`
                        <form
                        style="
                            display: flex;
                            flex-direction: column;
                            width: 20%;
                            gap: 0.5rem;
                            margin: 0 auto;
                        "
                        method="POST"
                        action="/upload"
                        enctype="multipart/form-data"
                        >
                            <input type="file" name="file" style="padding: 10px; font-size: 1.125rem;"/>
                            <input type="submit" value="Upload File" style="padding: 10px 20px; font-size: 1.125rem"/>
                        </form>
                    `);
          } else if (req.method === "POST") {
            const form = new multiparty.Form({ uploadDir: "./static" });
            form.parse(req, (err, _, files) => {
              if (err) {
                res.end(err);
                return;
              }
              console.log(files);
              fs.rename(
                path.join(__dirname, files.file[0].path),
                path.join(__dirname, "static", files.file[0].originalFilename),
                (err) => {
                  if (err) {
                    res.writeHead(500, {
                      "content-type": "text/plain",
                    });
                    res.statusMessage = "Error with renaming file";
                    res.end(res.statusMessage);
                    return;
                  }
                  res.end();
                },
              );
            });
          }
        }
        break;
      default:
        {
          res.writeHead(404, {
            "content-type": "text/plain; charset=utf-8",
          });
          res.end("Resource not found");
        }
        break;
    }
  })
  .listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}/`),
  );

const http = require("http");
const fs = require("fs");
const rpcws = require("rpc-websockets").Server;

const PORT = 8080;
const RPC_PORT = 4000;
const BACKUP_CHANGED_EVENT = "backup";

const socketServer = new rpcws({
  port: RPC_PORT,
  host: "localhost",
  path: '/'
});

socketServer.event(BACKUP_CHANGED_EVENT)

function backupNameToYYYYDDMM(filename) {
  const yyyy = filename.slice(0, 4);
  const mm = filename.slice(4, 6);
  const dd = filename.slice(6, 8);
  return `${yyyy}${dd}${mm}`;
}

function calculateDate() {
  let date = new Date();
  let time;
  time =
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0");

  return time;
}

fs.watch(".", (eventType, filename) => {
  if (!filename) return;
  if (!/^\d{14}_StudentLists\.json$/.test(filename)) return;
  socketServer.emit(BACKUP_CHANGED_EVENT, {
    eventType,
    file: filename,
    date: calculateDate(),
    message: `Копия ${filename} была изменена`,
  });
});

const routes = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    handler: (req, res) => {
      fs.readFile("./StudentLists.json", (err, data) => {
        if (err) {
          res.writeHead(500, {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              error: 1,
              message: "Ошибка чтения файла ./StudentLists.json",
            }),
          );
        }
        res.writeHead(200, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(JSON.parse(data)));
      });
    },
  },

  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/backup" }),
    handler: (req, res) => {
      const files = fs.readdirSync(".");
      const backupFiles = files.filter((file) =>
        /^\d{14}_StudentLists\.json$/.test(file),
      );
      res.writeHead(200, {
        "content-type": "application/json",
      });
      res.end(JSON.stringify(backupFiles));
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/:n" }),
    handler: (req, res, match) => {
      const id = match.pathname.groups.n;
      fs.readFile("./StudentLists.json", (err, data) => {
        if (err) {
          res.writeHead(500, {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              error: 1,
              message: "Ошибка чтения файла ./StudentLists.json",
            }),
          );
        }
        const file = JSON.parse(data);
        if (id > file.length) {
          res.writeHead(400, {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              error: 2,
              message: `Студент с id равным ${id} не найден`,
            }),
          );
        }
        for (const student of file) {
          if (student.id !== id) continue;
          res.writeHead(200, {
            "content-type": "application/json",
          });
          res.end(JSON.stringify(student));
        }
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/" }),
    handler: (req, res) => {
      let data = "";
      const file = fs.readFileSync("./StudentLists.json");
      const fileObject = JSON.parse(file);
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", () => {
        const newStudent = {
          id: fileObject.length + 1,
          ...JSON.parse(data),
        };
        fileObject.push(newStudent);
        fs.writeFileSync(
          "./StudentLists.json",
          JSON.stringify(fileObject, null, 4),
        );
        res.writeHead(200, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(newStudent));
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/backup" }),
    handler: (req, res) => {
      let timeFromCopy = calculateDate();
      let timeAfterCopy = "";
      setTimeout(() => {
        timeAfterCopy = calculateDate();
        fs.copyFileSync(
          "./StudentLists.json",
          `./${timeAfterCopy}_StudentLists.json`,
        );
        res.writeHead(200, {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            currentTime: timeFromCopy,
            timeAfterCopy: timeAfterCopy,
          }),
        );
      }, 2000);
    },
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/" }),
    handler: (req, res) => {
      let data = "";
      const file = fs.readFileSync("./StudentLists.json");
      const fileObject = JSON.parse(file);
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", () => {
        let editedStudent = JSON.parse(data);
        const index = fileObject.findIndex(
          (student) => student.id == editedStudent.id,
        );
        if (index === -1) {
          res.writeHead(400, {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              error: 2,
              message: `Студент с id равным ${editedStudent.id} не найден`,
            }),
          );
          return;
        }
        fileObject[index] = editedStudent;
        fs.writeFileSync(
          "./StudentLists.json",
          JSON.stringify(fileObject, null, 4),
        );
        res.writeHead(200, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(editedStudent));
      });
    },
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/backup/:yyyyddmm" }),
    handler: (req, res, match) => {
      const timeFromDelete = match.pathname.groups.yyyyddmm;
      const files = fs.readdirSync(".");
      const backupFiles = files.filter((file) => /^\d{14}_StudentLists\.json$/.test(file));
      const deleted = [];
      for (const file of backupFiles) {
        const fileDate = backupNameToYYYYDDMM(file);
        if (fileDate < timeFromDelete) {
          fs.unlinkSync(`./${file}`);
          deleted.push(file);
        }
      }
      res.writeHead(200, {
        "content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          beforeDate: timeFromDelete,
          deletedCount: deleted.length,
          deleted,
        }),
      );
    },
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/:n" }),
    handler: (req, res, match) => {
      const id = match.pathname.groups.n;
      const file = fs.readFileSync("./StudentLists.json");
      const fileObject = JSON.parse(file);
      const index = fileObject.findIndex((student) => id == student.id);
      if (index === -1) {
        res.writeHead(400, {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            error: 2,
            message: `Студент с id равным ${id} не найден`,
          }),
        );
        return;
      }
      const deletedStudent = fileObject[index];
      fileObject.splice(index, 1);
      fs.writeFileSync(
        "./StudentLists.json",
        JSON.stringify(fileObject, null, 4),
      );
      res.writeHead(200, {
        "content-type": "application/json",
      });
      res.end(JSON.stringify(deletedStudent));
    },
  },
];

http
  .createServer((req, res) => {
    for (const route of routes) {
      if (route.method !== req.method) continue;
      const match = route.pattern.exec(req.url);
      if (match) {
        route.handler(req, res, match);
        return;
      }
    }
  })
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`RPC WebSocket is running on ws://localhost:${RPC_PORT}`);
  });

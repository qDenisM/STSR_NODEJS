const http = require("http");
const data = require("./db_data");
const url = require("url");
const EventEmitter = require("node:events");

const PORT = 2000;

const DB = new data.DB();
const emitter = new EventEmitter();

let consoleData = "";
let countRequests = 0;
let countCommits = 0;

DB.on("GET", (req, res) => {
  console.log("GET");
  countRequests++;
  process.nextTick(() => res.end(JSON.stringify(DB.select())));
});
DB.on("POST", (req, res) => {
  console.log("POST");
  countRequests++;
  req.on("data", (data) => {
    process.nextTick(() => {
      let result = JSON.parse(data);
      DB.insert(result);
      res.end(JSON.stringify(result));
    });
  });
});
DB.on("PUT", (req, res) => {
  console.log("PUT");
  countRequests++;
  req.on("data", (data) => {
    process.nextTick(() => {
      result = JSON.parse(data);
      editedItem = DB.update(result);
      res.end(JSON.stringify(editedItem));
    });
  });
});
DB.on("DELETE", (req, res) => {
  console.log("DELETE");
  countRequests++;
  const parsed = url.parse(req.url, true);
  const id = parseInt(parsed.query.id);
  if (id) {
    process.nextTick(() => {
      const deletedItem = DB.delete(id);
      if (deletedItem)
        res.end(JSON.stringify({ success: true, deletedItem: deletedItem }));
      else res.end(JSON.stringify({ error: "Item not found" }));
    });
  }
});

let timer = setTimeout(() => {}, 0);
let timerSS = setTimeout(() => {}, 0);
let interval = setInterval(() => {}, 0);

emitter.on("sd", (x) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => process.exit(), x * 1000);
  interval.unref();
});

const callbackInterval = (x) => {
  clearInterval(interval)
  interval = setInterval(() => {
    countCommits++;
    DB.commit();
  }, x * 1000)
  interval.unref();
};

emitter.on("sc", callbackInterval);
emitter.on("ss", (x) => {
  let statObj = {
    start: new Date().toISOString(),
    finish: "",
    request: 0,
    commit: 0,
  };
  
  timerSS = setTimeout(() => {
    statObj.finish = new Date().toISOString();
    statObj.request = countRequests;
    statObj.commit = countCommits;
    copyStatObj = statObj;
    console.log("copyObj:" + JSON.stringify(statObj));
    countRequests = 0;
    countCommits = 0;
    clearInterval(interval);
    return statObj;
  }, x * 1000).unref()
});

process.stdin.on("readable", () => {
  let chunk;
  let arrayArgs;
  let secondsAmount;
  let command;
  while ((chunk = process.stdin.read()) != null) {
    consoleData = chunk.toString().trim();
    arrayArgs = consoleData.split(" ");
    if (arrayArgs.length > 2) throw new Error("Too much args");

    command = arrayArgs[0];
    if (!["sd", "sc", "ss"].includes(command))
      throw new Error("Unknown command");

    secondsAmount = parseInt(arrayArgs[1]);
    if (Number.isNaN(secondsAmount)) {
      if (timer || timerSS) {
        clearTimeout(timer)
        clearTimeout(timerSS)
      };
      if (interval) clearInterval(interval);
      continue;
    }

    emitter.emit(command, secondsAmount);
  }
});

http
  .createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    if (parsed.pathname == "/api/db") {
      res.writeHead(200, {
        "content-type": "application/json;charset=utf-8",
      });
      process.nextTick(() => DB.emit(req.method, req, res));
      res.end();
    }
    if (parsed.pathname.startsWith("/api/ss")) {
      const pathParts = parsed.pathname.split("/");

      const paramTime = pathParts[3];
      res.writeHead(200, {
        "content-type": "application/json;charset=utf-8",
      });
      if (paramTime) emitter.emit("ss", paramTime);
      else emitter.emit("ss");
      setTimeout(() => res.end(JSON.stringify(copyStatObj)), paramTime * 1000);
    }
  })
  .listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`),
  );
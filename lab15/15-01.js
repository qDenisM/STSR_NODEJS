const { MongoClient } = require("mongodb");
const http = require("http");
require("dotenv").config();

const PORT = 8080;

let db;

async function connectToMongoDB() {
  const client = new MongoClient(
    "mongodb://admin:123467@localhost:27017/?authSource=admin",
  );
  await client.connect();

  db = client.db("belstu");
  return client;
}

const routes = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/api/faculties" }),
    handler: async (req, res) => {
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      const result = await db.collection("faculties").find().toArray();
      const objectResult = Object.fromEntries(
        result.map((item) => [item.FACULTY, item]),
      );
      res.end(JSON.stringify(objectResult));
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/api/pulpits" }),
    handler: async (req, res) => {
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      const result = await db.collection("pulpits").find().toArray();
      const objectResult = Object.fromEntries(
        result.map((item) => [item.PULPIT, item]),
      );
      res.end(JSON.stringify(objectResult));
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/api/faculties" }),
    handler: (req, res) => {
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString().trim();
      });
      req.on("end", async () => {
        const newFaculty = JSON.parse(data);
        console.log(newFaculty);
        await db.collection("faculties").insertOne(newFaculty);
        res.end(data);
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/api/pulpits" }),
    handler: (req, res) => {
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString().trim();
      });
      req.on("end", async () => {
        const newPulpit = JSON.parse(data);
        console.log(newPulpit);
        await db.collection("pulpits").insertOne(newPulpit);
        res.end(data);
      });
    },
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/api/faculties" }),
    handler: (req, res) => {
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString().trim();
      });
      req.on("end", async () => {
        const newFaculty = JSON.parse(data);
        console.log(newFaculty);
        await db.collection("faculties").updateOne(
          { FACULTY: newFaculty.FACULTY },
          {
            $set: {
              FACULTY_NAME: newFaculty.FACULTY_NAME,
            },
          },
        );
        res.end(data);
      });
    },
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/api/pulpits" }),
    handler: (req, res) => {
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString().trim();
      });
      req.on("end", async () => {
        const newPulpit = JSON.parse(data);
        console.log(newPulpit);
        await db.collection("pulpits").updateOne(
          { PULPIT: newPulpit.PULPIT },
          {
            $set: {
              PULPIT_NAME: newPulpit.PULPIT_NAME,
              FACULTY: newPulpit.FACULTY,
            },
          },
        );
        res.end(data);
      });
    },
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/api/faculties/:code" }),
    handler: async (req, res, match) => {
      const code = match.pathname.groups.code;
      res.writeHead(200, {
        "content-type": "application/json; utf-8",
      });
      const deletedDoc = await db
        .collection("faculties")
        .findOneAndDelete({ FACULTY: code });
      res.end(JSON.stringify(deletedDoc));
    },
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/api/pulpits/:code" }),
    handler: async (req, res, match) => {
      const code = match.pathname.groups.code;
      res.writeHead(200, {
        "content-type": "application/json; utf-8",
      });
      const deletedDoc = await db
        .collection("pulpits")
        .findOneAndDelete({ PULPIT: code });
      res.end(JSON.stringify(deletedDoc));
    },
  },
];

connectToMongoDB().then(() => {
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
    });
});

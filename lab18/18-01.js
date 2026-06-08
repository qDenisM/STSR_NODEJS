const http = require("http");
const Sequelize = require("sequelize");

const PORT = 8080;

const sequelize = new Sequelize("MDS", "student", "Pa$$w0rd", {
  host: "80.94.224.209",
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
});

const { Faculty, Pulpit, Subject, Auditorium_type, Auditorium } =
  require("./model.js").initORM(sequelize);

const routes = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    handler: (req, res) => {
      res.end("<html><head></head><body></body></html>");
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/api/faculties" }),
    handler: async (req, res) => {
      try {
        const rows = await Faculty.findAll({ raw: true });
        const result = Object.fromEntries(
          rows.map((item, index) => [
            `Row ${index}`,
            { FACULTY: item.faculty, FACULTY_NAME: item.faculty_name },
          ]),
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/api/pulpits" }),
    handler: async (req, res) => {
      try {
        const rows = await Pulpit.findAll({ raw: true });
        const result = Object.fromEntries(
          rows.map((item, index) => [
            `Row ${index}`,
            {
              PULPIT: item.pulpit,
              PULPIT_NAME: item.pulpit_name,
              FACULTY: item.faculty,
            },
          ]),
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/api/subjects" }),
    handler: async (req, res) => {
      try {
        const rows = await Subject.findAll({ raw: true });
        const result = Object.fromEntries(
          rows.map((item, index) => [
            `Row ${index}`,
            {
              SUBJECT: item.subject,
              SUBJECT_NAME: item.subject_name,
              PULPIT: item.pulpit,
            },
          ]),
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/api/auditoriumstypes" }),
    handler: async (req, res) => {
      try {
        const rows = await Auditorium_type.findAll({ raw: true });
        const result = Object.fromEntries(
          rows.map((item, index) => [
            `Row ${index}`,
            {
              AUDITORIUM_TYPE: item.auditorium_type,
              AUDITORIUM_TYPENAME: item.auditorium_typename,
            },
          ]),
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/api/auditoriums" }),
    handler: async (req, res) => {
      try {
        const rows = await Auditorium.findAll({ raw: true });
        const result = Object.fromEntries(
          rows.map((item, index) => [
            `Row ${index}`,
            {
              AUDITORIUM: item.auditorium,
              AUDITORIUM_NAME: item.auditorium_name,
              AUDITORIUM_CAPACITY: item.auditorium_capacity,
              AUDITORIUM_TYPE: item.auditorium_type,
            },
          ]),
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/api/faculties" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Faculty.create({
            faculty: body.FACULTY,
            faculty_name: body.FACULTY_NAME,
          });
          res.writeHead(200, { "content-type": "application/json" });
          res.end(data);
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/api/pulpits" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Pulpit.create({
            pulpit: body.PULPIT,
            pulpit_name: body.PULPIT_NAME,
            faculty: body.FACULTY,
          });
          res.writeHead(200, { "content-type": "application/json" });
          res.end(data);
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/api/subjects" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Subject.create({
            subject: body.SUBJECT,
            subject_name: body.SUBJECT_NAME,
            pulpit: body.PULPIT,
          });
          res.writeHead(200, { "content-type": "application/json" });
          res.end(data);
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/api/auditoriumstypes" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Auditorium_type.create({
            auditorium_type: body.AUDITORIUM_TYPE,
            auditorium_typename: body.AUDITORIUM_TYPENAME,
          });
          res.writeHead(200, { "content-type": "application/json" });
          res.end(data);
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/api/auditoriums" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Auditorium.create({
            auditorium: body.AUDITORIUM,
            auditorium_name: body.AUDITORIUM_NAME,
            auditorium_capacity: body.AUDITORIUM_CAPACITY,
            auditorium_type: body.AUDITORIUM_TYPE,
          });
          res.writeHead(200, { "content-type": "application/json" });
          res.end(data);
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },

  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/api/faculties" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Faculty.update(
            { faculty_name: body.FACULTY_NAME },
            { where: { faculty: body.FACULTY } },
          );
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(body));
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/api/pulpits" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Pulpit.update(
            {
              pulpit_name: body.PULPIT_NAME,
              faculty: body.FACULTY,
            },
            { where: { pulpit: body.PULPIT } },
          );
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(body));
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/api/subjects" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Subject.update(
            {
              subject_name: body.SUBJECT_NAME,
              pulpit: body.PULPIT,
            },
            { where: { subject: body.SUBJECT } },
          );
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(body));
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/api/auditoriumstypes" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Auditorium_type.update(
            { auditorium_typename: body.AUDITORIUM_TYPENAME },
            { where: { auditorium_type: body.AUDITORIUM_TYPE } },
          );
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(body));
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "api/auditoriums" }),
    handler: (req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const body = JSON.parse(data);
          await Auditorium.update(
            {
              auditorium_name: body.AUDITORIUM_NAME,
              auditorium_capacity: body.AUDITORIUM_CAPACITY,
              auditorium_type: body.AUDITORIUM_TYPE,
            },
            { where: { auditorium: body.AUDITORIUM } },
          );
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(body));
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: 1, message: err.message }));
        }
      });
    },
  },

  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/api/faculties/:code" }),
    handler: async (req, res, match) => {
      try {
        const code = match.pathname.groups.code;
        const row = await Faculty.findByPk(code, { raw: true });
        if (!row) {
          res.writeHead(404, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              error: 2,
              message: `Запись с кодом ${code} не найдена`,
            }),
          );
          return;
        }
        await Faculty.destroy({ where: { faculty: code } });
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            FACULTY: row.faculty,
            FACULTY_NAME: row.faculty_name,
          }),
        );
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/api/pulpits/:code" }),
    handler: async (req, res, match) => {
      try {
        const code = match.pathname.groups.code;
        const row = await Pulpit.findByPk(code, { raw: true });
        if (!row) {
          res.writeHead(404, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              error: 2,
              message: `Запись с кодом ${code} не найдена`,
            }),
          );
          return;
        }
        await Pulpit.destroy({ where: { pulpit: code } });
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            PULPIT: row.pulpit,
            PULPIT_NAME: row.pulpit_name,
            FACULTY: row.faculty,
          }),
        );
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/api/subjects/:code" }),
    handler: async (req, res, match) => {
      try {
        const code = match.pathname.groups.code;
        const row = await Subject.findByPk(code, { raw: true });
        if (!row) {
          res.writeHead(404, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              error: 2,
              message: `Запись с кодом ${code} не найдена`,
            }),
          );
          return;
        }
        await Subject.destroy({ where: { subject: code } });
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            SUBJECT: row.subject,
            SUBJECT_NAME: row.subject_name,
            PULPIT: row.pulpit,
          }),
        );
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/api/auditoriumtypes/:code" }),
    handler: async (req, res, match) => {
      try {
        const code = match.pathname.groups.code;
        const row = await Auditorium_type.findByPk(code, { raw: true });
        if (!row) {
          res.writeHead(404, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              error: 2,
              message: `Запись с кодом ${code} не найдена`,
            }),
          );
          return;
        }
        await Auditorium_type.destroy({ where: { auditorium_type: code } });
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            AUDITORIUM_TYPE: row.auditorium_type,
            AUDITORIUM_TYPENAME: row.auditorium_typename,
          }),
        );
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/api/auditoriums/:code" }),
    handler: async (req, res, match) => {
      try {
        const code = match.pathname.groups.code;
        const row = await Auditorium.findByPk(code, { raw: true });
        if (!row) {
          res.writeHead(404, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              error: 2,
              message: `Запись с кодом ${code} не найдена`,
            }),
          );
          return;
        }
        await Auditorium.destroy({ where: { auditorium: code } });
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            AUDITORIUM: row.auditorium,
            AUDITORIUM_NAME: row.auditorium_name,
            AUDITORIUM_CAPACITY: row.auditorium_capacity,
            AUDITORIUM_TYPE: row.auditorium_type,
          }),
        );
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 1, message: err.message }));
      }
    },
  },
];

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to Database");

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
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: 2, message: "Маршрут не найден" }));
      })
      .listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
  })
  .catch((err) => {
    console.error("Connection failed:", err.message);
  });

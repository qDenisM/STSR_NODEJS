const http = require("http");
const fs = require("fs");
const { graphql, buildSchema } = require("graphql");

const { DB } = require("./db.js");
const { resolvers } = require("./resolvers.js");
const schema = buildSchema(fs.readFileSync("./schema.gql", "utf8"));

const PORT = 8080;
let db;

http
  .createServer((req, res) => {
    if (req.method !== "POST" || req.url !== "/graphql") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Use POST /graphql");
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        if (!db) db = await DB.init();

        const { query, variables } = JSON.parse(body || "{}");

        const result = await graphql({
          schema,
          source: query,
          variableValues: variables,
          contextValue: { db },
          rootValue: {
            ...resolvers.Query,
            ...resolvers.Mutation,
          },
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            errors: [{ message: err.message || String(err) }],
          }),
        );
      }
    });
  })
  .listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/graphql`));

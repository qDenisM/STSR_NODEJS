const fs = require("fs");
const http = require("http");
const multiparty = require("multiparty");
const path = require("path");

const options = {
  hostname: "localhost",
  port: 8080,
  path: "/",
  method: "GET",
};

const req = http.request(options, (res) => {
  const form = new multiparty.Form({
    uploadDir: "./clientReceivingFiles",
  });

  form.parse(res, (err, _, files) => {
    console.log(files);
    fs.rename(
      path.join(__dirname, files.file[0].path),
      path.join(__dirname, "clientReceivingFiles", files.file[0].originalFilename),
      (err) => console.log(err)
    );
  });
});

req.end();

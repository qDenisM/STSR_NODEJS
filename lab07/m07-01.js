function staticFile(staticFolderArgument = "./static") {
  const fs = require("fs");
  this.STATIC_FOLDER = staticFolderArgument;
  let pathStatic = (file) => {
    return `${this.STATIC_FOLDER}${file}`;
  };
  const pipeFile = (req, res, headers) => {
    res.writeHead(200, headers);
    fs.createReadStream(pathStatic(req.url)).pipe(res);
  };
  this.isStatic = (extension, file) => {
    const reg = new RegExp(`^\/.+\.${extension}$`);
    return reg.test(file);
  };
  this.sendFile = (req, res, headers) => {
    fs.access(pathStatic(req.url), fs.constants.R_OK, (err) => {
      if (err) this.code404(res);
      else pipeFile(req, res, headers);
    });
  };
  this.code404 = (res) => {
    res.statusCode = 404;
    res.statusMessage = "Resource not found";
    res.end("Resource not found");
  };
}

module.exports = (customStaticFolder) => {
  return new staticFile(customStaticFolder);
};
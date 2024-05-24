import fs from "fs";

const readFileMiddleware = (absoluteFilePath) => (req, res, next) => {
  fs.readFile(absoluteFilePath, "utf8", (err, data) => {
    if (err) {
      return next(err);
    }
    req.fileContent = data;
    next();
  });
};

export default readFileMiddleware;

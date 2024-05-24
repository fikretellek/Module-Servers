import fs from "fs";

const readFileMiddleware = (absoluteFilePath) => (req, res, next) => {
  fs.readFile(absoluteFilePath, "utf8", (err, data) => {
    if (err) {
      return next(err);
    }
    const lists = new Map(Object.entries(JSON.parse(data)));
    req.fileContent = lists;
    next();
  });
};

export default readFileMiddleware;

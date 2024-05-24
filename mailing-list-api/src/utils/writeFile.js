import fs from "fs";

const writeFile = (data, path) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(path, jsonData);
};

export default writeFile;

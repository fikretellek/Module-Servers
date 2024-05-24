import path from "path";
import { fileURLToPath } from "url";

export const resolveFilePath = (relativeFilePath) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "..", relativeFilePath);
};

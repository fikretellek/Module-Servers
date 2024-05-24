import path from "path";
import { fileURLToPath } from "url";

export const resolveFilePath = () => {
  const relativeFilePath = "./data/mailing-lists.json";
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "..", relativeFilePath);
};

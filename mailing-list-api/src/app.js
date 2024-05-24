import express from "express";
import cors from "cors";
import readFileMiddleware from "./middlewares/readFileMiddleware.js";
import { resolveFilePath } from "./utils/resolveFilePath.js";

const app = express();
const filePath = resolveFilePath("./data/mailing-lists.js");

app.use(express.json());
app.use(cors());
app.use(readFileMiddleware(filePath));

let list = ["abc", "abc"];

app.get("/list", (req, res) => {
  res.json(req.fileContent.toString());
});

export { app };

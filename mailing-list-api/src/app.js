import express from "express";
import cors from "cors";
import readFileMiddleware from "./middlewares/readFileMiddleware.js";
import { resolveFilePath } from "./utils/resolveFilePath.js";
import allListRouter from "./routers/allListRoute.js";

const app = express();
const filePath = resolveFilePath("./data/mailing-lists.json");

app.use(express.json());
app.use(cors());

app.use("/lists", readFileMiddleware(filePath), allListRouter);

export { app };

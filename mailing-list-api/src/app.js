import express from "express";
import cors from "cors";
import readFileMiddleware from "./middlewares/readFileMiddleware.js";
import { resolveFilePath } from "./utils/resolveFilePath.js";
import allListRouter from "./routers/allListRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(
    'please go to \n/list ---> for all group names \n/list/:name ---> for mail list of a group of members\nyou can delete or update a group as well \n(please provide group name and members for update method as below)\n ---> {"name": "group-name","members": ["me@me.com", ...]}'
  );
});
app.use("/lists", readFileMiddleware(resolveFilePath()), allListRouter);

export { app };

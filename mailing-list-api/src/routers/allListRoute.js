import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const data = req.fileContent;

  if (!data) {
    res.send("no list found");
  }

  res.json(data);
});

export default router;

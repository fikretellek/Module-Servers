import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log();
  const data = Object.keys(JSON.parse(req.fileContent));

  if (data.lenght === 0) {
    res.status(200).json([]);
  }

  res.status(200).json(data);
});

export default router;

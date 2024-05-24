import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const lists = new Map(Object.entries(req.fileContent));
  const keys = Array.from(lists.keys());

  if (lists.size === 0) {
    res.status(200).json([]);
  }

  res.status(200).json(keys);
});

export default router;

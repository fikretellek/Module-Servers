import { Router } from "express";
import { resolveFilePath } from "../utils/resolveFilePath.js";
import writeFile from "../utils/writeFile.js";

const router = Router();

router.get("/", (req, res) => {
  const lists = req.fileContent;
  const keys = Array.from(lists.keys());

  if (lists.size === 0) {
    res.status(200).json([]);
  }

  res.status(200).json(keys);
});

router.get("/:name", (req, res) => {
  const lists = req.fileContent;
  const requestedName = req.params.name;
  const requestedValue = lists.get(requestedName);

  if (!requestedValue) {
    res.status(404).send("no such member");
  }

  res.status(200).json({ [requestedName]: requestedValue });
});

router.delete("/:name", (req, res) => {
  const lists = req.fileContent;
  const deletingName = req.params.name;
  const isDeleted = lists.delete(deletingName);

  if (!isDeleted) {
    res.status(404).send("no such member");
  }

  const newObjectForWriting = Object.fromEntries(lists);
  writeFile(newObjectForWriting, resolveFilePath());

  res.status(200).send("member deleted");
});

router.put("/:name", (req, res) => {
  const lists = req.fileContent;
  const newName = req.body.name;
  const newMembers = req.body.members;
  lists.set(newName, newMembers);

  if (!newName.trim() || !newMembers || !Array.isArray(newMembers) || !(newMembers.length > 0)) {
    res.status(404).send("can not add member");
  }

  const newObjectForWriting = Object.fromEntries(lists);

  writeFile(newObjectForWriting, resolveFilePath());

  res.status(200).send("new member added");
});

export default router;

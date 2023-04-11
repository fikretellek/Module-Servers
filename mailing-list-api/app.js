const express = require("express");
const app = express();
const {
  fetchList,
  updateList,
  deleteList,
  fetchLists,
} = require("./db/index.js");

app.use(express.json());

app.get("/lists", (req, res, next) => {
  const listNames = fetchLists();

  res.status(200).send({ listNames });
});

app.get("/lists/:name", (req, res, next) => {
  const members = fetchList(req.params.name);
  const { name } = req.params;
  if (!members) {
    res.status(404).send({
      message: `no listing found for ${name}`,
    });
    return;
  }

  res.status(200).send({ members, name });
});

app.delete("/lists/:name", (req, res, next) => {
  const list = fetchList(req.params.name);
  const { name } = req.params;

  if (!list) {
    res.status(404).send({ message: `no listing found for ${name}` });
    return;
  }
  deleteList(name);

  res.status(200).send({ message: `listing for ${name} was deleted` });
});

app.put("/lists/:name", (req, res, next) => {
  const newList = req.body.members;
  const { name } = req.params;
  const list = fetchList(name);

  let statusCode = 200;
  if (!list) {
    statusCode = 201;
  }
  updateList(name, newList);

  res.sendStatus(statusCode);
});

app.get("/lists/:name/members", (req, res, next) => {
  const { name } = req.params;
  const members = fetchList(name);
  if (!members) {
    res.status(404).send({
      message: `no listing found for ${name}`,
    });
    return;
  }
  res.status(200).send({ members });
});

app.put("/lists/:name/members/email", (req, res, next) => {
  const { name } = req.params;
  const members = fetchList(name);
  const newEmail = req.body.email;
  updateList(name, [...members, newEmail]);

  res.sendStatus(200);
});

app.delete("/lists/:name/members/email", (req, res, next) => {
  const { name } = req.params;
  const { email: emailToDelete } = req.body;
  const members = fetchList(name);
  const newMembers = members.filter((email) => email !== emailToDelete);
  updateList(name, newMembers);

  res.sendStatus(200);
});

app.use((err, req, res, next) => {
  console.log("hitting the error handler...");
  console.log({ err });
});

module.exports = app;

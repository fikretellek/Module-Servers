process.env.PORT = process.env.PORT || 9090;
import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Get __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const welcomeMessage = {
  id: 0,
  from: "user",
  text: "send your first message!",
};

function validateMessage(newMessage) {
  return !(
    !newMessage.hasOwnProperty("text") ||
    !newMessage.hasOwnProperty("from") ||
    newMessage.from === "" ||
    newMessage.text === "" ||
    typeof newMessage.text != "string" ||
    typeof newMessage.from != "string"
  );
}

//This array is our "data store".
//We will start with one message in the array.
const messages = [welcomeMessage];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//websocket

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  console.log("New WebSocket Connection");

  messages.forEach((message) => ws.send(JSON.stringify(message)));

  ws.on("message", (message) => {
    console.log("Received message form client:", message);

    const parsedMessage = JSON.parse(message);

    messages.push(parsedMessage);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

//route methods

app.post("/messages", (req, res) => {
  const newMessage = req.body;

  if (!validateMessage(newMessage)) return res.status(400).send("wrong input");

  newMessage["id"] = messages[messages.length - 1].id + 1;
  newMessage["timeSent"] = new Date();
  messages.push(newMessage);
  res.json(messages);
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.get("/messages/search", (req, res) => {
  const searchInput = req.query.text.toLowerCase();
  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(searchInput)
  );
  res.json(filteredMessages);
});

app.get("/messages/latest/:length", (req, res) => {
  const length = req.params.length;
  const latestMessages = messages.slice(-length);
  res.json(latestMessages);
});

app.get("/messages/:id", (req, res) => {
  const messageId = req.params.id;
  const searchedMessage = messages.find((message) => message.id == messageId);
  res.json(searchedMessage);
});

app.delete("/messages/:id", (req, res) => {
  const messageId = req.params.id;
  const deleteMessage = messages.find((message) => message.id == messageId);
  messages.splice(messages.indexOf(deleteMessage), 1);
  res.json(messages);
});

app.patch("/messages/:id", (req, res) => {
  console.log(req.params.id);
  const messageId = req.params.id;
  const updatedInfo = req.body;
  const patchMessage = messages.find((message) => message.id == messageId);
  messages[messages.indexOf(patchMessage)] = {
    ...messages[messages.indexOf(patchMessage)],
    ...updatedInfo,
  };
  res.json(messages);
});

// upgrade https server to websocket server
const server = app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}...`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

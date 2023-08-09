process.env.PORT = process.env.PORT || 9090;
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

let nextMessageId = 1;

const messages = [welcomeMessage];

// create a new message
app.post("/messages", function (req, res) {
  const newMessage = req.body;
  newMessage.id = nextMessageId++;
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.get("/messages",  function(req, res) {
  res.json(messages);
})

//read messages by ID
app.get("/messages/:id", function(req, res) {
  const messageId = parseInt(req.params.id);
  const message = messages.find(msg => msg.id === messageId);

  if (message) {
    res.json(message);
  } else {
    res.status(404).json({ error: "Message Not Found" });
  }
});

app.delete("/messages/:id", function (req, res) {
  const messageId = parseInt(req.params.id);
  const messageIndex = messages.findIndex(msg => msg.id === messageId);

  if (messageIndex !== -1) {
    messages.slice(messageIndex,1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Message Not Found" });
  }
});



//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.


app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT,() => {
  console.log(`listening on PORT ${process.env.PORT}...`);
});

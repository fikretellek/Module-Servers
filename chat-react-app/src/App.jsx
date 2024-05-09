import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newUser, setNewUser] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("wss://module-servers.onrender.com");
    setWs(socket);

    socket.onopen = () => {
      console.log("websocket connected");
    };

    socket.onmessage = (event) => {
      console.log("event:", event);
      console.log("event.data:", event.data);
      const receivedMessage = JSON.parse(event.data);

      console.log("receivedMessage:", receivedMessage);

      setMessages((previousMessages) => [...previousMessages, receivedMessage]);
    };

    return () => {
      socket.close();
    };
  }, []);

  // useEffect(() => {
  //   getMessages();
  //   const interval = setInterval(() => getMessages(), 10000);
  //   return () => clearInterval(interval);
  // }, []);

  // function getMessages() {
  //   fetch("https://module-servers.onrender.com/messages")
  //     .then((response) => response.json())
  //     .then((data) => setMessages(data.slice().reverse()));
  // }

  function sendMessage() {
    const messageOBJ = { from: newUser, text: newMessage };
    setNewMessage("");

    // fetch("https://module-servers.onrender.com/messages", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newMessage),
    // })
    //   .then((response) => response.json())
    //   .then((data) => setMessages(data.slice().reverse()));

    ws.send(JSON.stringify(messageOBJ));
  }

  function generateMessage(message, index) {
    return (
      <p
        key={`${message.id} ${index}`}
        className={message.from === newUser ? "message right" : "message"}
      >
        <span className="from">from: {message.from}</span>
        {message.text}
      </p>
    );
  }

  return (
    <>
      <div id="chat-box">
        <div id="user-box">
          <h1>MESSAGES</h1>
          <input
            value={newUser}
            id="name"
            className="user-input"
            type="text"
            placeholder="enter name"
            onChange={(e) => setNewUser(e.target.value)}
          />
        </div>
        <div id="messages">
          {messages.toReversed().map((message, index) => generateMessage(message, index))}
        </div>
        <div id="message-box">
          <button className="send-button" onClick={sendMessage}>
            send
          </button>
          <textarea
            value={newMessage}
            name=""
            id="message-area"
            rows="4"
            placeholder="type here"
            onChange={(e) => setNewMessage(e.target.value)}
          ></textarea>
        </div>
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setNewMessage] = useState("");
  const [currentUser, setNewUser] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("wss://module-servers.onrender.com");
    setWs(socket);

    socket.onopen = () => {
      console.log("websocket connected");
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);

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
    const newMessage = { from: currentUser, text: currentMessage };
    document.getElementById("message-area").value = "";

    // fetch("https://module-servers.onrender.com/messages", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newMessage),
    // })
    //   .then((response) => response.json())
    //   .then((data) => setMessages(data.slice().reverse()));

    ws.send(JSON.stringify(newMessage));
  }

  function generateMessages(message, index) {
    const user = document.getElementById("name").value;
    return (
      <p
        key={`${message.id} ${index}`}
        className={message.from === user ? "message right" : "message"}
      >
        <span className="from">from: {message.from}</span>
        {message.text}
      </p>
    );
  }

  function setCurrentUser(e) {
    setNewUser(e.target.value);
  }

  function setCurrentMessage(e) {
    setNewMessage(e.target.value);
  }

  return (
    <>
      <div id="chat-box">
        <div id="user-box">
          <h1>MESSAGES</h1>
          <input
            id="name"
            className="user-input"
            type="text"
            placeholder="enter name"
            onKeyUp={setCurrentUser}
          />
        </div>
        <div id="messages">
          {messages.map((message, index) => generateMessages(message, index))}
        </div>
        <div id="message-box">
          <button className="send-button" onClick={sendMessage}>
            send
          </button>
          <textarea
            name=""
            id="message-area"
            rows="4"
            placeholder="type here"
            onKeyUp={setCurrentMessage}
          ></textarea>
        </div>
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const newMessage = { from: "", text: "" };

  useEffect(() => {
    getMessages();
    const interval = setInterval(() => getMessages(), 10000);
    return () => clearInterval(interval);
  }, []);

  function getMessages() {
    fetch("https://module-servers.onrender.com/messages")
      .then((response) => response.json())
      .then((data) => setMessages(data.slice().reverse()));
  }

  function sendMessage() {
    newMessage.from = document.getElementById("name").value;

    newMessage.text = document.getElementById("message-area").value;
    document.getElementById("message-area").value = "";
    fetch("https://module-servers.onrender.com/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
      .then((response) => response.json())
      .then((data) => setMessages(data.slice().reverse()));
  }

  return (
    <>
      <div id="chat-box">
        <div id="user-box">
          <h1>MESSAGES</h1>
          <input id="name" className="user-input" type="text" placeholder="enter name" />
        </div>
        <div id="messages">
          {messages.map((message, index) => {
            const currentUser = document.getElementById("name").value;
            const classname = message.from === currentUser ? "message right" : "message";

            return (
              <p key={`${message.id} ${index}`} className={classname}>
                <span className="from">from: {message.from}</span>
                {message.text}
              </p>
            );
          })}
        </div>
        <div id="message-box">
          <button className="send-button" onClick={sendMessage}>
            send
          </button>
          <textarea name="" id="message-area" rows="4" placeholder="type here"></textarea>
        </div>
      </div>
    </>
  );
}

export default App;

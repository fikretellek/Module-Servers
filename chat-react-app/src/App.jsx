import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const newMessage = { from: "", text: "" };

  useEffect(() => {
    getMessages();
  }, []);

  function getMessages() {
    fetch("https://module-servers.onrender.com/messages")
      .then((response) => response.json())
      .then((data) => setMessages(data));
  }

  function submitUsername() {
    newMessage.from = document.getElementById("username").value;

    newMessage.text = document.getElementById("message-box").value;

    fetch("https://module-servers.onrender.com/messages", {
      method: "POST",
      body: JSON.stringify(newMessage),
    });
  }

  return (
    <>
      <h1>MESSAGES</h1>

      <div id="chat-box">
        <div id="user-box">
          <input id="username" className="user-input" type="text" placeholder="enter username" />
          <button className="user-button" onClick={submitUsername}>
            save
          </button>
        </div>
        <div id="messages">
          {messages.map((message, index) => {
            return (
              <p key={`${message.id} ${index}`} className="message">
                {message.text}
              </p>
            );
          })}
        </div>
        <textarea name="" id="message-box" cols="30" rows="5" placeholder="type here"></textarea>
      </div>
    </>
  );
}

export default App;

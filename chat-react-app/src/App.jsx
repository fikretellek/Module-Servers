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
    console.log(newMessage);
    newMessage.from = document.getElementById("username").value;
    console.log(newMessage);
  }

  function setText() {
    fetch("https://module-servers.onrender.com/messages");
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
        <textarea
          name=""
          id="message-box"
          cols="30"
          rows="5"
          placeholder="type here"
          onSubmit={setText}
        ></textarea>
      </div>
    </>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import animationData from "../../resources/typing-animation.json";
import animationData1 from "../../resources/robot-says-hello.json";
import Lottie from "lottie-react";
import "./Chatbot.css";
import { X } from "react-feather";

const API_KEY = "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";
const systemMessage = {
  role: "system",
  content:
    "Act like you are an assistant of a hospitality site named Namaste Stays and reply as per the role in a sweet and polite manner, and sometimes try to be funny.",
};

const Chatbot = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: "Hello Sir! How may I help you?",
      role: "assistant",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const chats = document.getElementById("chatBox");
    if (chats) chats.scrollTop = chats.scrollHeight + 50;
  }, [messages]);

  const handleSend = async () => {
    if (!message) return;
    const newMessage = {
      content: message,
      role: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setIsTyping(true);
    setMessage("");

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      return { ...messageObject };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            content: data.choices[0].message.content,
            role: "assistant",
          },
        ]);
        setIsTyping(false);
      })
      .catch((error) => {
        console.log(error.message);
        setIsTyping(false);
        setMessages([
          ...chatMessages,
          {
            content: "Error Occured",
            role: "error",
          },
        ]);
      });
    setIsTyping(false);
  }

  return (
    <div className="chatbot">
      <div className="chatbot-icon">
        <button className="icon-button" onClick={() => setVisible(true)}>
          <Lottie
            id="iconButton"
            animationData={animationData1}
            loop={true}
            height={200}
            width={240}
          />
        </button>
      </div>
      {visible && (
        <div className="chatbox-overlay" onClick={() => setVisible(false)}>
          <div className="chatbox-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-icon" onClick={() => setVisible(false)}>
              <X />
            </span>

            <h3 className="chatbox-header">Helper</h3>
            <div className="messages" id="chatBox">
              {messages.map((item, i) => {
                return (
                  <div key={i} className={`message ${item.role}`}>
                    {item.role ==="error" ? <span>&#9888;&nbsp;</span> : "" }{item.content}
                  </div>
                );
              })}
              {isTyping && (
                <div className="typing-indicator">
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    height={50}
                    width={50}
                  />
                </div>
              )}
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

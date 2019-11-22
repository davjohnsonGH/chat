import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import socketIOClient from "socket.io-client";


const App = () => {

  const endpoint = "http://localhost:3000/"
  const socket = socketIOClient(endpoint);
  const [ handle, updateHandle ] = useState("");
  const [ chat, updateChat ] = useState("");
  const [ incomingChat, updateIncomingChat ] = useState({});
  const [ isTyping, updateIsTyping ] = useState({});




  useEffect( () => {

    socket.on("chat message", function(chat) {
      updateIncomingChat(chat);
    });       

    socket.on("user is typing", function(userIsTyping) {
      updateIsTyping(userIsTyping);
    });

  }, []);

  function updateChatFunction (value) {
    
    socket.emit("user is typing", {
      handle: handle.length > 0 ? handle : 'A user',
      typing: true
    });
    updateChat(value);
  }
  let typingTimer;  
  const doneTypingInterval = 2500;  

  function chatKeyUp () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);

  }

  function chatKeyDown () {
    clearTimeout(typingTimer);
  }
  function doneTyping () {
    socket.emit("user is typing", {
      handle: handle.length > 0 ? handle : 'A user',
      typing: false
    });
  }  

  function setChat(e) {
    e.preventDefault();

    const chatToSend = {
      msg: chat,
      handle: handle
    };

    socket.emit('chat message', chatToSend);
  }

  return (
    <div>
      { incomingChat && incomingChat.msg && incomingChat.msg.length > 0 ? incomingChat.handle + ": " + incomingChat.msg : "" }
      { isTyping && isTyping.typing ? isTyping.handle + ": " + "is typing" : "" }
      <div className="chat-wrapper">

        <form>
          <label htmlFor="handle-input"> 
            <input 
              id="handle-input" 
              type="text"
              value={ handle } 
              placeholder="Handle"
              onChange={e => updateHandle(e.target.value)}> 
            </input>
          </label>

          <label htmlFor="chat-input"> 
            <input 
              id="chat-input" 
              type="text"
              value={ chat } 
              placeholder="Chat"
              onChange={e => updateChatFunction(e.target.value)}
              onKeyDown={chatKeyDown}
              onKeyUp={chatKeyUp}> 
            </input>
          </label>
          <input type="submit" value="Send" onClick={ e => setChat(e) }/>  

        </form>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));

import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import socketIOClient from "socket.io-client";


const App = () => {

  const endpoint = "http://localhost:3000/"
  const socket = socketIOClient(endpoint, {transports: ['websocket']});
  const [ handle, updateHandle ] = useState("");
  const [ chat, updateChat ] = useState("");
  const [ incomingChat, updateIncomingChat ] = useState({});
  const [ isTyping, updateIsTyping ] = useState({});

  // incomingChat observer
  useEffect( () => {
    // append incoming chat to message list container in DOM
    if (incomingChat.msg && incomingChat.msg.length > 0 ) {

      const messageListElement = document.getElementById("messageListContainer");
      let addedClass = "";
  
      if (messageListElement.children.length % 2 !== 0) { addedClass = "darker"; }
      const messageElement = createMessageElement(incomingChat.msg, addedClass);
      messageListElement.appendChild(messageElement);      

    }

  }, [ incomingChat ]);

  function createMessageElement(msg, addedClass = "") {

    const para = document.createElement("p");
    const node = document.createTextNode(msg);
    para.appendChild(node);
    const div = document.createElement("div");
    div.className += "message-container " +  addedClass;
    div.appendChild(para);

    return div;

  }


  // init
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
      <div id="messageListContainer" className="message-list-container"></div>

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

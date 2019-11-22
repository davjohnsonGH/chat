import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import socketIOClient from "socket.io-client";


const App = () => {

  const endpoint = "http://localhost:3000/"
  const socket = socketIOClient(endpoint);
  const [ handle, updateHandle ] = useState("");
  const [ displayHandle, updateDisplayHandle ] = useState("");
  const [ chat, updateChat ] = useState("");
  const [ displayChat, updateDisplayChat ] = useState("");
  const [ incomingChat, updateIncomingChat ] = useState("");




  useEffect( () => {

    socket.on('chat message', function(msg){
      updateIncomingChat(msg)
    });       

  }, []);

  function setDisplayHandle(e) {
    e.preventDefault();
    updateDisplayHandle(handle);
  }
  function setChat(e) {
    e.preventDefault();
    updateDisplayChat(chat)
    socket.emit('chat message', chat);
  }

  return (
    <div>
      { incomingChat }
      <div className="chat-wrapper">
        { displayHandle.length > 0 ? "Hello " + displayHandle : "" }
        { displayChat.length > 0 ? "Chat: " + displayChat: "" }
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
          <input type="submit" value="Submit" onClick={ e => setDisplayHandle(e) }/>

          <label htmlFor="chat-input"> 
            <input 
              id="chat-input" 
              type="text"
              value={ chat } 
              placeholder="Chat"
              onChange={e => updateChat(e.target.value)}> 
            </input>
          </label>
          <input type="submit" value="Submit" onClick={ e => setChat(e) }/>  

        </form>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));

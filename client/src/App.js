import React, { useEffect } from "react";
import { render } from "react-dom";
import socketIOClient from "socket.io-client";


const App = () => {

  const endpoint = "http://localhost:3000/"
  const socket = socketIOClient(endpoint);


  useEffect( () => {

    socket.on("FromAPI", ( data ) => {
      console.log(data)
    });      

  }, [])


  return (
    <div>
      <h1>five minute react starter</h1>
    </div>
  );
};

render(<App />, document.getElementById("root"));
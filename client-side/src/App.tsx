import React, { useState, useEffect } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { io } from "socket.io-client";
import JoinedGame from "./joinedGame";
import SocketService from "./socketclient"
import history from './history';
import BoardGame from "./boardGame"
function App() {
  const connectSocket = async () => {
    const socket = await SocketService
      .connect("http://localhost:9000")
      .catch((err) => {
        console.log("Error: ", err);
      });
  };
  useEffect (()=>{
    connectSocket()
    history.push('/joinedGame');
  },[])
  return (
    <div className="App">
       <Router history={history}>
     <h1>tic tac tie </h1>
 <Route exact path="/joinedGame" component={JoinedGame} />
 <Route exact path="/game" component={BoardGame} />
 </Router>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import socketService from "./socketclient";
import history from './history';
function JoinedGame() {
    const [nameGame, setNameGame] = useState("");
    const [createGame, setCreateGame] = useState("");
    const [joinGame, setJoinGame] = useState("");

    
    const handleNameChange = (e: React.ChangeEvent<any>) => {
        const value = e.target.value;
        setNameGame(value);
    };
    const handleJoinedGame =async () => {
        let socket = socketService.socket
        let onresponseJoinedGame=socketService.onresponseJoinedGame
        
        if(socket ){
            try {
             await   socket.emit("join_game", { "nameGame":nameGame });
              if(!onresponseJoinedGame){
             socketService.changeonresponseJoinedGame()
             socket.on('responseJoined_game', responed => {
                if(responed.joinedGame){
                    socketService.changeCurrentPlayer("o")
                    socketService.changeNameGame(nameGame)
                    history.push('/game');
                setJoinGame("you joines the game")}
                else
                setJoinGame("there is no game with this name or it is full")
               })}
              } catch (error) {
                console.error(error);
             
              }
        
    }
    }
    const handleCreatingGame =async () => {
        let socket = socketService.socket
        let onresponseCreateGame=socketService.onresponseCreateGame
        if(socket ){
       
            try {
             await   socket.emit("createAgame", { "nameGame":nameGame });
             if(!onresponseCreateGame){
                socketService.changeonseCreateGame()
             socket.on('responseCreate_game', responed => { 
              if(responed.createGame){
              setCreateGame("A new game is created")
              if(socket ){

              socket.on('player2Joined', () => {
                  socketService.changeNameGame(nameGame)
                socketService.changeCurrentPlayer("x")
                history.push('/game');
              })
              }
            }
              else
              setCreateGame("There's a game with that name")
             })
                }
              } catch (error) {
                console.error(error);
                
              }
    }
}

    return (
        <div>
             <p>Create a new game</p>
            <input type="text" onChange={handleNameChange} />
            <button onClick={ handleCreatingGame}>
            Create a new game
            </button>
            <p>{createGame}</p>
            <p>Join game</p>
            <input type="text" onChange={handleNameChange} />
            <button onClick={ handleJoinedGame}>
            Join game
            </button>
            <p>{joinGame}</p>
        </div>
    );
}
export default JoinedGame;
import React, { useState, useEffect } from 'react';
import socketService from "./socketclient";
function BoardGame() {
    const [updating, setUpdating] = useState("");
    const [myTurn, setMyTurn] = useState(false);
    const [status, setStatus] = useState("");
    const [table,setTable]=useState(["","","","","","","","",""]);
    const [endGame,setEndGame] = useState(false);
    
const styleTd= {
    "fontFamily": "Permanent Marker",
    "width": "100px",
    "height": "100px",
    "boxshadow": "2px 2px 2px 2px #ecd7ba",
    "border": "2px solid #ecd7ba",
    "cursor": "pointer",
  "lineheight": "100px",
    "fontSize": "60px",
}
const styleTable= {
    "marginLeft": "37%",
    "alignContent": "center"
}
    useEffect(() => {
        if(socketService.currentPlayer =="x")
        setMyTurn(true)
    },[]);
    useEffect(() => {
        let socket = socketService.socket
        if(!socket)
        return;
        socket.on('endGame', result => {//Listening if the game is over
            setEndGame(true)
          if(result===socketService.currentPlayer )
           return  setStatus("you win!")
          if(result==="x"||result==="o")
           return setStatus("you lose!")
          if(result=="tie")
           return  setStatus("its tie")
           console.log("end game")
        })
        
        socket.on('otherplayerMove', data => {//Listing the other player move
            if(data.currentPlayer ===socketService.currentPlayer )
            return;
            setMyTurn(true)
            let tempTable=table

            let sighnIftheOtherplayer
            if(socketService.currentPlayer ==="x")
             sighnIftheOtherplayer="o"
            else
             sighnIftheOtherplayer="x"
            tempTable[data.boxId]=sighnIftheOtherplayer 
            setTable(tempTable)
            setUpdating(data.boxId)
        })
       
    },[]);
    const nextMove =async (e: React.ChangeEvent<any>)=>{//the player made move its emit to the server the move
        if(!myTurn||endGame)
        return;
        setMyTurn(false)
        let boxId= parseInt(e.target.id)
        let socket = socketService.socket
        let tempTable=table
        if(table[boxId]!=="")
        return;
        tempTable[boxId]=socketService.currentPlayer 
        setTable(tempTable)
        setUpdating(e.target.id)
        try {
            if(!socket) 
           return;
            await  socket.emit("myMove", { 
                "boxId":boxId ,
                "nameGame":socketService.nameGame,
                "currentPlayer":socketService.currentPlayer });
             } catch (error) {
               console.error(error);
            
             }
    }
   
   
   
    return (
        <div >
<div style={styleTable}>
             <table  >
              <tbody>
        <tr>
            <td id="0" style={styleTd}  onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[0]}</td>
            <td id="1" style={styleTd}  onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[1]}</td>
            <td id="2" style={styleTd}  onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[2]}</td>
        </tr>
        <tr>
            <td id="3" style={styleTd} onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[3]}</td>
            <td id="4" style={styleTd} onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[4]}</td>
            <td id="5" style={styleTd} onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[5]}</td>
        </tr>
        <tr>
            <td id="6" style={styleTd} onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[6]}</td>
            <td id="7" style={styleTd} onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[7]}</td>
            <td id="8" style={styleTd} onClick={(e: React.ChangeEvent<any>)=>nextMove(e)}>{table[8]}</td>
        </tr>
        </tbody>
    </table>
    </div>
    <h1>{ status}</h1>
    <div>{(myTurn&&!endGame) && <h1>you turn</h1>}</div>

        </div>
    );
}
export default BoardGame;
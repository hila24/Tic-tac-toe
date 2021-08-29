
function turnOnSocketIo (io){
let roomsOfGames ={}
let game ={player1:"",player2:"",cubesPlayer1:[],cubesPlayer2:[]}
io.on('connection', client => {
    console.log("someone log in",client.id)
    client.on('createAgame', data => { //Listens to a player create the game
  let createAgame =false
     if(! Object.keys(roomsOfGames).includes(data.nameGame) ){
       roomsOfGames[data.nameGame]={player1:"",player2:"",cubesPlayer1:[],cubesPlayer2:[]}
       roomsOfGames[data.nameGame]["player1"]=client.id
       createAgame=true;
      }
    io.emit("responseCreate_game", { "createGame": createAgame });
     });
  
    client.on('join_game', data => { //Listens to a player join the game
      let joinAgame=false
      if( Object.keys(roomsOfGames).includes(data.nameGame) ){
        if(roomsOfGames[data.nameGame]["player1"]!=client.id&&roomsOfGames[data.nameGame]["player2"]==""){
        roomsOfGames[data.nameGame]["player2"]=client.id
        joinAgame=true
        io.to(roomsOfGames[data.nameGame]["player1"]).emit('player2Joined');
      }    
     }
  
        io.emit("responseJoined_game", { "joinedGame": joinAgame });
      
     });
     client.on('myMove', (data) => {//Listens when a player makes a move
       let currentPlayerCubes ="cubesPlayer2"
       let toWhoSend ="player1"
       if (data.currentPlayer=="x"){
       currentPlayerCubes="cubesPlayer1"
       toWhoSend="player2"
      }
      roomsOfGames[data.nameGame][currentPlayerCubes].push(data.boxId)
      let resultOfGame=tictactie(roomsOfGames[data.nameGame]["cubesPlayer1"],roomsOfGames[data.nameGame]["cubesPlayer2"])
      if(resultOfGame!==""){
        io.to(roomsOfGames[data.nameGame]["player1"]).emit("endGame",resultOfGame)
        io.to(roomsOfGames[data.nameGame]["player2"]).emit("endGame",resultOfGame)
      } 
      io.to(roomsOfGames[data.nameGame][toWhoSend]).emit('otherplayerMove',{"boxId":data.boxId,"currentPlayer":data.currentPlayer});
      });
      

    client.on('disconnect', (client) => { 

        console.log("someone log out",client)
     });
  });
}
  function tictactie(cubesPlayer1,cubesPlayer2) {//checking if someone win and in case return who win or tie
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  for(let i=0;i<winningConditions.length;i++){
  if(  winningConditions[i].every(v => cubesPlayer1.includes(v))){
  return "x"}
  if(  winningConditions[i].every(v => cubesPlayer2.includes(v)))
  return "o"
  }
  if(cubesPlayer1.length+cubesPlayer2.length===9)
  return "tie"
  
  return ""
  }











module.exports = turnOnSocketIo;

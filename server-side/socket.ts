// import { useSocketServer } from "socket-controllers"
// import {Server} from "socket.io"
var useSocketServer = require("socket-controllers");
var Server = require('socket.io')(Server);
var creatingServerSocket= (httpServer) => {
const io= new Server (httpServer,{
    cors: {origin :"*"}
})
// useSocketServer(io,{controllers:[__dirname + "/api/controllers/*.ts"]})
io.on('connection', socket => {
    console.log("a new connect:" ,socket.id)
//   socket.emit('request', /* … */); // emit an event to the socket
//   io.emit('broadcast', /* … */); // emit an event to all connected sockets
//   socket.on('reply', () => { /* … */ }); // listen to the event
});
return io
}

module.exports = creatingServerSocket;
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

class SocketService {
  public socket: Socket | null = null;
  public nameGame: "" | string = "";
  public onresponseJoinedGame: true|false=false;
  public onresponseCreateGame: true|false=false;
  public currentPlayer  : "x"|"o"="x"
  public changeCurrentPlayer  (player:"x" | "o"){
    this.currentPlayer =player
  }
  public changeNameGame (nameGame:string  ){
this.nameGame=nameGame

  }
  public changeonresponseJoinedGame(){
     this.onresponseJoinedGame = true

  } 
  public changeonseCreateGame(){
    this.onresponseCreateGame = true

 } 
  public connect(
    url: string
  ): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
    return new Promise((rs, rj) => {
      this.socket = io(url);

      if (!this.socket) return rj();

      this.socket.on("connect", () => {
        rs(this.socket as Socket);
      });

      this.socket.on("connect_error", (err) => {
        console.log("Connection error: ", err);
        rj(err);
      });
    });
  }
}

export default new SocketService();
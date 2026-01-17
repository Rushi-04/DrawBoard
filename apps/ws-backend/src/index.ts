import { WebSocket, WebSocketServer } from "ws";


const wss = new WebSocketServer({port: 8080});

wss.on("connection", (socket) => {
    console.log("WS Connected");

    socket.on("message", (message)=>{
        const realmsg = message.toString();
        socket.send(realmsg);
    })  
})
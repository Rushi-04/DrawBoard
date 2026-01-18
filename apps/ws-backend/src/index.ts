import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import { string } from "zod";


const wss = new WebSocketServer({port: 8080});

wss.on("connection", (socket, request) => {
    const url = request.url; // -->  ws://localhost:3000?token=adegwiqewjfwbqhdwjq

    if(!url) return ;
    
    const queryParams = new URLSearchParams(url?.split("?")[1])
    const token = queryParams.get("token") || "";

    const decoded = jwt.verify(token, JWT_SECRET)

    if(typeof decoded == "string"){
        socket.close();
        return ;
    }

    if(!decoded || !decoded.userId){
        socket.close();
        return ;
    }

    socket.on("message", (message)=>{
        const realmsg = message.toString();
        socket.send(realmsg);
    })  
})
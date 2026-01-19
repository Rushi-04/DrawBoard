import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db";


const wss = new WebSocketServer({port: 8080});

interface Room {
    roomId: number,
    socket: WebSocket
}

let allRooms: Room[] = [];

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

    // -----------------

/*
{
    type: "join",
    payload: {
        room: "1221"
    }
}

{
    type: "chat",
    payload: {
        message: "Hi there"
    }
}

*/


    socket.on("message", async (message) => {
        const data = JSON.parse(message as unknown as string);
        
        if(!data) return 

        if(data.type == "join"){
            allRooms.push({
                roomId: data.payload.room,
                socket: socket
            });
        }

        if(data.type == "chat"){
            const currentUserRoom = allRooms.find((room) => room.socket == socket)?.roomId;

            allRooms.forEach(async (room) => {
                if(room.roomId == currentUserRoom){
                    room.socket.send(data.payload.message);
                    await prisma.message.create({
                        data: {
                            content: data.payload.message,
                            userId: decoded.userId,
                            roomId: room.roomId 
                        }
                    })
                }
            })
        }
    socket.on("error", () => {
        console.error("Error Ocurred.")
    });

    socket.on("close", () => {
        allRooms = allRooms.filter((room) => room.socket != socket);
    });

    })
})
import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db";


const wss = new WebSocketServer({port: 8080});

// interface Room {
//     roomId: number,
//     socket: WebSocket
// }

interface User {
    userId: string,
    rooms: string[],
    ws: WebSocket
}

const users: User[] = [];

const checkUser = (token: string) => {
    try{
        const decoded = jwt.verify(token, JWT_SECRET)

        if(typeof decoded == "string"){
            return null;
        }

        if(!decoded || !decoded.userId){
            return null;
        }

        return decoded.userId;
    }catch(e){
        return null;
    }
    return null;
}

wss.on("connection", (socket, request) => {
    const url = request.url; // -->  ws://localhost:3000?token=adegwiqewjfwbqhdwjq

    if(!url) return ;
    
    const queryParams = new URLSearchParams(url?.split("?")[1])
    const token = queryParams.get("token") || "";

    const userId = checkUser(token);

    if(userId == null){
        socket.close();
        return null;
    }
    
    users.push({
        userId: userId,
        rooms: [],
        ws: socket
    })

    // ----------------- 3

/*
{
    type: "join_room",
    payload: {
        roomId: "1221"
    }
}

{
    type: "leave_room",
    payload: {
        roomId: "1221"
    }
}

{
    type: "chat",
    payload: {
        message: "Hi there",
        roomId: "21213"
    }
}

*/

    // message handler
    socket.on("message", async (message) => {
        const data = JSON.parse(message as unknown as string);
        
        if(!data) return 

        // Handle join room event
        if(data.type == "join_room"){
            const currentUser = users.find(user => user.ws === socket);
            currentUser?.rooms.push(data.payload.roomId);
        }

        // Handle leave room event
        if(data.type == "leave_room"){
            const currentUser = users.find(user => user.ws === socket);

            if(!currentUser) return;

            currentUser.rooms = currentUser?.rooms.filter(room => room !== data.payload.roomId);
        }

        // Handle chat event
        if(data.type == "chat"){
            // const currentUser = users.find(user => user.ws == socket);
            const roomId = data.payload.roomId;
            const msg = data.payload.message;

            await prisma.message.create({
                        data: {
                            content: msg,
                            userId: userId,
                            roomId: roomId
                        }
                    })

            users.forEach((user) => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            message: msg,
                            roomId
                        }
                    }));
                    // await prisma.message.create({
                    //     data: {
                    //         content: msg,
                    //         userId: userId,
                    //         roomId: roomId
                    //     }
                    // })
                }
            })
        }
    
    // Error Handler
    socket.on("error", () => {
        console.error("Error Ocurred.");
    });

    // socket.on("close", () => {
    //     users = allRooms.filter((room) => room.socket != socket);
    // });

    })
})
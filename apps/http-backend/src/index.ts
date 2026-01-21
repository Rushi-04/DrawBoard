import express from "express";
import { prisma } from "@repo/db";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types"


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        msg: "Hello from http backend,"
    });
});

app.post('/signup', async (req, res) => {

    // const requiredBody = CreateUserSchema;
    // const parsedBody = requiredBody.safeParse(req.body);
    
    const parsedBody = CreateUserSchema.safeParse(req.body);

    if(!parsedBody.success)
    {   
        return res.status(301).json({
            message: "Invalid format"
        })
    }

    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 6) 
    

    // save to db  
    try{
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email
            }
        });

        return res.status(200).json({
            mgs: "User created successfully",
            user: user
        });
    }catch(e){
        return res.status(409).json({
            mgs: "Already Exists",
            error: e
        })
    }

});

app.post('/signin', async(req, res) => {

    const data = SignInSchema.safeParse(req.body);

    if(!data.success) {
        return res.status(301).json({
            msg: "Invalid format"
        })
    }

    const {username, password} = req.body;


    const user = await prisma.user.findFirst({
        where: {
            username: username
        }})    

    if(!user) {
        res.status(403).json({
            msg: "Not Authorized",
        });
        return;
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if(!passwordMatched) return 

    const token = jwt.sign({ userId: user.id}, JWT_SECRET); 

    return res.status(200).json({
        msg: "User signedIn",
        token: token
    })
});

app.post('/room', authMiddleware, async(req, res) => {

    const parsedData = CreateRoomSchema.safeParse(req.body);

    if(!parsedData.success) {
        return res.status(301).json({
            msg: "Invalid format"
        })
    } 

    const userId = req.userId;

    try{
        const room = await prisma.room.create({
            data: {
                slug: parsedData.data.room,
                adminId: Number(userId)
            }
        })
        return res.status(200).json({
            msg: "Room created successfully",
            roomId: room.id
        });
    }catch(e){
        return res.status(403).json({
            msg: "Room not created, already exists with this name.",
            error: e
        })
    }
});


app.listen(3001, () => {
    console.log("Running on port 3001...");
});

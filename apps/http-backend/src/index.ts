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
                username: username,
                password: hashedPassword,
                email: email,
            }
        })

        if(!user) return

        return res.status(200).json({
            mgs: "user created successfully",
            user: user
        })
    }catch(e){
        return res.status(501).json({
            mgs: "Error Occured",
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


    const user = await prisma.user.findOne({
        data: {
            username: username
        }})    

    if(!user) return 

    const passwordMatched = await bcrypt.compare(password, user.password);

    if(!passwordMatched) return 

    const token = jwt.sign({ userId: user.id}, JWT_SECRET); 

    return res.status(200).json({
        msg: "User signedIn",
        token: token
    })
});

app.get('/room', authMiddleware, (req, res) => {

    const data = CreateRoomSchema.safeParse(req.body);

    if(!data.success) {
        return res.status(301).json({
            msg: "Invalid format"
        })
    }

    return res.json({
        roomId: 123
    });
});





app.listen(3001, () => {
    console.log("Running on port 3002...");
});

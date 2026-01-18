import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import {JWT_SECRET} from "./config";


export default function authMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers["authorization"];

    if(!token){
        return res.status(404).json({
            mgs: "Token missing"
        })
    }

    const decodedInfo = jwt.verify(token, JWT_SECRET);

    if(decodedInfo){
        req.userId = (decodedInfo as JwtPayload).userId;
        next();
    }else{
        res.status(403).json({
            msg: "Unauthorized"
        })
    }

}
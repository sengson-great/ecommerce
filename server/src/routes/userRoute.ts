//import express from "express";
import userModel, { IUser } from "../model/userModel";
import { userErrors } from "./errors";
import { Request, Response, Router,NextFunction} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router=Router();

router.post('/register',async (req: Request<{},{},IUser>,res: Response)=> {
    const {username, password} = req.body as { username: string; password: string };
    try{
    const user = await userModel.findOne({username});
    if(user){
        return res.status(400).json({type: userErrors.UserAlreadyExists});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new userModel({username, password:hashedPassword});
    await newUser.save();
    res.json({message:"New user created successfully."});
    }catch(error){
        console.error(error);
        res.status(500).json({type:error});
    }
});
router.post('/login',async (req: Request<{},{},IUser>,res:Response)=>{
    try{
        const {username,password}=req.body;
        const user = await userModel.findOne({username});
        if(!user){
            return res.status(400).json({type:userErrors.USER_NOT_FOUND});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({type:userErrors.WRONG_CREDENTIAL});
        }
        const token=jwt.sign({id:user._id,},"secret");
        res.json({token,userId:user._id});
    }catch(error){
        console.error(error);
        res.status(500).json({type:error});
    }
})
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.sendStatus(403); 
            }
            req.body.userId = (decoded as { id: string }).id; 
            next();
        });
    } else {
        res.sendStatus(401); 
    }
};
export default router;
import jwt from "jsonwebtoken";
import { getUserById } from "../helpers.js";

const isAuthenticated=async(req,res,next)=>{

    let token;
    
    if(req.headers){
        try{
            token=await req.headers["x-auth-token"]
            console.log(token)
            if(!token){
                return res.status(400).json({error:"invalid authorization"})
            }
            const decode=jwt.verify(token,process.env.secret_key)
            console.log(decode.id)
            req.user=await getUserById(decode.id)

            next()

        }catch(err){
            console.log(err)
res.status(500).json({error:"server error"})
        }
    }
    
}

export {isAuthenticated}
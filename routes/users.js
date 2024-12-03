import express from "express";
const router=express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {genPassword,createUser,getUserByEmail,getAllUser} from "../helpers.js";
import { auth } from "../middleware/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
router.post("/signup",async(req,res)=>{
    const {username,password,email,country,street,city,state,postalCode}=req.body;
    console.log(req.body)
    const isUserExist=await getUserByEmail(email)
    console.log("User exists:", isUserExist);
    if(isUserExist){
        res.status(400).send({error:"user already exists"})
        return
    }
    if(!/^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[!@#$%^&*()]).{8,}$/g.test(password)){
        res.status(400).send({error:"password doesnt match"})
        return
    }

    const hashedPassword=await genPassword(password)
    const result=await createUser(username,hashedPassword,email,country,street,city,state,postalCode)
    res.status(201).json({message:"successfully created"})
    res.send(result)
})


router.post("/login" ,  async(req,res)=>{
    const {email,password}=req.body;
    const userFromDb=await getUserByEmail(email)
    if(!userFromDb){
        res.status(400).send({message:"invalid credentials"})
        return
    }
    const storedDbPassword=userFromDb.password;
    const isPasswordMatch=await bcrypt.compare(password,storedDbPassword)
    if(!isPasswordMatch){
        res.status(400).send({message:"invalid credentials"})
        return
    }
    const token=jwt.sign({id:userFromDb._id, role: userFromDb.role},process.env.secret_key,{ expiresIn: "1h" })
    res.send({message:"login successful",token:token})


})

router.get("/get-users",verifyToken,authorizeRole( "admin" ),async(req,res)=>{
    const result=await getAllUser()
    res.send(result)
})

router.get("/address",async(req,res)=>{
    try{
const address=await getUserAddress(req)
if(!address){
    return res.status(404).json({error:"no address available"})

}
res.status(200).json({data:address})
    }catch(err){
        console.log(err)
        res.status(500).json({error:"server error"})
    }
})

export const usersRouter=router
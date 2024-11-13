import express from "express";
const router=express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {genPassword,createUser,getUserByName,getAllUser} from "../helpers.js";
import { auth } from "../middleware/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
router.post("/signup",async(req,res)=>{
    const {username,password}=req.body;
    console.log(req.body)
    const isUserExist=await getUserByName(username)
    console.log("User exists:", isUserExist);
    if(isUserExist){
        res.status(400).send({error:"username already exists"})
        return
    }
    if(!/^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[!@#$%^&*()]).{8,}$/g.test(password)){
        res.status(400).send({error:"password doesnt match"})
        return
    }

    const hashedPassword=await genPassword(password)
    const result=await createUser(username,hashedPassword)
    res.status(201).json({message:"successfully created"})
    res.send(result)
})


router.post("/login" ,  async(req,res)=>{
    const {username,password}=req.body;
    const userFromDb=await getUserByName(username)
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



export const usersRouter=router
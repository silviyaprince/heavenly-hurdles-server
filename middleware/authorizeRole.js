export const authorizeRole=(...role)=>{
return (req,res,next)=>{
    console.log("User roles:", req.user)
    if(!role.includes(req.user.role)){
        return res.status(403).json({message:"access denied"})
    }
   
    next();
}
}



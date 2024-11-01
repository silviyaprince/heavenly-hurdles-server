export const requireRole = (requiredRole) => (req, res, next) => {
    try{
        const token=req.header("x-auth-token");
        const decoded=jwt.verify(token,process.env.secret_key)
        if(decoded.role!==requiredRole){
            return res.status(403).send({message:"Access denied"});
        }
        req.user=decoded;
        next();
    }catch(err){
        res.status(401).send({message:"invalid token"})
    }
    
};
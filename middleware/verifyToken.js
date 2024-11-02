import jwt from "jsonwebtoken";
// export const verifyToken = (req, res, next) => {
//     let token;
//     let authHeader = req.headers.Authorization || req.headers.auth
//     if (authHeader && authHeader.startsWith ("Bearer"))
//     {
//     token = authHeader.split(" ")[1];
//     if (!token) {
        
//         return res.status (401).json({  message: "No token, authorization denied" })
//     }
// }
// try {
// const decode = jwt.verify (token, process.env.secret_key) ;
// req.user = decode;
// console.log ("The decoded user is : ", req.user);
// }
// catch (err) {
// res.status(400).json({ message: "Token is not valid" });
// }
// }

export const verifyToken = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.auth;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = decoded;
        console.log("The decoded user is:", req.user);
        next();
    } catch (err) {
        res.status(400).json({ message: "Token is not valid" });
    }
};

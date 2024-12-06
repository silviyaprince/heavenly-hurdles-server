import jwt from"jsonwebtoken";

export const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.secret_key); // Replace with your secret
      req.user = decoded;
      console.log(req.user) // Store the decoded user info in the request
      next();
    } catch (err) {
      return res.status(403).json({ error: 'Invalid Token' });
    }
  };
  

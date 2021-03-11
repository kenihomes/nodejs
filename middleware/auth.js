const jwt = require("jsonwebtoken");
require('dotenv').config()

// this middleware is responsible for  verify jwt token
function auth (req,res,next){
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('access denied . no token provided')
    try{console.log("token hear")
        const decoded = jwt.verify(token,process.env.jwtprivatekey,{ignoreExpiration: false});
        req.user = decoded
        next();
    }
    catch(err){
        res.status(400).send('invalid token.' + err.message)
    }
}

module.exports = auth;

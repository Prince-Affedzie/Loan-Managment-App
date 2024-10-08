const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const userAccessAuth = (req, res, next) =>{
  const token = req.cookies.token || req.headers['authorization'];
  if(!token){
    return res.status(401).json({message:'No token provided'})
  }
  try{
    const decoded=  jwt.verify(token,process.env.JWT_SECRET);
   
    req.user = decoded
     next();
  }catch(err){
    console.log(err)
    res.status(401).json({message:'Invalid token',err})
  }
}

module.exports = userAccessAuth;
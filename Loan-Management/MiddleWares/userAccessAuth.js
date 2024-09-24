const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser())

const userAccessAuth = (req, res, next) =>{
  const token = req.cookies.token;
  console.log(token)
  if(!token){
    return res.status(401).json({message:'No token provided'})
  }
  try{
    const decoded=  jwt.verify(token,process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    req.user = decoded
     next();
  }catch(err){
    console.log(err)
    res.status(401).json({message:'Invalid token',err})
  }
}

module.exports = userAccessAuth;
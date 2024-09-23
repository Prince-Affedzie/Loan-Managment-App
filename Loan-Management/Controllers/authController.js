const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
// for borrowers
const loginUser = async(req,res)=>{
  try{
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(400).json({message:'Please provide email and password'})
  }
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({message:'Invalid email or password'})
  }
  const isPasswordMatch = await bcrypt.compare(password,user.password);
  if(!isPasswordMatch){
    return res.status(400).json({message:'Invalid email or password'})
  }
    
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token',token,{httpOnly:true,secure:true,sameSite:'strict'})
    res.status(200).json({message:'Login successful',user})
   
  }catch(err){
    console.log(err)
    res.status(500).json({message:'Internal server error'})
  }
}
// for borrowers
const registerUser = async(req,res)=>{
  try{
    const {name,email,password,phoneNumber} = req.body;
    if(!name || !email || !password || !phoneNumber){
      return res.status(400).json({message:'Please provide all the fields'})
    }
    if(!validator.isEmail(email)){
      return res.status(400).json({message:'Please provide a valid email'})
    }
    if(password.length < 8){
      return res.status(400).json({message:'Password must be at least 8 characters long'})
    }
    const user = await User.findOne({email});
    if(user){
      return res.status(400).json({message:'Email already exists'})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({name,email,password:hashedPassword,phoneNumber});
    const savedUser = await newUser.save();
    
    const token = jwt.sign({id:savedUser._id,phoneNumber:savedUser.phoneNumber},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token',token,{httpOnly:true,secure:true,sameSite:'strict'})
    res.status(201).json({message:'User registered successfully',token})
    console.log(savedUser)
    //res.status(200).redirect('/dashboard')
  }catch(err){
    console.log(err)
    res.status(500).json({message:'Internal server error'})
  }
}
// for borrowers
const completeProfile = async (req, res) => {
  const { country, employmentStatus, income, idType, idNumber,  address,
    dob,nextOfKin,nextOfKinPhoneNumber,relationWithNextOfKin
   } = req.body;

  try {
    // Update user profile in the database
    await User.findByIdAndUpdate(req.user.id, {
      country: country,
      employmentStatus:employmentStatus,
      MonthlyIncome: income,
      IdentificationType:idType,
      IDNumber:idNumber, 
      ResidentialAddress:address,
      DateOfBirth:dob,
      nextOfKin:nextOfKin,
      nextOfKinPhoneNumber:nextOfKinPhoneNumber,
      relationWithNextOfKin:relationWithNextOfKin
    });

    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }}
//for borrowers
const logoutUser = (req,res)=>{
  res.clearCookie('token');
  res.status(200).json({message:'User logged out successfully'})
 // res.status(200).redirect('/login')
}

// for Admin Login
const loginAdmin = async(req,res)=>{
  try{
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(400).json({message:'Please provide email and password'})
  }
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({message:'Invalid email or password'})
  }
  const isPasswordMatch = await bcrypt.compare(password,user.password);
  if(!isPasswordMatch){
    return res.status(400).json({message:'Invalid email or password'})
  }
  if(user.role !== 'admin'){
    return res.status(401).json({message:'Access denied'})
  }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token',token,{httpOnly:true,secure:false,sameSite:'strict'})
    res.status(200).json({message:'Login successful',user})
   console.log(user)
  }catch(err){
    console.log(err)
    res.status(500).json({message:'Internal server error'})
  }
}

module.exports = {loginUser,registerUser,completeProfile,loginAdmin ,logoutUser}
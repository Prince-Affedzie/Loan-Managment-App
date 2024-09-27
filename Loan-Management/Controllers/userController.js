const User = require('../Models/userModel')
const Loan = require('../Models/loanModel')
const validator = require('validator')
const bcrypt = require('bcrypt')

//

//for Admin Use Only
const getUsers = async(req,res)=>{
    try{
        const users = await User.find().sort('name')
        if(!users){
            return res.status(200).send('No users Found')
        }

        res.status(200).json(users)



    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}
// For Admin use only
const removeUser = async(req,res)=>{
    const {userId} = req.body
    try{
        await User.findByIdAndDelete(userId)
        res.status(200).json({message: ' User Removed Successfully'})

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }

}
// for all users
const userProfile =async(req,res)=>{
     const userId = req.user.id
    try{
        const user = await User.findById(userId)
        if(!user){
            return res.status(200).send('No users Found')
        }

        res.status(200).json(user)



    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

// for admins to Add Users
const addUser = async(req,res)=>{
    try{
      const {name,email,password,phoneNumber,role} = req.body;
      if(!name || !email || !password || !phoneNumber ||!role){
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
      const newUser = new User({name,email,password:hashedPassword,phoneNumber,role});
      const savedUser = await newUser.save();
      
      
      res.status(201).json({message:'User Added successfully'})
      console.log(savedUser)
      //res.status(200).redirect('/dashboard')
    }catch(err){
      console.log(err)
      res.status(500).json({message:'Internal server error'})
    }
  }

  const updateUser = async(req,res)=>{
    const {userId} = req.params
   
    try{
      const user =await User.findById(userId)
        if(!user){
            return res.status(200).send('No User Found')
        }
        res.status(200).json(user)



    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
  }

  const updateUserInfo = async(req,res)=>{
    const {userId} = req.params
    console.log(req.body);
   
    try{
        await User.findByIdAndUpdate(userId, req.body, { new: true })
        res.status(200).json({message:"User Updated Successfully"})



    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
  }

  const userDetails = async(req,res)=>{
    const {userId } =req.params 
    try{
     const user = await User.findById(userId).populate({
      path:'loan',
      select: 'loanNumber borrower balance dueDate',
      populate:{
        path:'repaymentSchedule'
         }
    })
    console.log(user)
    res.status(200).json(user)
  
  
    }catch(err){
      res.status(500).send('Internal server Error')
      console.log(err)
    }
  }
module.exports = {getUsers,removeUser,userProfile,addUser,updateUser, updateUserInfo,userDetails}
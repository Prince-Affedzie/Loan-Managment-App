const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  phoneNumber:{
    type:String,
    required:true
  },
  country:{
     type:String,
     required:false
  },
  employmentStatus:{
    type:String,
    required:false
  },
  MonthlyIncome:{
    type:Number,
    required:false
  },
  IdentificationType:{
      type:String,
      required:false
  },
  IDNumber:{
       type:String,
       required:false
  }, 
  ResidentialAddress:{
     type:String,
     required:false
  },
  DateOfBirth:{
    type:String,
    required:false
  },
  nextOfKin:{
    type:String,
    required:false
  },
  nextOfKinPhoneNumber:{
      type:String,
      required:false
  },
  relationWithNextOfKin:{
      type:String,
      required:false
  }, 
  role:{
    type:String,
    enum:['admin','user'],
    default:'user',
    required:true
  },
  loan:[{
    type:Schema.Types.ObjectId,
    ref:'Loan'
  }]
});

const User = mongoose.model('User', userSchema);
module.exports = User
 
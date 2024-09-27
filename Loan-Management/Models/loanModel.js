const mongoose = require('mongoose');
const { Duplex } = require('stream');
const Schema = mongoose.Schema;
const loanSchema = new Schema({
  borrower:{
   type:Schema.Types.ObjectId,
    ref:'User'
  },
  
  loanAmount:{
    type:Number,
    required:true
  },
  interestRate:{
    type:Number,
    required:true
  },
  purpose :{
    type:String,
    required:true
  },
 durationMonths:{
   type:Number,
     required:true
 },
 startPaymentDate:{
  type:Date,
  required:true
 },
 dueDate:{
   type:Date,
   required:true
 },
  status:{
    type:String,
    enum:['pending','approved','rejected','fully paid'],
    default:'pending'
  },
  approvedBy:{
    type:String,
    ref:'User'
  },
  approvedDate:{
    type:Date,
    default:Date.now
  },
  repaymentSchedule:{
    type:Schema.Types.ObjectId,
    ref:'RepaymentSchedule',
    
  },
  balance:{
    type:Number,
    
  },
  createdDate:{
    type:Date,
    default:Date.now
  }
    
})

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;
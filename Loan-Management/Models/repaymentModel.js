const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repaymentSchema = new Schema({
  loanId: {
    type: Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  amountPaid:{
    type:Number,
    required:true
  },
  paymentDate:{
    type:Date,
    required:true
    
  },
  paymentMethod:{
     type:String,
     required:true
  },
  dueDate:{
    type:Date,
    required:false
  },
  status:{
    type:String,
    enum:['pending','paid'],
    default:'pending'
  }
})

const Repayment = mongoose.model('repayment', repaymentSchema);
module.exports = Repayment;
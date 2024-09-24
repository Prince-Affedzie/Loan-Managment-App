const mongoose = require("mongoose");
const Loan = require("../Models/loanModel");
const Repayment = require("../Models/repaymentModel");
const User = require("../Models/userModel");
const jwt = require('jsonwebtoken')
//const sendSms = require('../MiddleWares/smsService')


const dashboard = async(req,res)=>{
  
  try{
    //const user = jwt.verify(token,process.env.JWT_SECFRET)
   const user = req.user
    const findUser= await User.findById(user.id).populate('loan')
    if(!findUser){
      console.log('Could not find user')
      return res.status(404).json({message:'Could not find user'})
    }
    res.status(200).json(findUser)
    console.log(findUser)


  }catch(err){
    res.status(500).send('Internal Server Error')
    console.log(err)
  }
}

const applyForLoan = async (req, res) => {
  try {
    const { loanAmount, interestRate, durationMonths,startPaymentDate,dueDate,purpose } = req.body;
    if (!loanAmount || !interestRate || !durationMonths || !startPaymentDate 
       || !purpose ||!dueDate  ) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }
    const borrower = req.user.id;
    const loan = new Loan({
      borrower,
      loanAmount,
      interestRate,
      durationMonths,
      startPaymentDate,
      dueDate,
      balance:loanAmount,
      purpose
    });
    const savedLoan = await loan.save();
    const userPhoneNumber = req.user.phoneNumber
    sendSms( userPhoneNumber,'Your Loan Application has been submitted Succesfully')
    res.status(201).json({ message: "Loan applied successfully", savedLoan });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveLoan = async (req, res) => {
  
  try {
    const { loanId,status } = req.body;
    if (!loanId) {
      return res.status(400).json({ message: "Please no loan found " });
    }
    const loan = await Loan.findByIdAndUpdate(loanId,{status});
    if (!loan) {
      return res.status(400).json({ message: "Loan not found" });
    }
    
    res
      .status(200)
      .json({ message: "Loan approved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectLoan = async (req, res) => {
  try {
    const { loanId,status } = req.body;
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(400).json({ message: "Loan not found" });
    }
    if (loan.status === "rejected") {
      return res.status(400).json({ message: "Loan already rejected" });
    }
    loan.status = status;
    loan.approvedBy = req.user._id;
    loan.approvedDate = Date.now();
    const updatedLoan = await loan.save();
    res
      .status(200)
      .json({ message: "Loan rejected successfully", updatedLoan });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLoan = async (req, res) => {
  const { loanId } = req.params;
  try {
    const { loanAmount, interestRate, durationMonths, status } = req.body;
    const loan = await loan.findByIdAndUpdate(
      loanId,
      { loanAmount, interestRate, durationMonths, status },
      { new: true },
    );
    res.status(200).json({ message: "Loan updated successfully", loan });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const repayLoan = async (req, res) => {
  const { loanId, amountPaid, paymentMethod, paymentDate } = req.body;
  let loan = await Loan.findById(loanId);
  if (amountPaid > loan.balance) {
    throw new Error('Repayment amount exceeds loan balance');
  }
  try {
    // Create a new repayment record
    const repayment = new Repayment({
      loanId,
      amountPaid,
      paymentDate,
      paymentMethod,
    });

    // Save the repayment record
    await repayment.save();
   
    const newBalance = loan.balance - amountPaid;
    loan.balance = newBalance;
    if (loan.balance === 0) {
      loan.status = 'fully paid';
    }
   
    
    await loan.save();
    res.status(200).json({
      message: 'Repayment successful',
      loan,
      repayment
    });
    
  } catch (err) {
    console.log(err);
    // Send an error response back to the client
    res.status(500).json({
      message: 'An error occurred while processing the repayment',
      error: err.message
    });
  }
};

// When an admin wants to see a particular user's loan details
const getBorrowerLoans = async (req, res) => {
  try {
    const borrower = await User.findById(req.params.userId).populate("loans");
    if (!borrower) {
      return res.status(400).json({ message: "Borrower not found" });
    }
    res.status(200).json({ message: "Borrower loans", borrower });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//When a user wants to view his or her loans
const viewLoans = async (req, res) => {
 try{
  const loans = await Loan.find({ borrower:req.user.id }).populate('repaymentSchedule').sort({'createdDate':-1});
    res.status(200).json(loans)
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// when a user wants to see his or her approved loans
const userGetApprovedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      status: "approved",
      borrower: req.user.id,
    }).populate("repaymentSchedule").sort({'createdDate':-1});
    res.status(200).json( loans );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const showUserAmountPayable = async(req, res)=>{
  try{
    const loans = await Loan.find({
      status: "approved",
      borrower: req.user.id,
    }).populate("repaymentSchedule");
    const totalAmountPayable = loans.reduce((acc, loan) => {
      const nextPayment = loan.repaymentSchedule.find(
        (repayment) => repayment.status === "pending",
      );
      if (nextPayment) {
        acc += nextPayment.loanAmount;
      }
      return acc;
    }, 0);
    res.status(200).json({ message: "All loans", totalAmountPayable });
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
//When a user wants to see his or her pending loans
const userGetPendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "pending", borrower: req.user.id }).sort({'createdDate':-1});
    res.status(200).json( loans );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/*When a user wants to see his or her rejected loans*/
const userGetRejectedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      status: "rejected",
      borrower: req.user.id,
    });
    res.status(200).json( loans );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//When admin wants to view all approved loans
const ApprovedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "approved" }).populate('borrower').sort({' approvedDate':-1});
    res.status(200).json( loans );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// pending loans view for admins only
const pendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "pending" }).populate('borrower').sort({'createdDate':-1});
    res.status(200).json(loans);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// rejected loans view for admins only
const rejectedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "rejected" }).populate('borrower');
    if (!loans) {
      return res.status(400).json({ message: "No Rejected loans found" });
    }
    res.status(200).json(  loans );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// When an admin wants to see all paid loans in the system
const repaidLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "paid" })
      .populate("borrower")
      .populate("repaymentSchedule");
    if (!loans) {
      return res.statu(400).json({ message: "No repaid loans found" });
    }
    res.status(200).json({ message: "All repaid loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Admin can view all repayments made here
const repaymentsMade = async(req,res)=>{
  try{
  const repayments = await Repayment.find().populate({
    path: 'loanId',
    populate: {
      path: 'borrower', // This assumes borrower is a reference to the User model
      select: 'name' // Specify the fields you want to return from the User model
    }
  }).sort({'paymentDate':-1}) 
  
 
  if(!repayments){
    return res.status(200).json({message:'No repayments found'})

  }
  res.status(200).json(repayments)


  }catch(err){
    console.log(err)
  }

}
// users can view all repayments, they,ve done
const getUserRepayments = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is obtained from the authenticated user

  try {
    // Find all loans for the authenticated user
    const loans = await Loan.find({ borrower: userId }); // borrower refers to the userId

    if (!loans || loans.length === 0) {
      return res.status(200).json({ message: 'No loans found for this user' });
    }

    // Extract loan IDs from the user's loans
    const loanIds = loans.map(loan => loan._id);

    // Find repayments related to the user's loans
    const repayments = await Repayment.find({ loanId: { $in: loanIds } }).populate({
      path: 'loanId',
      select: 'loanNumber borrower balance dueDate', // Fetch loanNumber and borrower from the Loan model
      populate: {
        path: 'borrower', // Populate borrower details (assuming it's a reference to the User model)
        select: 'name email', // Select specific fields from the User model
      },
    }).sort({'paymentDate':-1});

    // If no repayments are found
    if (!repayments || repayments.length === 0) {
      return res.status(200).json({ message: 'No repayments found for the user\'s loans' });
    }

    // Return repayments
    return res.status(200).json(repayments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while fetching repayments', error: err.message });
  }
};


const getTotalAmountOnLoan = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "approved" });
    let totalAmount = 0;
    for (let i = 0; i < loans.length; i++) {
      totalAmount += loans[i].loanAmount;
    }
    res.status(200).json({ message: "Total amount on loans", totalAmount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalIncomeOnInterest = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "approved" });
    let totalAmount = 0;
    for (let i = 0; i < loans.length; i++) {
      const principal = loans[i].loanAmount;
      const interest = loans[i].interestRate;
      const time = loans[i].durationMonths;
      const interestAmount = principal * interest * time;
      totalAmount += interestAmount;
    }
    res.status(200).json({ message: "Total amount on interest", totalAmount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalRepaymentAmount = async (req, res) => {
  try {
    const repayments = await Repayment.find({ status: "paid" });
    const totalRepaymentAmount = 0;
    for (let i = 0; i < repayments.length; i++) {
      const repaymentAmount = repayments[i].amountPaid;
      totalRepaymentAmount += repaymentAmount;
    }
    res
      .status(200)
      .json({ message: "Total amount on repayments", totalRepaymentAmount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteLoan = async(req,res)=>{
  const {loanId} = req.body
  try{
    await Loan.findByIdAndDelete(loanId)
    res.status(200).json({message:'Loan deleted Successfully'})

  }catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
}



module.exports = {
  applyForLoan,
  approveLoan,
  rejectLoan,
  updateLoan,
  getBorrowerLoans,
  pendingLoans,
  rejectedLoans,
  repaidLoans,
  userGetApprovedLoans,
  userGetPendingLoans,
  userGetRejectedLoans,
  viewLoans,
  repayLoan,
  getTotalAmountOnLoan,
  ApprovedLoans,
  getTotalIncomeOnInterest,
  getTotalRepaymentAmount,
  dashboard,
  repaymentsMade,
  getUserRepayments,
  deleteLoan,
 
};

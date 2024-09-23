const express = require("express");
const adminRoutes = express.Router();
const adminAccesAuth = require("../MiddleWares/adminAccessAuth");
const userAccessAuth  = require("../MiddleWares/userAccessAuth")
const {loginAdmin} = require("../Controllers/authController")
const {
       updateLoan,
       approveLoan,
       rejectLoan,
       getBorrowerLoans,
       ApprovedLoans,
       pendingLoans,
       rejectedLoans,
       repaidLoans,
       getTotalAmountOnLoan,
       repaymentsMade,
       deleteLoan,
      
      
} = require("../Controllers/loanController");
const {getUsers,removeUser,addUser,updateUser, updateUserInfo, userDetails}= require('../Controllers/userController')

adminRoutes.post("/login", loginAdmin);
adminRoutes.post("/addUser",adminAccesAuth,addUser)
adminRoutes.post("/updateLoan", adminAccesAuth, updateLoan);
adminRoutes.put("/approveLoan", adminAccesAuth, approveLoan);
adminRoutes.put("/rejectLoan",userAccessAuth , rejectLoan);
adminRoutes.get("/getBorrowerLoans", adminAccesAuth, getBorrowerLoans);
adminRoutes.get("/getApprovedLoans", ApprovedLoans);
adminRoutes.get("/pendingLoans",  pendingLoans);
adminRoutes.get("/rejectedLoans",  rejectedLoans);
adminRoutes.get("/getUsers",  getUsers);
adminRoutes.get("/userDetails/:userId", userDetails);
adminRoutes.post("/removeUser", removeUser);
adminRoutes.get("/repaidLoans", adminAccesAuth, repaidLoans);
adminRoutes.get("/total/loansgivenout", adminAccesAuth, getTotalAmountOnLoan);
adminRoutes.get('/repayments', repaymentsMade)
adminRoutes.get('/updateUser/:userId',updateUser)
adminRoutes.put('/updateUser/:userId',updateUserInfo)
adminRoutes.delete('/deleteLoan',deleteLoan)


module.exports = adminRoutes;

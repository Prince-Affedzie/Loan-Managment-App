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
       archiveLoan,
       UnarchiveLoan,
       deleteLoan,
       ViewarchiveLoans
      
      
} = require("../Controllers/loanController");
const {getUsers,removeUser,addUser,updateUser, updateUserInfo, userDetails}= require('../Controllers/userController')

adminRoutes.post("/login", loginAdmin);
adminRoutes.post("/addUser",adminAccesAuth,addUser)
adminRoutes.post("/updateLoan", adminAccesAuth, updateLoan);
adminRoutes.put("/approveLoan", adminAccesAuth, approveLoan);
adminRoutes.put("/archiveLoan", adminAccesAuth, archiveLoan);
adminRoutes.put("/unarchiveLoan", adminAccesAuth,  UnarchiveLoan);
adminRoutes.put("/rejectLoan",adminAccesAuth , rejectLoan);
adminRoutes.get("/getBorrowerLoans", adminAccesAuth, getBorrowerLoans);
adminRoutes.get("/getApprovedLoans",adminAccesAuth, ApprovedLoans);
adminRoutes.get("/getArchiveLoans", adminAccesAuth, ViewarchiveLoans);
adminRoutes.get("/pendingLoans", adminAccesAuth, pendingLoans);
adminRoutes.get("/rejectedLoans", adminAccesAuth, rejectedLoans);
adminRoutes.get("/getUsers", adminAccesAuth, getUsers);
adminRoutes.get("/userDetails/:userId", adminAccesAuth,userDetails);
adminRoutes.post("/removeUser",adminAccesAuth, removeUser);
adminRoutes.get("/repaidLoans", adminAccesAuth, repaidLoans);
adminRoutes.get("/total/loansgivenout", adminAccesAuth, getTotalAmountOnLoan);
adminRoutes.get('/repayments', adminAccesAuth,repaymentsMade)
adminRoutes.get('/updateUser/:userId',adminAccesAuth,updateUser)
adminRoutes.put('/updateUser/:userId',adminAccesAuth,updateUserInfo)
adminRoutes.delete('/deleteLoan',adminAccesAuth,deleteLoan)


module.exports = adminRoutes;

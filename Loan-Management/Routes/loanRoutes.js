const express = require("express");
const loanRouter = express.Router();
const userAccessAuth = require("../MiddleWares/userAccessAuth");
const checkProfileComplete = require('../MiddleWares/checkProfileComplete')
const {
        applyForLoan,
        userGetApprovedLoans,
        userGetPendingLoans,
        userGetRejectedLoans,
        repayLoan,
        viewLoans,
        dashboard,
        getUserRepayments
} = require("../Controllers/loanController");
loanRouter.get('/user/dashboard',dashboard)
loanRouter.get('/user/all-loans',userAccessAuth,viewLoans)
//loanRouter.get('/apply',checkProfileComplete)
loanRouter.post("/apply", applyForLoan);
loanRouter.get(
        "/borrower/approvedLoans",
        userAccessAuth,
        userGetApprovedLoans,
);
loanRouter.get(
        "/borrower/pendingLoans",
        userAccessAuth,
        userGetPendingLoans,
);
loanRouter.get(
        "/borrower/rejectedLoans",
        userAccessAuth,
        userGetRejectedLoans,
);
loanRouter.post("/repay", userAccessAuth, repayLoan);
loanRouter.get('/repayments', userAccessAuth,getUserRepayments)



module.exports = loanRouter;

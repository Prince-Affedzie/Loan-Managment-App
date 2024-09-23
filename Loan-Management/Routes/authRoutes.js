const express = require('express');
const authController = require('../Controllers/authController');
const userAccessAuth = require('../MiddleWares/userAccessAuth')
const {userProfile}  = require('../Controllers/userController')
const authRouter = express.Router();
authRouter.post('/login', authController.loginUser);
authRouter.post('/register', authController.registerUser);
authRouter.post('/profile',userAccessAuth, authController.completeProfile);  
authRouter.get('/user-profile',userAccessAuth,userProfile)  
authRouter.post('/logout', authController.logoutUser);

module.exports = authRouter;
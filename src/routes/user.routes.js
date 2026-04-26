const express = require('express');
const { registerUser, loginUser, logOutUser, getAccessTokenByRefreshToken, getUserProfile, updateUserData, towFactorEnable, verify2factorOtp, towFactorDisable, changePassword, forgotPassword, resetPassword, sendVerifyEmailOTP, verifyEmailOTP, changeEmail, logOutUserAllDevice, resendForgotPasswordOTP, resendVerifyEmailOTP, resend2FAOTP, getAllSessiond, reSendEmailChange } = require('../controllers/user.controllers');
const isRefreshTokenValid = require('../middlewares/isRefreshTokenValidOrNot.middleware');
const setAccessInHeaderAuth = require('../middlewares/setAccessInHeaderAuth.middleware');
const resendOtp = require('../utils/resendOtp');

const router = express.Router();
//register
router.post("/register",registerUser);
//send verify email OTP
router.post("/getVerifyEmailOTP",setAccessInHeaderAuth,sendVerifyEmailOTP)
//conform email verify OTP
router.post("/verifyEmailOTP",setAccessInHeaderAuth,verifyEmailOTP)
//login
router.post("/login",loginUser)


//resend query=type
router.post("/resend-otp",setAccessInHeaderAuth,resendOtp)

//conform 2fa OTP
router.post('/verify2faOtp',setAccessInHeaderAuth,verify2factorOtp)

//logout
router.post("/logout",setAccessInHeaderAuth,logOutUser)
//logout frome all device
router.post("/logoutAllDevice",setAccessInHeaderAuth,logOutUserAllDevice)
//2fa Enable
router.post("/2faEnable",setAccessInHeaderAuth,towFactorEnable)

//2fa disable
router.post("/2faDisable",setAccessInHeaderAuth,towFactorDisable)
//change Password by accesstoken
router.post("/changePassword",setAccessInHeaderAuth,changePassword)
//forget password
router.post("/forgotPassword",forgotPassword)

// forget passwords OTP and change Pass
router.post("/resetPassword",resetPassword)

//update name or Email 
router.post("/profile",setAccessInHeaderAuth,updateUserData)
//upadate Email with OTP
router.post("/changeEmail",setAccessInHeaderAuth,changeEmail)
//get user profile
router.get("/profile",setAccessInHeaderAuth,getUserProfile)

//router.post('/getAccessToken',isRefreshTokenValid,getAccessTokenByRefreshToken)

//get all sessions
router.get("/sessions",setAccessInHeaderAuth,getAllSessiond)

//resend email change otp
module.exports=router
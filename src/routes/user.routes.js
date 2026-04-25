const express = require('express');
const { registerUser, loginUser, logOutUser, getAccessTokenByRefreshToken, getUserProfile, updateUserData, towFactorEnable, verify2factorOtp, towFactorDisable, changePassword, forgotPassword, resetPassword, sendVerifyEmailOTP, verifyEmailOTP, changeEmail, logOutUserAllDevice, resendForgotPasswordOTP, resendVerifyEmailOTP, resend2FAOTP } = require('../controllers/user.controllers');
const isAuthenticated = require('../middlewares/isUserauthenticated.middlewares');
const isRefreshTokenValid = require('../middlewares/isRefreshTokenValidOrNot.middleware');
const setAccessInHeaderAuth = require('../middlewares/setAccessInHeaderAuth.middleware');

const router = express.Router();
//register
router.post("/register",registerUser);
//send verify email OTP
router.post("/getVerifyEmailOTP",setAccessInHeaderAuth,isAuthenticated,sendVerifyEmailOTP)
//resend verify email OTP
router.post("/resendVerifyEmailOTP",setAccessInHeaderAuth,isAuthenticated,resendVerifyEmailOTP)
//conform email verify OTP
router.post("/verifyEmailOTP",setAccessInHeaderAuth,isAuthenticated,verifyEmailOTP)
//login
router.post("/login",loginUser)
//conform 2fa OTP
router.post('/verify2faOtp',setAccessInHeaderAuth,verify2factorOtp)
//resend 2fa OTP
router.post('/resend2faOtp',setAccessInHeaderAuth,resend2FAOTP)
//logout
router.post("/logout",setAccessInHeaderAuth,isAuthenticated,logOutUser)
//logout frome all device
router.post("/logoutAllDevice",setAccessInHeaderAuth,isAuthenticated,logOutUserAllDevice)
//2fa Enable
router.post("/2faEnable",setAccessInHeaderAuth,isAuthenticated,towFactorEnable)
//2fa disable
router.post("/2faDisable",setAccessInHeaderAuth,isAuthenticated,towFactorDisable)
//change Password by accesstoken
router.post("/changePassword",setAccessInHeaderAuth,isAuthenticated,changePassword)
//forget password
router.post("/forgotPassword",forgotPassword)
// resend forgot password OTP
router.post("/resendForgotPasswordOTP",resendForgotPasswordOTP)
// forget passwords OTP and change Pass
router.post("/resetPassword",resetPassword)
//update name or Email 
router.post("/profile",setAccessInHeaderAuth,isAuthenticated,updateUserData)
//upadate Email and OTP
router.post("/changeEmail",setAccessInHeaderAuth,isAuthenticated,changeEmail)
//get user profile
router.get("/profile",setAccessInHeaderAuth,isAuthenticated,getUserProfile)

//router.post('/getAccessToken',isRefreshTokenValid,getAccessTokenByRefreshToken)

module.exports=router
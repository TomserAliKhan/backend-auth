const { RegisterUser, loginUser, reqAccessToken, logoutUser, showUser } =require("../controller/user.Controller");
const express = require('express');
const ApiError = require("../utils/ApiError");


const tokenCheck = require("../middleweare/checkToken.middle");

const router = express.Router();




router.route("/register").post(RegisterUser)
router.route("/login").post(loginUser)
router.route("/getAccessToken").post(reqAccessToken)
router.route("/logout").post(tokenCheck,logoutUser)

router.route("/user").post(tokenCheck,showUser)






module.exports=router
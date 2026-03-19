
const jwt = require("jsonwebtoken");
const User = require("../models/userSchima.model.js");
const generateAccessAndRefreshToken = require("../utils/accessAndRefreshToken.js");
const apiError = require("../utils/ApiError.js");
const asynchandler = require("../utils/asynchandler");
const ApiError = require("../utils/ApiError.js");
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
let options={
    httpOnly:true,
    secure:true
}

exports.RegisterUser = asynchandler(async (req, res) => {

    const { fullName, email, phone, password } = req.body;


    if (!fullName || !email || !password || !phone) {

        throw new ApiError(404, "All field require")
    }
    if (!emailRegex.test(email)) {
        throw new ApiError(404, "email not valid ")
    }
    if (password.length < 8) {
        throw new ApiError(404, " password must be at least 8 characters")
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new ApiError(404, "Email already registered")
    }
    let user = await User.create({
        fullName,
        email,
        password,
      
        phone
    })
    let { refreshToken, accessToken } = await generateAccessAndRefreshToken(user)

    res.status(201).cookie("accessToken", accessToken,{options}).cookie("refreshToken", refreshToken,options).json({
        success: true,
        message: "user register successful",
        accessToken,
        refreshToken

    });

})


exports.loginUser = asynchandler(async (req, res) => {
    let { email, password } = req.body;


    if (!emailRegex.test(email)) {
        throw new ApiError(404, "email not valid ")
    }
    if (password.length < 8) {
        throw new ApiError(404, " password must be at least 8 characters")
    }

    let existEmail = await User.findOne({ email }).select("+password")


    if (!existEmail) {
        throw new ApiError(404, "user not Exist")
    }


    let chackUser = await existEmail.isPasswordCorrect(password)
    if (!chackUser) {
        throw new ApiError(404, "invalid passsword")
    }

    let { accessToken, refreshToken } = await generateAccessAndRefreshToken(existEmail)
    if (!(accessToken && refreshToken)) {
        throw new ApiError(404, "Tokens are not create")
    }
    res.status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", refreshToken,options).json({
            accessToken,
            refreshToken,
            message: "login successful"
        })


})


exports.reqAccessToken = asynchandler(async (req, res) => {
    let refreshTokenFU = req.cookies.refreshToken || req.headers.authorization
    if (!refreshTokenFU) {
        throw new ApiError(404, "invalid refresh token")
    }
    let verifyUser = jwt.verify(refreshTokenFU, process.env.REFRESH_TOKEN_SECRET)
    if (!verifyUser) {
        throw new ApiError(404, "refreshToken is invalid")
    }
    let userChack = await User.findById(verifyUser._id).select("+accessToken")
    if (refreshTokenFU !== userChack.refreshToken) {
        throw new ApiError(404, "refreshToken used or expired")
    }

    let { accessToken, refreshToken } =await generateAccessAndRefreshToken(userChack)
    res.status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", refreshToken,options).json({
            accessToken,
            refreshToken,
            message: "access&refresh update successful"
        })
})


exports.logoutUser = asynchandler(async (req, res) => {

    let user=req.user
    console.log(user);
   
 
    let userChack = await User.findById(user._id).select("+refreshToken")
    if (!userChack) {
        throw new ApiError(404, "user not found accessToken is expired")
    }
    userChack.refreshToken = null

    await userChack.save({ validateBeforeSave: false })
    res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
        message: "logout successful"
    })
})

exports.showUser=asynchandler(async(req,res)=>{
    let user=req.user
    let data=await User.findById(user._id).select("-password -refreshToken ")

    res.status(200).json({
        user:data
    })
    


})

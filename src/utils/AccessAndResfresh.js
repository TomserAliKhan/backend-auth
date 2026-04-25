
const jwt = require("jsonwebtoken")
const sessionModel = require("../models/session.model")
const userModel = require("../models/user.model")
const ApiError = require("./ApiError")

exports.generateRefreshToken=async(user,req)=>{
  try {
  
    const refreshToken= await user.generateRefreshToken()
    const session=await sessionModel.create({
      userId:user._id,
      refreshToken:refreshToken,
      userAgent:req.headers["user-agent"],
      ip:req.ip
    })
    

   
    return session.refreshToken
  } catch (error) {
    throw new ApiError(400, error.message)
  }
}

exports.generateAccessToken=async(user)=>{
  const accessToken=await user.generateAccessToken()
  return accessToken
}



const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")
const apiResponce=require("../utils/apiRespons")

let tokenCheck= async (req,res,next)=>{

    let accessToken = req.cookies.accessToken || req.headers.authorization
    let refreshToken=req.cookies.refreshToken || req.headers.authorization
    

    
     if (!accessToken) { throw new ApiError(404, "invalid access token") }
     let verifyUser =await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
     
    if (!verifyUser) {
       apiResponce(404, "access token is expired")
    }
    

req.user=verifyUser


    next()
    
}
module.exports=tokenCheck

  
   
  
   
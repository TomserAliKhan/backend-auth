const jwt = require("jsonwebtoken")
const {  refreshSec, accessSec } = require("../config/config")
const ApiError = require("./ApiError")

exports.refreshtokenVerify=async(token)=>{
try {
        const decodedToken=await jwt.verify(token,refreshSec)
     
        return decodedToken
    
} catch (error) {
        throw new ApiError(401,error.message,error)
}
}

exports.verifyAccessToken=async (token)=>{
        try {
             const decodedToken=await jwt.verify(token,accessSec)  
            
             return decodedToken 
        } catch (error) {
                throw new ApiError(401,error.message,error) 
        }
}
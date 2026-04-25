const jwt = require("jsonwebtoken")
const {  refreshSec } = require("../config/config")
const ApiError = require("./ApiError")

exports.refreshtokenVerify=async(token)=>{
try {
        const decodedToken=await jwt.verify(token,refreshSec)
        if (!decodedToken) {
           throw new  ApiError(401,"refresh token is invalid")
        }
        return decodedToken
    
} catch (error) {
        throw new ApiError(401,error.message,error)
}
}


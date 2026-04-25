const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { refreshSec } = require("../config/config");


const isRefreshTokenValid=async(req,res,next)=>{
    const refreshToken=req.cookies.refreshToken
    try {
        const decodedRefreshToken=jwt.verify(refreshToken,refreshSec)
        req.user=decodedRefreshToken
        next()
        
        
    } catch (error) {
        throw new ApiError(404,'Error'+error)
    }

    
}
module.exports=isRefreshTokenValid
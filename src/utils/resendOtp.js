
const { resendForgotPasswordOTP, resendVerifyEmailOTP, resend2FAOTP, reSendEmailChange } = require("../controllers/user.controllers");
const ApiError = require("./ApiError");
const asyncHandler = require("./asyncHandler")

const resendOtp= asyncHandler(async(req,res,next)=>{
   try {
     const type=req.query.type;
     console.log(type);
     
     if (!type) {
         throw new ApiError(400,"plese provite otp type : ?type=email-verificaton")
     }
 
     switch(type){
         case "email-verification":
             return resendVerifyEmailOTP(req,res,next);
         case "2fa-varification":
             return resend2FAOTP(req,res,next);
         case "forgot-password":
             return resendForgotPasswordOTP(req,res,next) ;
         case "change-email":
             return reSendEmailChange(req,res,next) ;
         
         default:
             throw new ApiError(400,"Invalid OTP type")
     }
   } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
   }
})

module.exports=resendOtp
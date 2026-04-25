const ApiError = require("./ApiError");
const { getOtpEmailTemplate } = require("./emailTemplate");
const generateOTP = require("./generateOTP");
const { sendEmail } = require("./node mailer/transporter");

exports.verifyEmailOtp=async(user,otp)=>{
 try {
     
        const template = getOtpEmailTemplate({ otp: user.emailVerificationOTP, type: "verify", userName: user.name });
        await sendEmail({
         to:user.email,
         subject: template.subject,
         html: template.html
        })
 } catch (error) {
    throw new ApiError(500,"something went wrong",error)
 }
}
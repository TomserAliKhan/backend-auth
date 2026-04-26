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


exports.reSendEmailChange=async(email,user)=>{
     const existingUserWithEmail = await userModel.findOne({ email });
       if (existingUserWithEmail && existingUserWithEmail._id.toString() !== user._id.toString()) {
         throw new ApiError(400, "email already exist");
       }
   
       user.emailChangeOTP = await generateOTP();
       user.emailChangeOTPExpires = Date.now() + 10 * 60 * 1000;
       await user.save();
       await sendEmail({
         to: user.email,
         subject: "Change Your Email",
         html: getOtpEmailTemplate({ otp: user.emailChangeOTP, type: "emailChange", userName: user.name }).html,
       });
   
}
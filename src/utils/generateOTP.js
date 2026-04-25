const generateOTP=()=>{
    const otp=Number(Math.random()*1000000).toFixed(0);
    return otp;
    
}
module.exports=generateOTP;
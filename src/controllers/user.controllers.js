const ApiError = require("../utils/ApiError");
const ApiRespose = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");
const { options, refreshSec } = require("../config/config");

const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const generateOTP = require("../utils/generateOTP");
const { sendEmail } = require("../utils/node mailer/transporter");
const { otpTemplate, getOtpEmailTemplate } = require("../utils/emailTemplate");
const { setAccessToken, setRefreshToken } = require("../utils/setCookie");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/AccessAndResfresh");
const sessionModel = require("../models/session.model");

//registerUser
exports.registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, isAdmin } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "all fields are required");
  }
  if (!email.includes("@") || !email.includes(".")) {
    throw new ApiError(400, "email is not valid");
  }
  if (password.length < 8) {
    throw new ApiError(400, "password must be at least 8 characters");
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "user already registered");
  }

  const user = await userModel.create({
    name,
    email,
    password,
    role: `${isAdmin ? "admin" : "user"}`,
  });

  const refreshToken = await generateRefreshToken(user, req);
  const accessToken = user.generateAccessToken();
  setAccessToken(res, accessToken);
  setRefreshToken(res, refreshToken);
  res
    .status(201)
    .json(
      new ApiRespose(
        201,
        { accessToken, refreshToken },
        `user created successfully`,
      ),
    );
});
//send verify email OTP
exports.sendVerifyEmailOTP = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  user.emailVerificationOTP = generateOTP();
  user.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000;
  const newOtp = await user.save();
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: getOtpEmailTemplate({
      otp: newOtp.emailVerificationOTP,
      type: "verify",
      userName: user.name,
    }).html,
  });

  res.status(200).json(new ApiRespose(200, user, "email sent successfully"));
});
//verify email
exports.verifyEmailOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    throw new ApiError(400, "all fields are required");
  }
  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  if (Date.now() > user.emailVerificationOTPExpires) {
    throw new ApiError(409, "otp expired");
  }
  if (otp !== user.emailVerificationOTP) {
    throw new ApiError(404, "Invalid OTP");
  }
  user.emailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpires = undefined;
  await user.save();
  res
    .status(200)
    .json(new ApiRespose(200, user, "email verified successfully"));
});

//login user
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "all fields are required");
  }
  if (!email.includes("@") || !email.includes(".")) {
    throw new ApiError(400, "email is not valid");
  }
  if (password.length < 8) {
    throw new ApiError(400, "password must be at least 8 characters");
  }
  const existingUser = await userModel.findOne({ email });
  if (!existingUser) {
    throw new ApiError(400, "user Not Found");
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "password incorrect");
  }

  //2fa logic
  if (existingUser.is2FAEnable) {
    if (existingUser.otpAttempts > 5) {
      throw new ApiError(400, "OTP attempts limit exceeded");
    }
    const otp = generateOTP();
    const template = getOtpEmailTemplate({
      otp,
      type: "2fa",
      userName: existingUser.name,
    });
    await sendEmail({
      to: existingUser.email,
      subject: template.subject,
      html: template.html,
    });
    existingUser.otpAttempts += 1;
    existingUser.twoFactorOTP = otp;
    existingUser.twoFactorOTPExpires = Date.now() + 10 * 60 * 1000;
    await existingUser.save();
    return res.status(200).json(
      new ApiRespose(
        200,
        {
          email: existingUser.email,
          is2FAEnable: existingUser.is2FAEnable,
        },
        "OTP sent to your email",
      ),
    );
  }

  const accessToken = await existingUser.generateAccessToken();
  const refreshToken = await generateRefreshToken(existingUser, req);
  setAccessToken(res, accessToken);
  setRefreshToken(res, refreshToken);
  res.status(200).json(
    new ApiRespose(
      200,
      {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      "login Successfully",
    ),
  );
});

//chack verify 2fa otp email and otp
exports.verify2factorOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  if (!user.twoFactorOTP || !user.twoFactorOTPExpires) {
    throw new ApiError(400, "otp not sended");
  }
  if (Date.now() > user.twoFactorOTPExpires) {
    throw new ApiError(409, "otp expired");
  }
  if (otp !== user.twoFactorOTP) {
    throw new ApiError(404, "Invalid OTP");
  }
  user.twoFactorOTP = undefined;
  user.twoFactorOTPExpires = undefined;
  await user.save();

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user._id);
  setAccessToken(res, accessToken);
  setRefreshToken(res, refreshToken);
  res.status(200).json(
    new ApiRespose(
      200,
      {
        name: user.name,
        email: user.email,
        role: user.role,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
      "login Successfully",
    ),
  );
});
//logout user
exports.logOutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  const session = await sessionModel.findOneAndDelete({
    refreshToken: refreshToken,
    userId: req.user._id,
  });
  if (!session) {
    throw new ApiError(400, "user not found");
  }

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiRespose(200, session, "logout successfully"));
});
//logout all device
exports.logOutUserAllDevice = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const session = await sessionModel.deleteMany({ userId: req.user._id });
  if (!session) {
    throw new ApiError(400, "user not found");
  }

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiRespose(200, session, "logout successfully"));
});

//get accessToken by refresh token
// exports.getAccessTokenByRefreshToken = asyncHandler(async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const user = await userModel.findById(userId);
//     if (!user) {
//       throw new ApiError(404, "refresh token invalid");
//     }

//     const accessToken = await generateAccessToken(user);
//     setAccessToken(res, accessToken);
//     return res.status(200).json(
//       new ApiRespose(200, {
//         accessToken,
//       }),
//     );
//   } catch (err) {
//     throw new ApiError(404, err);
//   }
// });

//change Password
exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, conformNewPassword } = req.body;

  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(newPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "old password incorrect");
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json(new ApiRespose(200, "password changed successfully"));
});

//forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!email.includes("@") || !email.includes(".")) {
    throw new ApiError(400, "email is not valid");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  const otp = generateOTP();
  const template = getOtpEmailTemplate({
    otp,
    type: "forgot",
    userName: user.name,
  });
  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });
  user.passwordResetOTP = otp;
  user.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000;
  await user.save();
  res.status(200).json(
    new ApiRespose(
      200,
      {
        email: user.email,
      },
      "OTP sent to your email for password reset",
    ),
  );
});

//varify and resetpassword
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password, conformPassword } = req.body;
  if (!email || !otp || !password || !conformPassword) {
    throw new ApiError(400, "all fields are required");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  if (Date.now() > user.passwordResetOTPExpires) {
    throw new ApiError(409, "otp expired");
  }
  if (otp !== user.passwordResetOTP) {
    throw new ApiError(404, "Invalid OTP");
  }
  user.password = password;
  user.passwordResetOTP = undefined;
  user.passwordResetOTPExpires = undefined;
  await user.save();
  res.status(200).json(new ApiRespose(200, "password reset successfully"));
});
//resend forgot password OTP
exports.resendForgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  if (!user.passwordResetOTP || user.passwordResetOTPExpires < Date.now()) {
    throw new ApiError(400, "No valid OTP found, please request a new one");
  }
  const template = getOtpEmailTemplate({
    otp: user.passwordResetOTP,
    type: "forgot",
    userName: user.name,
  });
  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });
  res
    .status(200)
    .json(
      new ApiRespose(200, { email: user.email }, "OTP resent successfully"),
    );
});
//resend verify email OTP
exports.resendVerifyEmailOTP = asyncHandler(async (req, res,next) => {
  
  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
 
  const template = getOtpEmailTemplate({
    otp: user.emailVerificationOTP,
    type: "verify",
    userName: user.name,
  });
  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });
  res
    .status(200)
    .json(new ApiRespose(200, user, "email OTP resent successfully"));
});
//resend 2FA OTP
exports.resend2FAOTP = asyncHandler(async (req, res,next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  if (!user.is2FAEnable) {
    throw new ApiError(400, "2FA not enabled");
  }
  if (!user.twoFactorOTP || user.twoFactorOTPExpires < Date.now()) {
    throw new ApiError(400, "No valid OTP found, please login again");
  }
  const template = getOtpEmailTemplate({
    otp: user.twoFactorOTP,
    type: "2fa",
    userName: user.name,
  });
  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });
  res
    .status(200)
    .json(
      new ApiRespose(200, { email: user.email }, "2FA OTP resent successfully"),
    );
});
//change 2fa enable
exports.towFactorEnable = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await userModel.findById(_id);
  console.log(_id);

  if (!user) {
    throw new ApiError(400, "user not found");
  }
  if (!user.is2FAEnable) {
    user.is2FAEnable = true;
    resData = await user.save();
    res
      .status(200)
      .json(
        new ApiRespose(
          201,
          "2faenable  " + resData.is2FAEnable,
          "2faEnable successfully",
        ),
      );
  } else {
    res.status(404).json(new ApiRespose(404, "2FA alrady enabled"));
  }
});
//2fa disable
exports.towFactorDisable = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await userModel.findById(_id);
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  if (user.is2FAEnable) {
    user.is2FAEnable = false;
    resData = await user.save();
    res
      .status(200)
      .json(
        new ApiRespose(
          201,
          "2faEnable  " + resData.is2FAEnable,
          "2faDisable successfully",
        ),
      );
  } else {
    res.status(404).json(new ApiRespose(404, "2FA alrady disable"));
  }
});
//updateUserData
exports.updateUserData = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await userModel.findById(req.user._id);

  if (name) {
    user.name = name;
    const updatedUser = await user.save();
    return res
      .status(200)
      .json(new ApiRespose(200, updatedUser, "user updated successfully"));
  }
  if (email) {
    const existingUserWithEmail = await userModel.findOne({ email });
    if (
      existingUserWithEmail &&
      existingUserWithEmail._id.toString() !== user._id.toString()
    ) {
      throw new ApiError(400, "email already exist");
    }

    user.emailChangeOTP = await generateOTP();
    user.emailChangeOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendEmail({
      to: user.email,
      subject: "Change Your Email",
      html: getOtpEmailTemplate({
        otp: user.emailChangeOTP,
        type: "emailChange",
        userName: user.name,
      }).html,
    });

    return res
      .status(200)
      .json(new ApiRespose(200, user, "email sent successfully"));
  }



});
  //resend emailchange otp
  exports.reSendEmailChange = asyncHandler(async (req, res) => {
    const email = req.user.email;
    const id = req.user._id;
    const existingUserWithEmail = await userModel.findOne({ email });
    if (
      existingUserWithEmail &&
      existingUserWithEmail._id.toString() !== id.toString()
    ) {
      throw new ApiError(400, "email already exist");
    }

   existingUserWithEmail.emailChangeOTP = await generateOTP();
    existingUserWithEmail.emailChangeOTPExpires = Date.now() + 10 * 60 * 1000;
    await existingUserWithEmail.save();
    await sendEmail({
      to: existingUserWithEmail.email,
      subject: "Change Your Email",
      html: getOtpEmailTemplate({
        otp: existingUserWithEmail.emailChangeOTP,
        type: "emailChange",
        userName: existingUserWithEmail.name,
      }).html,
    });
    res
      .status(200)
      .json(
        new ApiRespose(
          200,
          existingUserWithEmail.name,
          `email change OTP sent successfully to ${existingUserWithEmail.email}`,
        ),
      );
  });
//change Email
exports.changeEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  if (Date.now() > user.emailChangeOTPExpires) {
    throw new ApiError(409, "otp expired");
  }
  if (otp !== user.emailChangeOTP) {
    throw new ApiError(404, "Invalid OTP");
  }
  user.emailChangeOTP = undefined;
  user.emailChangeOTPExpires = undefined;
  const newEmail = await user.save();
  if (user.email !== email) {
    user.email = email;
    await user.save();
    res
      .status(200)
      .json(new ApiRespose(200, newEmail.email, "email changed successfully"));
  }
});
// user profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel
    .findById(req.user._id)
    .select("-password -refreshToken");
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  res.status(200).json(new ApiRespose(200, user, "user profile"));
});

//get all sessions
exports.getAllSessiond = asyncHandler(async (req, res) => {
  const sessions = await sessionModel.find({ userId: req.user._id });
  if (!sessions) {
    throw new ApiError(400, "sessions not found");
  }
  res.status(200).json(new ApiRespose(200, sessions, "user sessions"));
});

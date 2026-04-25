//📧 1. OTP Email Template (2FA / Login)
exports.otpTemplate = (otp, expiry = 10) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; text-align:center;">
      
      <h2 style="color:#333;">🔐 Your Verification Code</h2>
      
      <p style="font-size:16px; color:#555;">
        Use the OTP below to complete your login.
      </p>

      <div style="margin:20px 0; font-size:28px; font-weight:bold; color:#2d89ef;">
        ${otp}
      </div>

      <p style="color:#999; font-size:14px;">
        This code will expire in ${expiry} minutes.
      </p>

      <hr style="margin:20px 0;"/>

      <p style="font-size:12px; color:#aaa;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  </div>
  `;
};


//📧 2. Email Verification Template
exports.verifyEmailTemplate = (link) => {
  return `
  <div style="font-family: Arial; background:#f4f4f4; padding:20px;">
    <div style="max-width:500px; margin:auto; background:#fff; padding:20px; border-radius:8px; text-align:center;">
      
      <h2 style="color:#333;">✅ Verify Your Email</h2>

      <p style="color:#555;">
        Click the button below to verify your account.
      </p>

      <a href="${link}" 
         style="display:inline-block; padding:10px 20px; background:#28a745; color:#fff; text-decoration:none; border-radius:5px;">
         Verify Email
      </a>

      <p style="margin-top:20px; font-size:12px; color:#aaa;">
        If you didn't create this account, ignore this email.
      </p>
    </div>
  </div>
  `;
};

//📧 3. Reset Password Template
exports.resetPasswordTemplate = (link) => {
  return `
  <div style="font-family: Arial; background:#f4f4f4; padding:20px;">
    <div style="max-width:500px; margin:auto; background:#fff; padding:20px; border-radius:8px; text-align:center;">
      
      <h2 style="color:#333;">🔑 Reset Your Password</h2>

      <p style="color:#555;">
        Click below to reset your password.
      </p>

      <a href="${link}" 
         style="display:inline-block; padding:10px 20px; background:#dc3545; color:#fff; text-decoration:none; border-radius:5px;">
         Reset Password
      </a>

      <p style="margin-top:20px; font-size:12px; color:#aaa;">
        This link will expire soon. If you didn't request this, ignore it.
      </p>
    </div>
  </div>
  `;
};

// utils/emailTemplates.js

exports.getOtpEmailTemplate = ({ otp, type, userName = "User" }) => {
  let subject = "";
  let heading = "";
  let message = "";

  switch (type) {
    case "verify":
      subject = "Verify Your Email";
      heading = "Email Verification";
      message = `Use the OTP below to verify your email address.`;
      break;

    case "forgot":
      subject = "Reset Your Password";
      heading = "Forgot Password";
      message = `Use the OTP below to reset your password.`;
      break;

    case "2fa":
      subject = "2FA Security Code";
      heading = "Two-Factor Authentication";
      message = `Use the OTP below to complete your login.`;
      break;

      case "emailChange":
      subject = "Change Your Email";
      heading = "Email Change";
      message = `Use the OTP below to change your email address.`;
      break;

    default:
      subject = "OTP Code";
      heading = "OTP Verification";
      message = `Use the OTP below.`;
  }

  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:10px; text-align:center;">
          
          <h2 style="color:#333;">${heading}</h2>
          <p>Hello ${userName},</p>
          <p>${message}</p>

          <div style="font-size:30px; font-weight:bold; letter-spacing:5px; margin:20px 0; color:#2d89ef;">
            ${otp}
          </div>

          <p style="color:#555;">This OTP will expire in <b>10 minutes</b>.</p>

          <hr />
          <p style="font-size:12px; color:gray;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };
};


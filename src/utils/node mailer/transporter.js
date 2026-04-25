const nodemailer = require('nodemailer');
const { nodeMailerEmail, nodeMailerPassword } = require('../../config/config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: nodeMailerEmail,
    pass: nodeMailerPassword
  }
});

// reusable function
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"Ecommerce App" <${nodeMailerEmail}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = { transporter, sendEmail }
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { accessSec, accessExp, refreshSec, refreshExp } = require('../config/config');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Prevents duplicate email accounts
    lowercase: true,
    index: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  is2FAEnable:{
    type:Boolean,
    default:false
  },

//email verification
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationOTP:Number,
    emailVerificationOTPExpires:Date,
//email change otp
    emailChangeOTP:Number,
    emailChangeOTPExpires:Date,
    //two factor
    twoFactorOTP:Number,
    twoFactorOTPExpires:Date,

    passwordResetOTP:Number,
    passwordResetOTPExpires:Date,
  //auth token 




  lastLogin:Date,
  loginAttemts:{
    type:Number,
    default:0
  },

  otpAttempts: {
    type: Number,
    default: 0
  },
  isBlocked: { 
    type: Boolean, 
    default: false
  }



  
},



  {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
  });

userSchema.pre("save", async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role
    },
    accessSec,
    {
      expiresIn: accessExp
    }
  )
}
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    refreshSec,
    {
      expiresIn: refreshExp
    }
  )
}




module.exports = mongoose.model('User', userSchema);
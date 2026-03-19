const { Schema, default: mongoose } = require("mongoose");
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")

const userSchema=new Schema(
    {
       
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
            select:false
        },
        phone:{
            type:String,
            required:true
        },
        fullName:{
            type:String,
            required:true
        },
        
        refreshToken:String
        
    }, 
    {
            timestamps:true
    }
       
    
       
)

userSchema.pre("save",async function(){
    if (!this.isModified("password"))return;

    this.password=await bcrypt.hash(this.password,10)

})

userSchema.methods.isPasswordCorrect=async function(password) {
 return await bcrypt.compare(password,this.password)   
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        
            process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email
        },
        
            process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


module.exports=mongoose.model("User",userSchema)
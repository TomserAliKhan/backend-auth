const { default: mongoose } = require("mongoose");


const sessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
        index:true
    },
    refreshToken:{
        type:String,
        required:true,
    },
    isValid: {
        type: Boolean,
        default: true
    },
    userAgent: {
        type: String,
        required: true,
      },
      ip: {
        type: String,
        required: true,
      }
   
      
    
    },

{
    timestamps:true
}
)

module.exports = mongoose.model("Session", sessionSchema);
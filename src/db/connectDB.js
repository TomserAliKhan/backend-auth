

const { default: mongoose } = require("mongoose");
const config = require("../config/config");



const connectDB=async()=>{
    try {
        let dbResponse=await mongoose.connect(`${config.dburl}/user`)
        console.log('connected DB');
  
        
        
    } catch (error) {
        console.error("db not connected"  ,error);
        process.exit(1)
    }
}

module.exports=connectDB
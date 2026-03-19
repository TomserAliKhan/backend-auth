const mongoose =require('mongoose')

const connectDB=async ()=>{
    try{
    let connecttionDataBase=await mongoose.connect(`${process.env.DB_URL}/app`)
    console.log(`mongo connected ${connecttionDataBase.connection.host} `);
    }catch(error){
        console.log(`dberror ${error} ${process.env.DB_URL}`);
        process.exit(1)
    }

}
module.exports=connectDB
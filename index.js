const app =require('./app')
require('dotenv').config('./.env')
const connectDB= require("./db/db.config")
 connectDB()



app.listen(process.env.PORT || 3001, () => {
   
    console.log(`Server started on ${process.env.PORT }`);
});
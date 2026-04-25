require('dotenv').config()
const app=require("./src/app");
const config = require("./src/config/config");
const connectDB = require('./src/db/connectDB');
const port=3000

console.log(config.dburl);

connectDB().then(()=>{

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
}
).catch((error)=>console.error('err',error)
)


const express = require('express');
const cors = require('cors')
const cookieParser=require("cookie-parser")
const ApiError = require('./utils/ApiError')
let app=express()
const userRouter=require('./routes/routes')

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors({
	origin:'http://localhost:5173',
	optionsSuccessStatus:200,
	credentials:true,
	methods:['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
	allowedHeaders:['Content-Type','Authorization'],
	maxAge: 86400,
}))

app.use("/api/v1",userRouter)

app.use((req, res, next) => {
	next(new ApiError(404, "Route not found"))
})



module.exports=app
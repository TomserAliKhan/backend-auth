const jwt = require("jsonwebtoken")

const User = require("../models/userSchima.model")




let generateAccessAndRefreshToken = async (user) => {

    try {
        let loginuser = await User.findById(user._id)
        let accessToken = await loginuser.generateAccessToken()
        let refreshToken = await loginuser.generateRefreshToken()
        loginuser.refreshToken = refreshToken
        await loginuser.save({ validateBeforeSave: false })


        return { accessToken, refreshToken }

    } catch (error) {
        console.log(error);


    }
}





module.exports = generateAccessAndRefreshToken
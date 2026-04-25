const sessionModel = require("../models/session.model");
const ApiError = require("../utils/ApiError");
const { setAccessToken } = require("../utils/setCookie");
const { refreshtokenVerify } = require("../utils/tokenVerify");

const setAccessInHeaderAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log(accessToken);
    
    if (accessToken) {
      req.headers.authorization = `Bearer ${accessToken}`;
  
      
      
      return next();
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next();
    }

    const decodedRefreshToken = await refreshtokenVerify(refreshToken);
    const session = await sessionModel
      .findOne({
        userId: decodedRefreshToken._id,
        refreshToken,
        isValid: true,
      })
      .populate("userId");

    if (!session) {
      throw new ApiError(404, "session not found");
    }

    const newAccessToken = await session.userId.generateAccessToken();
    req.headers.authorization = `Bearer ${newAccessToken}`;
    setAccessToken(res, newAccessToken);

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = setAccessInHeaderAuth;


const sessionModel = require("../models/session.model");
const ApiError = require("../utils/ApiError");
const { setAccessToken } = require("../utils/setCookie");
const { refreshtokenVerify, verifyAccessToken } = require("../utils/tokenVerify");

const setAccessInHeaderAuth = async (req, res, next) => {
  try {
    let accessToken;
    

    if (req.headers.authorization?.startsWith("Bearer ")) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      accessToken = req.cookies.accessToken;
      req.headers.authorization = `Bearer ${accessToken}`;
    }

    if (accessToken) {
      const decodedAccessToken = await verifyAccessToken(accessToken);
      req.user = decodedAccessToken;
      return next();
    }

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new ApiError(401, "Unauthorized: No access token or refresh token provided"));
    }

    const decodedRefreshToken = await refreshtokenVerify(refreshToken);
    const session = await sessionModel
      .findOne({
        userId: decodedRefreshToken._id,
        refreshToken,
        isValid: true,
      })
      .populate("userId","email");

    if (!session) {
      throw new ApiError(404, "session not found");
    }
   
    const newAccessToken = await session.userId.generateAccessToken();
    req.headers.authorization = `Bearer ${newAccessToken}`;
    setAccessToken(res, newAccessToken);
    req.user = session.userId;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = setAccessInHeaderAuth;

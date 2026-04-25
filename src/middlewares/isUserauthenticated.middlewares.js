const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { accessSec } = require("../config/config");

const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken =
      req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;

    if (!accessToken) {
      return res.status(403).json(new ApiError(403, "accessToken is invalid"));
    }
    const decodedToken = await jwt.verify(accessToken, accessSec);
    req.user = decodedToken;

    return next();
  } catch (error) {
    return res.status(403).json(new ApiError(403, "accessToken is invalid"));
  }
};

module.exports = isAuthenticated;

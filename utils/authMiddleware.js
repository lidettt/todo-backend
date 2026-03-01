const jwt = require("jsonwebtoken");
const User = require("../models/User");
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};
const protect = async (request, response) => {
  try {
    const token = getTokenFrom(request);
    if (!token) {
      return response.status(401).json({
        error: "Token missing",
      });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = protect;

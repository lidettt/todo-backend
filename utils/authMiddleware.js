const jwt = require("jsonwebtoken");
const User = require("../models/User");
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};
const protect = async (request, response, next) => {
  try {
    const token = getTokenFrom(request);
    if (!token) {
      return response.status(401).json({
        error: "Token missing",
      });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.userId) {
      return response.status(401).json({ error: "token invalid" });
    }

    // Fetch user without password
    const user = await User.findById(decodedToken.userId).select("-password");

    // Check if user still exists in DB
    if (!user) {
      return response.status(404).json({ error: "User no longer exists" });
    }

    // ATTACH to the request object
    request.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
module.exports = protect;

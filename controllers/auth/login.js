const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../../models/User");

loginRouter.post("/", async (request, response, next) => {
  try {
    const { email, password } = request.body;

    // find user in database first
    const user = await User.findOne({ email });
    //if the user not found
    if (!user) {
      return response.status(401).json({
        error: "Invalid email or password",
      });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return response.status(401).json({ error: "Invalid email or password" });
    }

    const userForToken = {
      userId: user._id,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    response.status(200).send({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;

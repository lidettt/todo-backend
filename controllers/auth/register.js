const registerRouter = require("express").Router();
const User = require("../../models/User");
const { registerValidation } = require("../../utils/validation");

registerRouter.post(
  "/",
  registerValidation,
  async (request, response, next) => {
    try {
      const { email, name, password } = request.body;
      const existedEmail = await User.findOne({ email });
      if (existedEmail) {
        return response.status(409).json({ message: "Email already exist." });
      }
      const user = new User({
        email,
        name,
        password,
      });
      await user.save();
      response.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  },
);
module.exports = registerRouter;

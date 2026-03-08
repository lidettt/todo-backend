const usersRouter = require("express").Router();
const User = require("../models/User");
const { protect, isAdmin } = require("../utils/authMiddleware");

// GET //
usersRouter.get("/", protect, isAdmin, async (request, response, next) => {
  try {
    const users = await User.find({}).populate("todos");
    response.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;

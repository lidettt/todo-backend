const usersRouter = require("express").Router();
const User = require("../models/User");

// GET //
usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;

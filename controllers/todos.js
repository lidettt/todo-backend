// const bcrypt = require("bcrypt");
const todosRouter = require("express").Router();
const { protect } = require("../utils/authMiddleware");
// const User = require("../models/user");
const Todo = require("../models/Todo");

// GET //
todosRouter.get("/", protect, async (request, response, next) => {
  try {
    // Only find todos belonging to the logged-in user
    const todos = await Todo.find({ user: request.user._id });
    response.json(todos);
  } catch (error) {
    next(error);
  }
});

// POST //
todosRouter.post("/", protect, async (request, response, next) => {
  try {
    const body = request.body;
    const todo = new Todo({
      title: body.title,
      completed: body.completed || false,
      user: request.user._id,
    });
    const savedTodo = await todo.save();
    // await savedTodo.populate("user", "name email");
    response.status(201).json(savedTodo);
  } catch (error) {
    next(error);
  }
});

// PUT //
todosRouter.put("/:id", protect, async (request, response, next) => {
  try {
    const { title, completed } = request.body;

    const todo = await Todo.findById(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found" });
    }
    if (todo.user.toString() !== request.user._id.toString()) {
      return response.status(403).json({ error: "Unauthorized update" });
    }

    // Update only if the value exists in the request
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    const updatedTodo = await todo.save();
    response.json(updatedTodo);
  } catch (error) {
    next(error);
  }
});
// DELETE
todosRouter.delete("/:id", async (request, response, next) => {
  try {
    const todo = await Todo.findById(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found!" });
    }
    if (todo.user.toString() !== request.user._id.toString()) {
      return response
        .status(403)
        .json({ error: "Only the owner can delete this!" });
    }
    const result = await Todo.findByIdAndDelete(request.params.id);
    if (!result) {
      return response
        .status(404)
        .json({ error: "Todo already deleted or not found" });
    }
    response.status(200).json({ message: "Delete todo Successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = todosRouter;

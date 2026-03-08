const todosRouter = require("express").Router();
const { protect, isAdmin } = require("../utils/authMiddleware");
const { todoValidation } = require("../utils/validation");

const Todo = require("../models/Todo");

// GET //
todosRouter.get("/", protect, async (request, response, next) => {
  try {
    // Only find todos belonging to the logged-in user
    const todos = await Todo.find({ user: request.user._id }).sort({
      createdAt: -1,
    });
    response.json(todos);
  } catch (error) {
    next(error);
  }
});
// GET ALL TODOS FOR ADMIN //
todosRouter.get(
  "/admin/all",
  protect,
  isAdmin,
  async (request, response, next) => {
    try {
      const allTodos = await Todo.find({}).populate("user", "email name");
      response.json(allTodos);
    } catch (error) {
      next(error);
    }
  },
);
// POST //
todosRouter.post(
  "/",
  todoValidation,
  protect,

  async (request, response, next) => {
    try {
      const body = request.body;
      const todo = new Todo({
        title: body.title,
        completed: body.completed || false,
        user: request.user._id,
      });
      const savedTodo = await todo.save();

      const user = request.user;
      user.todos = user.todos.concat(savedTodo._id);
      await user.save();
      response.status(201).json(savedTodo);
    } catch (error) {
      next(error);
    }
  },
);

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
todosRouter.delete("/:id", protect, async (request, response, next) => {
  try {
    const todo = await Todo.findById(request.params.id);
    // return response.json(todo);
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

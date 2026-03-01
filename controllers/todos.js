// const bcrypt = require("bcrypt");
const todosRouter = require("express").Router();
// const User = require("../models/user");
const Todo = require("../models/Todo");

// GET //
todosRouter.get("/", async (request, response, next) => {
  try {
    const todos = await Todo.find({});
    response.json(todos);
  } catch (error) {
    next(error);
  }
});

// POST //
todosRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;
    const todo = new Todo({
      title: body.title,
      completed: body.completed || false,
    });
    const savedTodo = await todo.save();
    response.status(201).json(savedTodo);
  } catch (error) {
    next(error);
  }
});

// PUT //
todosRouter.put("/:id", async (request, response, next) => {
  try {
    const { title, completed } = request.body;

    const todo = await Todo.findById(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found" });
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

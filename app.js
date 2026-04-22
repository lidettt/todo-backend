const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const todosRouter = require("./controllers/todos");
const usersRouter = require("./controllers/users");
const registerRouter = require("./controllers/auth/register");
const loginRouter = require("./controllers/auth/login");

const app = express();
logger.info("connecting to ", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) =>
    logger.error("error connecting to MongoDB:", error.message),
  );

app.use(express.json());
app.use(middleware.requestLogger);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/todos", todosRouter);

app.use("/users", usersRouter);
app.use("/auth/register", registerRouter);
app.use("/auth/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;

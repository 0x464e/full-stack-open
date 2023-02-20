const express = require("express");
const app = express();
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const mongoose = require("mongoose");
const config = require("./utils/config");
const cors = require("cors");
const { errorHandler, tokenExtractor, userExtractor } = require("./utils/middleware");

mongoose.set("strictQuery", false);
const MONGO_URI = process.env.NODE_ENV !== "production" ? config.MONGODB_URI_TEST : config.MONGODB_URI;
mongoose.connect(MONGO_URI);

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use("/api/blogs", userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
if (process.env.NODE_ENV === "test")
    app.use("/api/testing", require("./controllers/testing"));
app.use(errorHandler);


module.exports = app;

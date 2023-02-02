const express = require("express");
const app = express();
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const config = require("./utils/config");
const cors = require("cors");

mongoose.set("strictQuery", false);
const MONGO_URI = process.env.NODE_ENV === "test" ? config.MONGODB_URI_TEST : config.MONGODB_URI;
mongoose.connect(MONGO_URI);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;

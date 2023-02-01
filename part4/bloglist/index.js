const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const MONGO_URI = process.env.NODE_ENV === "test" ? config.MONGODB_URI_TEST : config.MONGODB_URI;
mongoose.connect(MONGO_URI);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
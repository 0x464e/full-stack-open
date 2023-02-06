const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", { url: 1, title: 1, author: 1 });
    response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
    const { username, name, password } = request.body;

    if (!password) {
        response.status(400).send({ error: "password is required" });
        return;
    }

    if (password.length < 3) {
        response.status(400).send({ error: "password is shorter than the minimum allowed length (3)" });
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        name,
        passwordHash
    });

    try {
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    }
    catch (error) {
        next(error);
    }
});

module.exports = usersRouter;

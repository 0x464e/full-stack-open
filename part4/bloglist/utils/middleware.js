const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");

const errorHandler = (error, request, response, next) => {
    if (error.name === "CastError")
        return response.status(400).send({ error: "Invalid id" });

    if (error.name === "ValidationError")
        return response.status(400).json({ error: error.message });

    if (error.name === "JsonWebTokenError")
        return response.status(401).json({ error: "Invalid token or missing token" });

    next(error);
};

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer "))
        request.token = authorization.substring(7);

    next();
};

const userExtractor = async (request, response, next) => {
    if (!request.token)
    {
        next();
        return;
    }

    let decodedToken = "";
    try {
        decodedToken = jwt.verify(request.token, config.SECRET);
    } catch (error) {
        next(error);
        return;
    }

    if (!decodedToken.id)
        return response.status(401).json({ error: "token invalid" });

    const user = await User.findById(decodedToken.id);
    if (!user)
        return response.status(404).send({ error: "user not found" });

    request.user = user;
    next();
};

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
};
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1, id: 1 });
    response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
    if (!request.body.title || !request.body.url) {
        response.status(400).end();
        return;
    }

    if (request.body.likes === undefined)
        request.body.likes = 0;

    if (!request.user)
        return response.status(401).send({ error: "token missing or invalid" });

    const user = request.user;
    const blog = new Blog({ ...request.body, user: user._id });

    let savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    savedBlog = await savedBlog.populate("user", { username: 1, name: 1, id: 1 });
    response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
    const id = request.params.id;
    if (!request.user)
        return response.status(401).send({ error: "token missing or invalid" });

    const user = request.user;

    try {
        const blog = await Blog.findByIdAndRemove(id);
        if (!blog)
            return response.status(404).send({ error: "blog not found" });

        if (blog.user.toString() !== user._id.toString())
            return response.status(401).send({ error: "blog can only be deleted by the user who created it" });

        user.blogs = user.blogs.filter(blog => blog.toString() !== id);
        await user.save();
        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

blogsRouter.put("/:id", async (request, response, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true }).populate("user", { username: 1, name: 1, id: 1 });
        response.status(blog ? 200 : 404).json(blog);
    } catch (error) {
        next(error);
    }
});

module.exports = blogsRouter;

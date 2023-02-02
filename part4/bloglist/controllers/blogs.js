const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
    if (!request.body.title || !request.body.url) {
        response.status(400).end();
        return;
    }

    if (request.body.likes === undefined)
        request.body.likes = 0;

    const blog = new Blog(request.body);

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
    const id = request.params.id;
    try {
        const blog = await Blog.findByIdAndRemove(id);
        response.status(blog ? 204 : 404).end();
    }
    catch {
        response.status(400).send({ error: "malformatted id" });
    }
});

blogsRouter.put("/:id", async (request, response) => {
    try {
        const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
        response.status(blog ? 200 : 404).json(blog);
    }
    catch {
        response.status(400).send({ error: "malformatted id" });
    }
});

module.exports = blogsRouter;

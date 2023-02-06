const mongoose = require("mongoose");
const { agent } = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = agent(app);
api.post("/api/login").send({
    "username": "username",
    "password": "password"
}).then(response => api.auth(response.body.token, { type: "bearer" }));

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
];

beforeEach(async () => {
    await Blog.deleteMany({});
    for (let blog of blogs)
        await api.post("/api/blogs").send(blog);
});

test("correct number of blogs returned as json", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(blogs.length);
    expect(response.type).toBe("application/json");
});

test("id property is named id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
});

test("a blog can be added", async () => {
    const blogCount = await Blog.countDocuments();
    const newBlog = {
        title: "title",
        author: "author",
        url: "url",
        likes: 0
    };

    await api.post("/api/blogs").send(newBlog).expect(201);
    const blogsAfter = await api.get("/api/blogs");
    expect(blogsAfter.body).toHaveLength(blogCount + 1);
});

test("a blog with no likes property defaults to 0", async () => {
    const newBlog = {
        title: "title",
        author: "author",
        url: "url"
    };

    const response = await api.post("/api/blogs").send(newBlog);
    expect(response.status).toBe(201);
    expect(response.body.likes).toBe(0);
});

describe("a blog with no title or url is not added", () => {
    test("no title", async () => {
        const newBlog = {
            author: "author",
            url: "url",
            likes: 0
        };

        await api.post("/api/blogs").send(newBlog).expect(400);
    });

    test("no url", async () => {
        const newBlog = {
            title: "title",
            author: "author",
            likes: 0
        };

        await api.post("/api/blogs").send(newBlog).expect(400);
    });

    test("no title and url", async () => {
        const newBlog = {
            author: "author",
            likes: 0
        };

        await api.post("/api/blogs").send(newBlog).expect(400);
    });
});

describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
        const blogsAtStart = await api.get("/api/blogs");
        const blogToDelete = blogsAtStart.body[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
        const blogsAtEnd = await api.get("/api/blogs");
        expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length - 1);
    });

    test("fails with status code 400 if id is invalid", async () =>
        await api.delete("/api/blogs/invalid").expect(400));

    test("fails with status code 404 if id is not found", async () =>
        await api.delete("/api/blogs/5a422a851b54a676234d17f6").expect(404));
});

describe("updating a blog", () => {
    describe("test status codes and success for likes", () => {
        test("succeeds with status code 200 if id is valid", async () => {
            const blogsAtStart = await api.get("/api/blogs");
            const blogToUpdate = blogsAtStart.body[0];

            const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send({ likes: 100 });
            expect(response.status).toBe(200);
            expect(response.body.likes).toBe(100);
        });

        test("fails with status code 400 if id is invalid", async () =>
            await api.put("/api/blogs/invalid").send({ likes: 1 }).expect(400));

        test("fails with status code 404 if id is not found", async () =>
            await api.put("/api/blogs/5a422a851b54a676234d17f6").send({ likes: 7373 }).expect(404));
    });

    describe("test updating of title and url", () => {
        test("title can be updated", async () => {
            const blogsAtStart = await api.get("/api/blogs");
            const blogToUpdate = blogsAtStart.body[0];

            const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send({ title: "new title" });
            expect(response.status).toBe(200);
            expect(response.body.title).toBe("new title");
        });

        test("url can be updated", async () => {
            const blogsAtStart = await api.get("/api/blogs");
            const blogToUpdate = blogsAtStart.body[0];

            const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send({ url: "new url" });
            expect(response.status).toBe(200);
            expect(response.body.url).toBe("new url");
        });
    });
});

test("blog can't be added without token", async () => {
    const newBlog = {
        title: "title",
        author: "author",
        url: "url",
        likes: 0
    };


    await api.set("Authorization", "").post("/api/blogs").send(newBlog).expect(401);
});

afterAll(async () => await mongoose.connection.close());

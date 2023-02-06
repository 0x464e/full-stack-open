const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);
const users = [
    {
        username: "testuser1",
        name: "Test User 1",
        password: "testpassword1"
    },
    {
        username: "testuser2",
        name: "Test User 2",
        password: "testpassword2"
    },
    {
        username: "testuser3",
        name: "Test User 3",
        password: "testpassword3"
    },
    {
        username: "testuser4",
        name: "Test User 4",
        password: "testpassword4"
    }
];

beforeEach(async () => {
    await User.deleteMany({});
    for (let user of users) {
        const userObject = new User(user);
        await userObject.save();
    }
});

test("correct number of users returned as json", async () => {
    const response = await api.get("/api/users");
    expect(response.body).toHaveLength(users.length);
    expect(response.type).toBe("application/json");
});

test("a user can be added", async () => {
    const userCount = await User.countDocuments();
    const newUser = {
        username: "testuser5",
        name: "Test User 5",
        password: "testpassword5"
    };

    await api.post("/api/users").send(newUser).expect(201);
    const usersAfter = await api.get("/api/users");
    expect(usersAfter.body).toHaveLength(userCount + 1);
});

describe("invalid users are not added", () => {
    test("no username", async () => {
        const newUser = {
            name: "Test User 5",
            password: "testpassword5"
        };

        const response = await api.post("/api/users").send(newUser).expect(400);
        expect(response.body.error).toMatch(/username.+is required/);
    });

    test("username too short", async () => {
        const newUser = {
            username: "te",
            name: "Test User 5",
            password: "testpassword5"
        };

        const response = await api.post("/api/users").send(newUser).expect(400);
        expect(response.body.error).toMatch(/username.+shorter than the minimum/);
    });

    test("no password", async () => {
        const newUser = {
            username: "testuser5",
            name: "Test User 5"
        };

        const response = await api.post("/api/users").send(newUser).expect(400);
        expect(response.body.error).toMatch(/password.+is required/);
    });

    test("password too short", async () => {
        const newUser = {
            username: "testuser5",
            name: "Test User 5",
            password: "te"
        };

        const response = await api.post("/api/users").send(newUser).expect(400);
        expect(response.body.error).toMatch(/password.+shorter than the minimum/);
    });

    test("username already exists", async () => {
        const newUser = {
            username: "testuser1",
            name: "Test User 5",
            password: "testpassword5"
        };

        const response = await api.post("/api/users").send(newUser).expect(400);
        expect(response.body.error).toMatch(/username.+to be unique/);
    });
});

afterAll(async () => await mongoose.connection.close());

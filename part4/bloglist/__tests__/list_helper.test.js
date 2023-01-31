const listHelper = require("../utils/list_helper");

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

test("dummy returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
});

describe("total likes", () => {
    const oneBlog = [
        {
            _id: "1",
            title: "title",
            author: "author",
            url: "url",
            likes: 1,
            __v: 0
        }
    ];

    const zeroLikes = [
        {
            _id: "1",
            title: "title",
            author: "author",
            url: "url",
            likes: 2,
            __v: 0
        },
        {
            _id: "2",
            title: "title",
            author: "author",
            url: "url",
            likes: 0,
            __v: 0
        }
    ];

    test("when list has only one blog", () => {
        const result = listHelper.totalLikes(oneBlog);
        expect(result).toBe(1);
    });

    test("when list has an entry with zero likes", () => {
        const result = listHelper.totalLikes(zeroLikes);
        expect(result).toBe(2);
    });

    test("when list has no blogs", () => {
        const result = listHelper.totalLikes([]);
        expect(result).toBe(0);
    });

    test("when list has multiple blogs", () => {
        const blogs = [];
        let sum = 0;
        for (let i = 0; i < 10; i++) {
            const rand = Math.floor(Math.random() * 100);
            sum += rand;
            blogs.push({
                _id: i,
                title: "title",
                author: "author",
                url: "url",
                likes: rand,
                __v: 0
            });
        }

        const result = listHelper.totalLikes(blogs);
        expect(result).toBe(sum);
    });
});

test("favorite blog", () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toBe(blogs.find(x => x._id === "5a422b3a1b54a676234d17f9"));
});

test("most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual(
        {
            author: "Robert C. Martin",
            blogs: 3
        });
});

test("most likes", () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual(
        {
            author: "Edsger W. Dijkstra",
            likes: 17
        });
});

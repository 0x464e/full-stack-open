const _ = require("lodash");

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => [...blogs].sort((a, b) => a.likes - b.likes).pop();

const mostBlogs = (blogs) => {
    const authors = _.countBy(blogs, "author");
    const mostAuthor = _.maxBy(_.keys(authors), (x) => authors[x]);
    return _.zipObject(["author", "blogs"], [mostAuthor, authors[mostAuthor]]);
};

const mostLikes = (blogs) => {
    const authors = _.groupBy(blogs, "author");
    const mostAuthor = _.maxBy(_.keys(authors), (x) => totalLikes(authors[x]));
    return _.zipObject(["author", "likes"], [mostAuthor, totalLikes(authors[mostAuthor])]);
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
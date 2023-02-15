import React, {useState} from "react"

const Blog = ({blog}) => (
    <div>
        {blog.title} {blog.author}
    </div>
)

const CreateNewBlog = ({ handleCreateNewBlog }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await handleCreateNewBlog(title, author, url);
        setTitle("");
        setAuthor("");
        setUrl("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>create new</h2>
            <div>
                title
                <input
                    type="text"
                    value={title}
                    name="Title"
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>
            <div>
                author
                <input
                    type="text"
                    value={author}
                    name="Author"
                    onChange={(event) => setAuthor(event.target.value)}
                />
            </div>
            <div>
                url
                <input
                    type="text"
                    value={url}
                    name="Url"
                    onChange={(event) => setUrl(event.target.value)}
                />
            </div>
            <button type="submit">create</button>
        </form>
    );
}

const BlogView = ({blogs, user, handleLogout, handleCreateNewBlog}) => {
    return (
        <div>
            <h2>blogs</h2>
            <p>{user.name} logged in <button onClick={handleLogout()}>logout</button></p>
            <CreateNewBlog handleCreateNewBlog={handleCreateNewBlog}/>
            {blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}
        </div>
    )
}

export default BlogView
import { useState, forwardRef } from 'react';
import Toggleable from './Toggleable';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateBlog, removeBlog }) => {
    const [visible, setVisible] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    };

    const toggleVisibility = () => setVisible(!visible);
    const handleLike = async () => await updateBlog(blog, { likes: blog.likes + 1, user: null }); //user validation for updating was never implemented in the backend
    const handleRemove = async () => await removeBlog(blog);

    return (
        <div style={blogStyle}>
            {blog.title} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
            {visible &&
                <div>
                    {blog.author}<br/>
                    {blog.url}<br/>
                    {blog.likes} likes <button onClick={handleLike}>like</button><br/>
                    {blog.author}<br/>
                    <button onClick={handleRemove}>remove</button>
                </div>}
        </div>
    );
};

const CreateNewBlog = ({ handleCreateNewBlog }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        await handleCreateNewBlog(title, author, url);
        setTitle('');
        setAuthor('');
        setUrl('');
    };

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
};

const BlogView = forwardRef(({ blogs, user, handleLogout, handleCreateNewBlog, updateBlog, removeBlog }, ref) => {
    return (
        <div>
            <h2>blogs</h2>
            <p>{user.name} logged in <button onClick={handleLogout()}>logout</button></p>
            <Toggleable buttonLabel="new blog" ref={ref}>
                <CreateNewBlog handleCreateNewBlog={handleCreateNewBlog}/>
            </Toggleable>
            {blogs.map(blog => <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog}/>)}
        </div>
    );
});

BlogView.displayName = 'BlogView';

BlogView.propTypes = {
    blogs: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    handleLogout: PropTypes.func.isRequired,
    handleCreateNewBlog: PropTypes.func.isRequired,
    updateBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired
};

export default BlogView;
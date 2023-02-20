import { useState } from 'react';

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
    const handleLike = async () => await updateBlog(blog, { likes: blog.likes + 1 });
    const handleRemove = async () => await removeBlog(blog);

    return (
        <div className="blog" style={blogStyle}>
            {blog.title} {blog.author}<button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
            {visible &&
                <div>
                    {blog.url}<br/>
                    {blog.likes} likes <button onClick={handleLike}>like</button><br/>
                    {blog.user.name}<br/>
                    {JSON.parse(window.localStorage.getItem('loggedInUser')).username === blog.user.username &&
                        <button onClick={handleRemove}>remove</button>}
                </div>}
        </div>
    );
};

export default Blog;

import { forwardRef } from 'react';
import Blog from './Blog';
import CreateNewBlog from './CreateNewBlog';
import Toggleable from './Toggleable';
import PropTypes from 'prop-types';

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
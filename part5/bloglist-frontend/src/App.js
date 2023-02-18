import { useState, useEffect, useRef } from 'react';
import BlogView from './components/BlogView';
import blogService from './services/blogsService';
import loginService from './services/loginService';
import Login from './components/Login';
import Notification from './components/Notification';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState(null);
    const blogViewRef = useRef();

    useEffect(() => {
        blogService.getAll().then(blogs => setBlogs(blogs));
        const loggedInUser = window.localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    useEffect(() =>
        setBlogs((blogs) => [...blogs].sort((a, b) => b.likes - a.likes)),
    [blogs]);

    const handleLogin = async (username, password) => {
        try {
            const user = await loginService.login({
                username,
                password
            });
            setUser(user);
            blogService.setToken(user.token);
            window.localStorage.setItem('loggedInUser', JSON.stringify(user));
        } catch (e) {
            setNotification({ message: 'Wrong username or password', color: 'red' });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const handleLogout = () => () => {
        window.localStorage.removeItem('loggedInUser');
        setUser(null);
        setNotification({ message: 'Logged out', color: 'green' });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleCreateNewBlog = async (title, author, url) => {
        try {
            const newBlog = await blogService.createNew({
                title,
                author,
                url
            });
            setBlogs(blogs.concat(newBlog));
            setNotification({ message: `A new blog ${newBlog.title} by ${newBlog.author} added`, color: 'green' });
            blogViewRef.current.toggleVisibility();
            setTimeout(() => setNotification(null), 5000);
        } catch (e) {
            setNotification({ message: e.message, color: 'red' });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const updateBlog = async (blog, update) => {
        try {
            const updatedBlog = await blogService.update(blog.id, { ...blog, ...update });
            setBlogs(blogs.map(x => x.id === blog.id ? updatedBlog : x));
        } catch (e) {
            setNotification({ message: e.message, color: 'red' });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const removeBlog = async (blog) => {
        try {
            if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`))
                return;

            await blogService.remove(blog.id);
            setBlogs(blogs.filter(x => x.id !== blog.id));
        } catch (e) {
            setNotification({ message: e.message, color: 'red' });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    return (
        <div>
            <Notification notification={notification}/>
            {user === null ?
                <Login handleLogin={handleLogin}/>
                :
                <BlogView blogs={blogs} user={user} handleLogout={handleLogout}
                    handleCreateNewBlog={handleCreateNewBlog} updateBlog={updateBlog} removeBlog={removeBlog}
                    ref={blogViewRef}/>
            }
        </div>
    );
};

export default App;
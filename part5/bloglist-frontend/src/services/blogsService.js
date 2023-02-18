import axios from 'axios';

const baseUrl = '/api/blogs';
let token = null;

const setToken = (newToken) => token = `bearer ${newToken}`;

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const createNew = async (newBlog) => {
    const config = {
        headers: { Authorization: token }
    };
    const response = await axios.post(baseUrl, newBlog, config);
    return response.data;
};

const update = async (id, blog) => {
    delete blog.user;
    const response = await axios.put(`${baseUrl}/${id}`, blog);
    return response.data;
};

const remove = async (id) => {
    const config = {
        headers: { Authorization: token }
    };
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.data;
};

export default { setToken, getAll, createNew, update, remove };

import { useState } from 'react';

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
                    id="title"
                    type="text"
                    value={title}
                    name="Title"
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>
            <div>
                author
                <input
                    id="author"
                    type="text"
                    value={author}
                    name="Author"
                    onChange={(event) => setAuthor(event.target.value)}
                />
            </div>
            <div>
                url
                <input
                    id="url"
                    type="text"
                    value={url}
                    name="Url"
                    onChange={(event) => setUrl(event.target.value)}
                />
            </div>
            <button id="submit" type="submit">create</button>
        </form>
    );
};

export default CreateNewBlog;

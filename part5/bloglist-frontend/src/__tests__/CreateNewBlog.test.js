import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import CreateNewBlog from '../components/CreateNewBlog';

test('calls event handler with correct details when a new blog is created', () => {
    const blog = {
        title: 'test title',
        author: 'test author',
        url: 'test url'
    };

    const createBlog = jest.fn();
    const { container } = render(<CreateNewBlog handleCreateNewBlog={createBlog}/>);

    const title = container.querySelector('#title');
    const author = container.querySelector('#author');
    const url = container.querySelector('#url');
    const submit = container.querySelector('#submit');

    fireEvent.change(title, {
        target: { value: blog.title }
    });

    fireEvent.change(author, {
        target: { value: blog.author }
    });

    fireEvent.change(url, {
        target: { value: blog.url }
    });

    fireEvent.click(submit);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toBe(blog.title);
    expect(createBlog.mock.calls[0][1]).toBe(blog.author);
    expect(createBlog.mock.calls[0][2]).toBe(blog.url);
});

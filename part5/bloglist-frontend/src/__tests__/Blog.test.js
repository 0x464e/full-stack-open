import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Blog from '../components/Blog';
import { act } from 'react-dom/test-utils';

test('renders blog', async () => {
    const blog = {
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 0,
        user: {
            name: 'test user'
        }
    };

    const { container } = render(<Blog blog={blog} />);

    expect(container).toHaveTextContent('test title');
    expect(container).toHaveTextContent('test author');
    expect(container).not.toHaveTextContent('test url');
    expect(container).not.toHaveTextContent('test user');
    expect(container).not.toHaveTextContent('0 likes');
});

test('renders blog with details', () => {
    const blog = {
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 0,
        user: {
            name: 'test user'
        }
    };

    const { container } = render(<Blog blog={blog} />);
    const button = screen.getByText('view');
    act(() => button.click());

    expect(container).toHaveTextContent('test title');
    expect(container).toHaveTextContent('test author');
    expect(container).toHaveTextContent('test url');
    expect(container).toHaveTextContent('test user');
    expect(container).toHaveTextContent('0 likes');
});

test('clicking like button twice calls event handler twice', () => {
    const blog = {
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 0,
        user: {
            name: 'test user'
        }
    };

    const mockHandler = jest.fn();

    render(<Blog blog={blog} updateBlog={mockHandler} />);
    const button = screen.getByText('view');
    act(() => button.click());
    const likeButton = screen.getByText('like');
    act(() => likeButton.click());
    act(() => likeButton.click());

    expect(mockHandler.mock.calls).toHaveLength(2);
});

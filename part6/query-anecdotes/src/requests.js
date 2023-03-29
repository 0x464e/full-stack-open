import axios from 'axios';

export const getAnecdotes = () => axios.get('http://localhost:3001/anecdotes').then(response => {
    return response.data;
});

export const createAnecdote = (content) => axios.post('http://localhost:3001/anecdotes', { content, votes: 0 }).then(response => response.data);

export const updateAnecdote = (anecdote) => axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`, anecdote).then(response => response.data);

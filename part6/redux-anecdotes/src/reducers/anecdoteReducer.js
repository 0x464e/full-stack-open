import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        setAnecdotes: (state, action) => action.payload,
        appendAnecdote: (state, action) => state.concat(action.payload),
        modifyAnecdote: (state, action) => state.map(anecdote => anecdote.id === action.payload.id ? action.payload : anecdote)
    }
});

export const { appendAnecdote, setAnecdotes, modifyAnecdote } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll();
        dispatch(setAnecdotes(anecdotes));
    }
}

export const createAnecdote = (content) => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content);
        dispatch(appendAnecdote(newAnecdote));
    }
}

export const voteAnecdote = (id) => {
    return async (dispatch, getState) => {
        const anecdotes = getState().anecdotes;
        const anecdoteToVote = anecdotes.find(n => n.id === id);
        const votedAnecdote = {
            ...anecdoteToVote,
            votes: anecdoteToVote.votes + 1
        };
        await anecdoteService.update(id, votedAnecdote);
        dispatch(modifyAnecdote(votedAnecdote));
    }
}

export default anecdoteSlice.reducer;

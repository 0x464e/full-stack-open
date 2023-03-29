import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
    const anecdotes = useSelector(state =>
    {
        if (state.filter === '')
            return state.anecdotes;

        return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()));
    });

    const dispatch = useDispatch();

    const vote = (anecdote) => () => {
        dispatch(setNotification(`You voted '${anecdote.content}'`));
        dispatch(voteAnecdote(anecdote.id));
    }

    return (
        <div>
            {
                [...anecdotes].sort((a, b) => b.votes - a.votes)
                .map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnecdoteList;
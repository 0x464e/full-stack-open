import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAnecdotes, updateAnecdote } from './requests';
import NotificationContext from './NotificationContext';
import { useContext } from 'react';

const App = () => {
    const [, dispatch] = useContext(NotificationContext);
    const queryClient = useQueryClient();

    const updateAnecdoteMutation = useMutation(updateAnecdote, {
        onSuccess: () => {
            queryClient.invalidateQueries('anecdotes').then(() => {});
        }
    });

    const handleVote = (anecdote) => {
        updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
        dispatch({ type: 'SHOW', payload: `You voted for '${anecdote.content}'` });
        setTimeout(() => {
            dispatch({ type: 'CLEAR' });
        }, 5000);
    };

    const result = useQuery('anecdotes', getAnecdotes);

    if (result.isLoading)
        return (<div>Loading...</div>);

    const anecdotes = result.data;

    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification/>
            <AnecdoteForm/>

            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

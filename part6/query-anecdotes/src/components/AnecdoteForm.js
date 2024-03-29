import { useMutation, useQueryClient } from 'react-query';
import { createAnecdote } from '../requests';
import NotificationContext from '../NotificationContext';
import { useContext } from 'react';

const AnecdoteForm = () => {
    const [, dispatch] = useContext(NotificationContext);

    const queryClient = useQueryClient();

    const newAnecdoteMutation = useMutation(createAnecdote, {
        onSuccess: () => {
            queryClient.invalidateQueries('anecdotes').then(() => {});
        },
        onError: (error) => {
            dispatch({ type: 'SHOW', payload: 'too short anecdote, must have length 5 or more' });
            setTimeout(() => {
                dispatch({ type: 'CLEAR' });
            }, 5000);
        }
    });

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content);
    dispatch({ type: 'SHOW', payload: `You created '${content}'` });
    setTimeout(() => {
        dispatch({ type: 'CLEAR' });
    }, 5000);
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

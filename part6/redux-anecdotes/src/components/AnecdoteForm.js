import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';
import { clearNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const create = (event) => {
        event.preventDefault();
        dispatch(setNotification(`You created '${event.target.anecdote.value}'`));
        setTimeout(() => dispatch(clearNotification()), 5000);
        const content = event.target.anecdote.value;
        event.target.anecdote.value = '';
        dispatch(createAnecdote(content));
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={create}>
                <input name="anecdote" />
                <button>create</button>
            </form>
        </div>
    );
};

export default AnecdoteForm;
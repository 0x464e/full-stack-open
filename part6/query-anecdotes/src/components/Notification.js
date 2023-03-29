import NotificationContext from '../NotificationContext';

const { useContext } = require('react');

const Notification = () => {
    const [state] = useContext(NotificationContext);

    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 5
    };

    if (state)
        return (
            <div style={style}>
                {state}
            </div>
        );
};

export default Notification;

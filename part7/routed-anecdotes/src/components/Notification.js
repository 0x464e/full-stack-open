export const Notification = ({ notification }) => {
    const style = {
        border: 'solid',
        borderColor: 'red',
        padding: 10,
        borderWidth: 2
    };

    if (notification)
        return (
            <div style={style}>
                {notification}
            </div>
        );
};
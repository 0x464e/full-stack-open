const Notification = ({ notification }) => {
    if (notification === null)
        return null;

    return (
        <div className="notification"
            style={{ color: notification.color }}>
            {notification.message}
        </div>
    );
};

export default Notification;
import { createContext, useMemo, useReducer } from 'react';

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW':
            return action.payload;
        case 'CLEAR':
            return '';
        default:
            return state;
    }
}

const NotificationContext = createContext(undefined);

export const NotificationContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, '');

    const providerValue = useMemo(() => [state, dispatch], [state]);

    return (
        <NotificationContext.Provider value={providerValue}>
            {children}
        </NotificationContext.Provider>
    );
}

export default NotificationContext;

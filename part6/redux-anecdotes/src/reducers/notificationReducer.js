import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        updateNotification: (state, action) => action.payload,
        clearNotification: (state, action) => null
    }
});

export const { updateNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (notification) => {
    return async dispatch => {
        dispatch(updateNotification(notification));
        setTimeout(() => dispatch(clearNotification()), 5000);
    }
}

export default notificationSlice.reducer;
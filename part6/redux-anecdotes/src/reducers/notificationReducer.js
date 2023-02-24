import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action) => action.payload,
        clearNotification: (state, action) => null
    }
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
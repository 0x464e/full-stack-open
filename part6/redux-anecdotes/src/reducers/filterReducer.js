import { createSlice } from "@reduxjs/toolkit";

const initalState = '';

const filterSlice = createSlice({
    name: 'filter',
    initialState: initalState,
    reducers: {
        setFilter: (state, action) => action.payload
    }
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;

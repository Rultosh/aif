
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
    activeBar: number
}
const initialState: InitialState = {
    activeBar: 0,
}

const sideNavBarSlice = createSlice({
    name: 'sideNavBar',
    initialState,
    reducers: {
        updateNavIndex: (state, action: PayloadAction<any>) => {
            state.activeBar = action.payload;
        },
    },
    extraReducers: builder => {}
       
})

export default sideNavBarSlice.reducer
export const { updateNavIndex } = sideNavBarSlice.actions
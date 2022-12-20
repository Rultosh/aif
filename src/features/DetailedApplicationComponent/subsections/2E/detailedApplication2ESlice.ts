import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IDetailedApplication2E } from './IDetailedApplication2E';

const thunk : Thunk<IDetailedApplication2E> = new Thunk("detailedApplications", 'dueDeligences');
const initialState = thunk.initialState;

const detailedApplication2ESlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplication2ESlice.reducer
export const selectDetailedApplication2E = (state: RootState) => state.detailedApplication2E;
export const detailedApplication2EThunk = thunk;
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IDetailedApplication2J } from './IDetailedApplication2K';

const thunk : Thunk<IDetailedApplication2J> = new Thunk("detailedApplications", 'kycs');
const initialState = thunk.initialState;

const detailedApplication2JSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplication2JSlice.reducer
export const selectDetailedApplication2J = (state: RootState) => state.detailedApplication2J;
export const detailedApplication2JThunk = thunk;
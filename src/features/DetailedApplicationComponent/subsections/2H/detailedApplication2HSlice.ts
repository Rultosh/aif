import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IDetailedApplication2H } from './IDetailedApplication2H';

const thunk : Thunk<IDetailedApplication2H> = new Thunk("detailedApplications", 'ToBeComplete');
const initialState = thunk.initialState;

const detailedApplication2HSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplication2HSlice.reducer
export const selectDetailedApplication2H = (state: RootState) => state.detailedApplication2H;
export const detailedApplication2HThunk = thunk;
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IDetailedApplication2G } from './IDetailedApplication2G';

const thunk : Thunk<IDetailedApplication2G> = new Thunk("detailedApplications", 'investmentManagers');
const initialState = thunk.initialState;

const detailedApplication2GSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplication2GSlice.reducer
export const selectDetailedApplication2G = (state: RootState) => state.detailedApplication2G;
export const detailedApplication2GThunk = thunk;
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IDetailedApplication2D } from './IDetailedApplication2D';

const thunk : Thunk<IDetailedApplication2D> = new Thunk("detailedApplications", 'dealFlows');
const initialState = thunk.initialState;

const detailedApplication2DSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplication2DSlice.reducer
export const selectDetailedApplication2D = (state: RootState) => state.detailedApplication2D;
export const detailedApplication2DThunk = thunk;
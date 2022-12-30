import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IDetailedApplication2B } from './IDetailedApplication2B';

const thunk : Thunk<IDetailedApplication2B> = new Thunk("detailedApplications", 'fundRaisings');
const initialState = thunk.initialState;

const detailedApplication2BSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplication2BSlice.reducer
export const selectDetailedApplication2B = (state: RootState) => state.detailedApplication2B;
export const detailedApplication2BThunk = thunk;
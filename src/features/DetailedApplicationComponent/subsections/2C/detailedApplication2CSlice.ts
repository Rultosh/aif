import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IDetailedApplication2C } from './IDetailedApplication2C';

const thunk : Thunk<IDetailedApplication2C> = new Thunk("detailedApplications", 'invesmentAndDisinvestments');
const initialState = thunk.initialState;

const detailedApplication2CSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplication2CSlice.reducer
export const selectDetailedApplication2C = (state: RootState) => state.detailedApplication2C;
export const detailedApplication2CThunk = thunk;
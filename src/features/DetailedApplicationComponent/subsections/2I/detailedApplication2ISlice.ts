import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IDetailedApplication2I } from './IDetailedApplication2I';

const thunk : Thunk<IDetailedApplication2I> = new Thunk("detailedApplications", 'fundDocs');
const initialState = thunk.initialState;

const detailedApplication2ISlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplication2ISlice.reducer
export const selectDetailedApplication2I = (state: RootState) => state.detailedApplication2I;
export const detailedApplication2IThunk = thunk;
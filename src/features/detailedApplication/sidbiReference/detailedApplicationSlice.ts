import { createSlice } from '@reduxjs/toolkit'
import { IDetailedApplication } from './IDetailedApplication'
import { RootState } from '../../../app/store'
import { Thunk } from '../../../lib/api-wrappers/Thunk';

const thunk : Thunk<IDetailedApplication> = new Thunk(undefined, 'detailedApplications');
const initialState = thunk.initialState;

const detailedApplicationSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default detailedApplicationSlice.reducer
export const selectedDetailedApplications = (state: RootState) => state.detailedApplications;
export const detailedApplicationThunk = thunk;
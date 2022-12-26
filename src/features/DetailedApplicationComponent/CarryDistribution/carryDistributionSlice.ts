import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../app/store'
import { Thunk } from '../../../lib/api-wrappers/Thunk';
import { ICarryDistribution } from './ICarryDistribution';

const thunk : Thunk<ICarryDistribution> = new Thunk("detailedApplications", 'carryDistributions');
const initialState = thunk.initialState;

const carryDistributionSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default carryDistributionSlice.reducer
export const selectCarryDistribution = (state: RootState) => state.carryDistribution;
export const carryDistributionThunk = thunk;
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../app/store'
import { Thunk } from '../../../lib/api-wrappers/Thunk';
import { ICarryDistributionDetails } from './ICarryDistributionDetails';

const thunk : Thunk<ICarryDistributionDetails> = new Thunk("carryDistributions", 'details');
const initialState = thunk.initialState;

const carryDistributionDetailsSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default carryDistributionDetailsSlice.reducer
export const selectCarryDistributionDetails = (state: RootState) => state.carryDistributionDetails;
export const carryDistributionDetailsThunk = thunk;
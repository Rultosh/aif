import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../app/store'
import { Thunk } from '../../../../lib/api-wrappers/Thunk';
import { IFeaturesOfFunds } from './IFeaturesOfFund';

const thunk : Thunk<IFeaturesOfFunds> = new Thunk("detailedApplications", 'featureOfFunds');
const initialState = thunk.initialState;

const featureOfFundsSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default featureOfFundsSlice.reducer
export const selectFeatureOfFunds = (state: RootState) => state.featureOfFunds;
export const featureOfFundsThunk = thunk;
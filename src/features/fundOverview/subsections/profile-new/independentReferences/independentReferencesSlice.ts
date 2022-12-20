import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../../app/store'

import { IIndependentReferences } from "./IIndependentReferences";
import { Thunk } from '../../../../../lib/api-wrappers/Thunk'

const thunk : Thunk<IIndependentReferences> = new Thunk("teamMembers", 'independentReferences');
const initialState = thunk.initialState;

const independentReferencesSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default independentReferencesSlice.reducer
export const selectIndependentReferences = (state: RootState) => state.independentReferences;
export const independentReferencesThunk = thunk;
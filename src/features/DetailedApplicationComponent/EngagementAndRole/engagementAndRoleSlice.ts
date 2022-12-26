import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../app/store'
import { Thunk } from '../../../lib/api-wrappers/Thunk';
import { IEngagementAndRole } from './IEngagementAndRole';

const thunk : Thunk<IEngagementAndRole> = new Thunk("detailedApplications", 'signedDocs');
const initialState = thunk.initialState;

const engagementAndRoleSlice = createSlice({
  name: thunk.getEntityName(),
  initialState,
  reducers: {
    
  },
  extraReducers: builder => thunk.extraReducers(builder)
})

export default engagementAndRoleSlice.reducer
export const selectEngagementAndRole = (state: RootState) => state.engagementAndRole;
export const engagementAndRoleThunk = thunk;
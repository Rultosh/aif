import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActionWrapper } from '../../../../../lib/api-status/actionWrapper'
import { getError } from '../../../../../lib/api-status/errorHandler'
import { RootState } from '../../../../../app/store'
import { createTeamMember, deleteTeamMember, getAllTeamMembers, updateTeamMember } from './teamMemberApi'
import { FetchStatus, IStatus } from '../../../../../lib/api-status/IStatus'

import { defaultTeamMember, ITeamMember } from "./ITeamMember";

type ProfileState = {
    teamMembers: ITeamMember[]
    actionStatus: IStatus,
    allStatus: IStatus,
}
const initialState: ProfileState = {
  teamMembers: [],
  actionStatus: { fetchStatus: FetchStatus.IDLE},
  allStatus: { fetchStatus: FetchStatus.IDLE},
}

export const getAllTeamMembersAsnyc = createAsyncThunk(
  'getAllTeamMembers/all',
  async (args: ActionWrapper<number>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await getAllTeamMembers(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const createTeamMemberAsync = createAsyncThunk(
  'createTeamMember/create',
  async (args: ActionWrapper<ITeamMember>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await createTeamMember(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const updateTeamMemberAsync = createAsyncThunk(
  'updateTeamMember/create',
  async (args: ActionWrapper<ITeamMember>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await updateTeamMember(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const deleteTeamMemberAsync = createAsyncThunk(
  'deleteTeamMember/delete',
  async (args: ActionWrapper<ITeamMember>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await deleteTeamMember(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

const teamMemberSlice = createSlice({
  name: 'teamMemberSlice',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(getAllTeamMembersAsnyc.pending, state => {
      state.allStatus.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      getAllTeamMembersAsnyc.fulfilled,
      (state, action: PayloadAction<ITeamMember[]>) => {
        state.allStatus.fetchStatus = FetchStatus.IDLE;
        state.teamMembers = action.payload;
        console.log(state.teamMembers);
      }
    )
    .addCase(getAllTeamMembersAsnyc.rejected, (state, action) => {
      state.allStatus.fetchStatus = FetchStatus.FAILED;
    })
    .addCase(createTeamMemberAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      createTeamMemberAsync.fulfilled,
      (state, action: PayloadAction<ITeamMember[]>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
        state.teamMembers = action.payload;
      }
    )
    .addCase(createTeamMemberAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    .addCase(updateTeamMemberAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      updateTeamMemberAsync.fulfilled,
      (state, action: PayloadAction<ITeamMember[]>) => {
        console.log('update fetch status update')
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(updateTeamMemberAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    .addCase(deleteTeamMemberAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      deleteTeamMemberAsync.fulfilled,
      (state, action: PayloadAction<ITeamMember[]>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(deleteTeamMemberAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default teamMemberSlice.reducer
export const selectTeamMembers = (state: RootState) => state.teamMembers;
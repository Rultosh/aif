import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActionWrapper } from '../../../../../lib/api-status/actionWrapper'
import { getError } from '../../../../../lib/api-status/errorHandler'
import { RootState } from '../../../../../app/store'
import { createCompanyContactDetails, deleteCompanyContactDetails, getAllCompanyContactDetails, updateCompanyContactDetails } from './companyContactDetailsApi'
import { FetchStatus, IStatus } from '../../../../../lib/api-status/IStatus'

import { ICompanyContactDetails } from "./ICompanyContactDetails";
import { argv } from 'process'

type CompanyContactsState = {
    data: {
      [key : string]: {companyContacts: ICompanyContactDetails[] | undefined}
    },
    status: {
      [key: string]: {
        actionStatus: IStatus,
        allStatus: IStatus,
      }
    }
    
}
const initialState: CompanyContactsState = {
  data: {},
  status: {}
}

export const getAllCompanyContactDetailssAsnyc = createAsyncThunk(
  'getAllCompanyContactDetailss/all',
  async (args: ActionWrapper<number>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await getAllCompanyContactDetails(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const createCompanyContactDetailsAsync = createAsyncThunk(
  'createCompanyContactDetails/create',
  async (args: ActionWrapper<ICompanyContactDetails>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await createCompanyContactDetails(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const updateCompanyContactDetailsAsync = createAsyncThunk(
  'updateCompanyContactDetails/create',
  async (args: ActionWrapper<ICompanyContactDetails>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await updateCompanyContactDetails(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const deleteCompanyContactDetailsAsync = createAsyncThunk(
  'deleteCompanyContactDetails/delete',
  async (args: ActionWrapper<ICompanyContactDetails>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await deleteCompanyContactDetails(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

function setDefaultValues(state:CompanyContactsState, id:any) {
  if(!state.data[id])
  state.data[id] = {companyContacts: []}
  if(!state.status[id])
  state.status[id] = {actionStatus: {fetchStatus: FetchStatus.IDLE}, allStatus: {fetchStatus: FetchStatus.IDLE}}
}

const teamMemberSlice = createSlice({
  name: 'teamMemberSlice',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(getAllCompanyContactDetailssAsnyc.pending, (state, action) => {
        if(action.meta.arg.argument) {
          setDefaultValues(state, action.meta.arg.argument)
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.DOING;
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.DOING;
        }
    })
    .addCase(
      getAllCompanyContactDetailssAsnyc.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument) {
          setDefaultValues(state, action.meta.arg.argument)
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.IDLE;
          state.data[action.meta.arg.argument].companyContacts = action.payload;
        }
      }
    )
    .addCase(getAllCompanyContactDetailssAsnyc.rejected, (state, action) => {
      if(action.meta.arg.argument) {
        setDefaultValues(state, action.meta.arg.argument)
        state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(createCompanyContactDetailsAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      createCompanyContactDetailsAsync.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(createCompanyContactDetailsAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(updateCompanyContactDetailsAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      updateCompanyContactDetailsAsync.fulfilled,
      (state, action) => {
        console.log('update fetch status update')
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(updateCompanyContactDetailsAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(deleteCompanyContactDetailsAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      deleteCompanyContactDetailsAsync.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(deleteCompanyContactDetailsAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
  }
})

export default teamMemberSlice.reducer
export const selectCompanyContactDetails = (state: RootState) => state.companyContacts;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActionWrapper } from '../../../../../lib/api-status/actionWrapper'
import { getError } from '../../../../../lib/api-status/errorHandler'
import { RootState } from '../../../../../app/store'
import { createInvestmentResponsibleAsLead, deleteInvestmentResponsibleAsLead, getAllInvestmentResponsibleAsLeads, updateInvestmentResponsibleAsLead } from './investmentResponsibleAsLeadApi'
import { FetchStatus, IStatus } from '../../../../../lib/api-status/IStatus'

import { IInvestmentResponsibleAsLead } from "./IInvestmentResponsibleAsLead";
import { argv } from 'process'

type InvestmentAsLeadState = {
    data: {
      [key : string]: {investmentsAsLead: IInvestmentResponsibleAsLead[] | undefined}
    },
    status: {
      [key: string]: {
        actionStatus: IStatus,
        allStatus: IStatus,
      }
    }
    
}
const initialState: InvestmentAsLeadState = {
  data: {},
  status: {}
}

export const getAllInvestmentResponsibleAsLeadsAsnyc = createAsyncThunk(
  'getAllInvestmentResponsibleAsLeads/all',
  async (args: ActionWrapper<number>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await getAllInvestmentResponsibleAsLeads(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const createInvestmentResponsibleAsLeadAsync = createAsyncThunk(
  'createInvestmentResponsibleAsLead/create',
  async (args: ActionWrapper<IInvestmentResponsibleAsLead>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await createInvestmentResponsibleAsLead(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const updateInvestmentResponsibleAsLeadAsync = createAsyncThunk(
  'updateInvestmentResponsibleAsLead/create',
  async (args: ActionWrapper<IInvestmentResponsibleAsLead>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await updateInvestmentResponsibleAsLead(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const deleteInvestmentResponsibleAsLeadAsync = createAsyncThunk(
  'deleteInvestmentResponsibleAsLead/delete',
  async (args: ActionWrapper<IInvestmentResponsibleAsLead>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await deleteInvestmentResponsibleAsLead(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

function setDefaultValues(state:InvestmentAsLeadState, id:any) {
  if(!state.data[id])
  state.data[id] = {investmentsAsLead: []}
  if(!state.status[id])
  state.status[id] = {actionStatus: {fetchStatus: FetchStatus.IDLE}, allStatus: {fetchStatus: FetchStatus.IDLE}}
}

const teamMemberSlice = createSlice({
  name: 'teamMemberSlice',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(getAllInvestmentResponsibleAsLeadsAsnyc.pending, (state, action) => {
        if(action.meta.arg.argument) {
          setDefaultValues(state, action.meta.arg.argument)
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.DOING;
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.DOING;
        }
    })
    .addCase(
      getAllInvestmentResponsibleAsLeadsAsnyc.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument) {
          setDefaultValues(state, action.meta.arg.argument)
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.IDLE;
          state.data[action.meta.arg.argument].investmentsAsLead = action.payload;
        }
      }
    )
    .addCase(getAllInvestmentResponsibleAsLeadsAsnyc.rejected, (state, action) => {
      if(action.meta.arg.argument) {
        setDefaultValues(state, action.meta.arg.argument)
        state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(createInvestmentResponsibleAsLeadAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      createInvestmentResponsibleAsLeadAsync.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(createInvestmentResponsibleAsLeadAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(updateInvestmentResponsibleAsLeadAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      updateInvestmentResponsibleAsLeadAsync.fulfilled,
      (state, action) => {
        console.log('update fetch status update')
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(updateInvestmentResponsibleAsLeadAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(deleteInvestmentResponsibleAsLeadAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      deleteInvestmentResponsibleAsLeadAsync.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(deleteInvestmentResponsibleAsLeadAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
  }
})

export default teamMemberSlice.reducer
export const selectInvestmentResponsibleAsLeads = (state: RootState) => state.investmentsAsLead;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActionWrapper } from '../../../../../lib/api-status/actionWrapper'
import { getError } from '../../../../../lib/api-status/errorHandler'
import { RootState } from '../../../../../app/store'
import { createInvestmentResponsibleAsNonLead, deleteInvestmentResponsibleAsNonLead, getAllInvestmentResponsibleAsNonLeads, updateInvestmentResponsibleAsNonLead } from './investmentResponsibleAsNonLeadApi'
import { FetchStatus, IStatus } from '../../../../../lib/api-status/IStatus'

import { IInvestmentResponsibleAsNonLead } from "./IInvestmentResponsibleAsNonLead";
import { argv } from 'process'

type InvestmentAsNonLeadState = {
    data: {
      [key : string]: {investmentsAsNonLead: IInvestmentResponsibleAsNonLead[] | undefined}
    },
    status: {
      [key: string]: {
        actionStatus: IStatus,
        allStatus: IStatus,
      }
    }
    
}
const initialState: InvestmentAsNonLeadState = {
  data: {},
  status: {}
}

export const getAllInvestmentResponsibleAsNonLeadsAsnyc = createAsyncThunk(
  'getAllInvestmentResponsibleAsNonLeads/all',
  async (args: ActionWrapper<number>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await getAllInvestmentResponsibleAsNonLeads(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const createInvestmentResponsibleAsNonLeadAsync = createAsyncThunk(
  'createInvestmentResponsibleAsNonLead/create',
  async (args: ActionWrapper<IInvestmentResponsibleAsNonLead>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await createInvestmentResponsibleAsNonLead(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const updateInvestmentResponsibleAsNonLeadAsync = createAsyncThunk(
  'updateInvestmentResponsibleAsNonLead/create',
  async (args: ActionWrapper<IInvestmentResponsibleAsNonLead>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await updateInvestmentResponsibleAsNonLead(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const deleteInvestmentResponsibleAsNonLeadAsync = createAsyncThunk(
  'deleteInvestmentResponsibleAsNonLead/delete',
  async (args: ActionWrapper<IInvestmentResponsibleAsNonLead>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await deleteInvestmentResponsibleAsNonLead(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

function setDefaultValues(state:InvestmentAsNonLeadState, id:any) {
  if(!state.data[id])
  state.data[id] = {investmentsAsNonLead: []}
  if(!state.status[id])
  state.status[id] = {actionStatus: {fetchStatus: FetchStatus.IDLE}, allStatus: {fetchStatus: FetchStatus.IDLE}}
}

const teamMemberSlice = createSlice({
  name: 'teamMemberSlice',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(getAllInvestmentResponsibleAsNonLeadsAsnyc.pending, (state, action) => {
        if(action.meta.arg.argument) {
          setDefaultValues(state, action.meta.arg.argument)
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.DOING;
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.DOING;
        }
    })
    .addCase(
      getAllInvestmentResponsibleAsNonLeadsAsnyc.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument) {
          setDefaultValues(state, action.meta.arg.argument)
          state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.IDLE;
          state.data[action.meta.arg.argument].investmentsAsNonLead = action.payload;
        }
      }
    )
    .addCase(getAllInvestmentResponsibleAsNonLeadsAsnyc.rejected, (state, action) => {
      if(action.meta.arg.argument) {
        setDefaultValues(state, action.meta.arg.argument)
        state.status[action.meta.arg.argument].allStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(createInvestmentResponsibleAsNonLeadAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      createInvestmentResponsibleAsNonLeadAsync.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(createInvestmentResponsibleAsNonLeadAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(updateInvestmentResponsibleAsNonLeadAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      updateInvestmentResponsibleAsNonLeadAsync.fulfilled,
      (state, action) => {
        console.log('update fetch status update')
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(updateInvestmentResponsibleAsNonLeadAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
    .addCase(deleteInvestmentResponsibleAsNonLeadAsync.pending, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.DOING;
      }
    })
    .addCase(
      deleteInvestmentResponsibleAsNonLeadAsync.fulfilled,
      (state, action) => {
        if(action.meta.arg.argument?.teamMemberId) {
          setDefaultValues(state, action.meta.arg.argument.teamMemberId)
          state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.IDLE;
        }
      }
    )
    .addCase(deleteInvestmentResponsibleAsNonLeadAsync.rejected, (state, action) => {
      if(action.meta.arg.argument?.teamMemberId) {
        setDefaultValues(state, action.meta.arg.argument.teamMemberId)
        state.status[action.meta.arg.argument.teamMemberId].actionStatus.fetchStatus = FetchStatus.FAILED;
      }
    })
  }
})

export default teamMemberSlice.reducer
export const selectInvestmentResponsibleAsNonLeads = (state: RootState) => state.investmentsAsNonLead;
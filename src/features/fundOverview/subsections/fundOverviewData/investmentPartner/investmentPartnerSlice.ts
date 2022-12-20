
import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import { ActionWrapper } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentPartner } from './IInvestmentPartner'
import { createInvestmentTeamsPartnerLevel, deleteInvestmentTeamPartnerLevel, fetchInvestmentTeamsPartnerLevel, updateInvestmentTeamsPartnerLevel } from './investmentPartnerApi'
import { getError } from '../../../../../lib/api-status/errorHandler'
import { FetchStatus, IStatus } from '../../../../../lib/api-status/IStatus'
import { RootState } from '../../../../../app/store'

type InitialState = {
  tableData: any
  investmentPartners: IInvestmentPartner[]
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  tableData: [],
  investmentPartners: [],
  status: {fetchStatus: FetchStatus.IDLE},
  actionStatus: {fetchStatus: FetchStatus.IDLE}
}


// Generates pending, fulfilled and rejected action types
export const submitResults = createAsyncThunk('investmentPartner/submitResults', (rowData: any) => {
  console.log("Inside submitResults of investment slice ");
  console.log("Inside submitResults", rowData);
  console.log("tempdata", rowData);
  return axios
    .post('http://localhost:5000/tableData', rowData)
    .then(response => response.data.value)
})

export const fetchTableData = createAsyncThunk(
  'investmentPartner/fetchTableData', () => {
  console.log("Inside fetchResults")
  return axios
    .get('http://localhost:5000/tableData')
    .then(response => response.data)
})

export const fetchInvestmentTeamsPartnerLevelAsync = createAsyncThunk(
  'fetchInvestmentTeamsPartnerLevelAsync/getAll',
  async (args: ActionWrapper<Number | undefined>, {rejectWithValue}) => { 
    console.log("fetchInvestmentTeamsPartnerLevelAsync called...")
    try {
      if(args.argument) {
        const response = await fetchInvestmentTeamsPartnerLevel(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const createInvestmentTeamsPartnerLevelAsync = createAsyncThunk(
  'createInvestmentTeamsPartnerLevelAsync/create',
  async (args: ActionWrapper<IInvestmentPartner>, {rejectWithValue}) => { 
    console.log("updatePrelimApplicationAsync called...")
    try {
      if(args.argument) {
        const response = await createInvestmentTeamsPartnerLevel(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const updateInvestmentTeamsPartnerLevelAsync = createAsyncThunk(
  'updateInvestmentTeamsPartnerLevelAsync/create',
  async (args: ActionWrapper<IInvestmentPartner>, {rejectWithValue}) => { 
    console.log("updatePrelimApplicationAsync called...")
    try {
      if(args.argument) {
        const response = await updateInvestmentTeamsPartnerLevel(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const deleteInvestmentTeamPartnerLevelAsync = createAsyncThunk(
  'deleteInvestmentTeamsPartnerLevelAsync/delete',
  async (args: ActionWrapper<IInvestmentPartner>, {rejectWithValue}) => { 
    console.log("deleteInvestmentTeamsPartnerLevelAsync called...")
    try {
      if(args.argument) {
        const response = await deleteInvestmentTeamPartnerLevel(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)



const investmentPartnerSlice = createSlice({
  name: 'investmentPartner',
  initialState,
  reducers: {
    saveFormData: (state, action: PayloadAction<any>) => {

      state.tableData = action.payload;
      console.log("From Save:", state.tableData)
      //state.formdata[action.payload.id] = action.payload.value;
      //console.log("logging after slice-state - length",state.formdata.length)
    },

  },
  extraReducers: builder => {
    builder.addCase(fetchTableData.pending, state => {

    })
    builder.addCase(
      fetchTableData.fulfilled,
      (state, action: PayloadAction<any>) => {
        console.log("Inside the fulfil case", action)
        state.tableData = action.payload
      }
    )
    builder.addCase(fetchTableData.rejected, (state, action) => {

    })
    builder.addCase(fetchInvestmentTeamsPartnerLevelAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      fetchInvestmentTeamsPartnerLevelAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentPartner[]>) => {
        state.investmentPartners = action.payload
        state.status.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(fetchInvestmentTeamsPartnerLevelAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(updateInvestmentTeamsPartnerLevelAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      updateInvestmentTeamsPartnerLevelAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentPartner>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(updateInvestmentTeamsPartnerLevelAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(createInvestmentTeamsPartnerLevelAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      createInvestmentTeamsPartnerLevelAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentPartner>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(createInvestmentTeamsPartnerLevelAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(deleteInvestmentTeamPartnerLevelAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      deleteInvestmentTeamPartnerLevelAsync.fulfilled,
      (state, action: PayloadAction<String>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(deleteInvestmentTeamPartnerLevelAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default investmentPartnerSlice.reducer
export const { saveFormData } = investmentPartnerSlice.actions

export const selectInvestmentPartners = (state: RootState) => state.investmentPartner;

import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import { ActionWrapper } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentAssociate } from './IInvestmentAssociate'
import { createInvestmentTeamsAssociateLevel, deleteInvestmentTeamsAssociateLevel, fetchInvestmentTeamsAssociateLevel, updateInvestmentTeamsAssociateLevel } from './investmentAssociateApi'
import { getError } from '../../../../../lib/api-status/errorHandler'
import { FetchStatus, IStatus } from '../../../../../lib/api-status/IStatus'
import { RootState } from '../../../../../app/store'

type InitialState = {
  tableData: any
  investmentAssociates: IInvestmentAssociate[]
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  tableData: [],
  investmentAssociates: [],
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

export const fetchInvestmentTeamsAssociateLevelAsync = createAsyncThunk(
  'fetchInvestmentTeamsAssociateLevelAsync/getAll',
  async (args: ActionWrapper<Number | undefined>, {rejectWithValue}) => { 
    console.log("fetchInvestmentTeamsAssociateLevelAsync called...")
    try {
      if(args.argument) {
        const response = await fetchInvestmentTeamsAssociateLevel(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const createInvestmentTeamsAssociateLevelAsync = createAsyncThunk(
  'createInvestmentTeamsAssociateLevelAsync/create',
  async (args: ActionWrapper<IInvestmentAssociate>, {rejectWithValue}) => { 
    console.log("updatePrelimApplicationAsync called...")
    try {
      if(args.argument) {
        const response = await createInvestmentTeamsAssociateLevel(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const updateInvestmentTeamsAssociateLevelAsync = createAsyncThunk(
  'updateInvestmentTeamsAssociateLevelAsync/create',
  async (args: ActionWrapper<IInvestmentAssociate>, {rejectWithValue}) => { 
    console.log("updatePrelimApplicationAsync called...")
    try {
      if(args.argument) {
        const response = await updateInvestmentTeamsAssociateLevel(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const deleteInvestmentTeamsAssociateLevelAsync = createAsyncThunk(
  'deleteInvestmentTeamsAssociateLevelAsync/delete',
  async (args: ActionWrapper<IInvestmentAssociate>, {rejectWithValue}) => { 
    console.log("deleteInvestmentTeamsAssociateLevelAsync called...")
    try {
      if(args.argument) {
        const response = await deleteInvestmentTeamsAssociateLevel(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)



const investmentAssociateSlice = createSlice({
  name: 'investmentAssociate',
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
    builder.addCase(fetchInvestmentTeamsAssociateLevelAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      fetchInvestmentTeamsAssociateLevelAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentAssociate[]>) => {
        state.investmentAssociates = action.payload
        state.status.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(fetchInvestmentTeamsAssociateLevelAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(updateInvestmentTeamsAssociateLevelAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      updateInvestmentTeamsAssociateLevelAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentAssociate>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(updateInvestmentTeamsAssociateLevelAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(createInvestmentTeamsAssociateLevelAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      createInvestmentTeamsAssociateLevelAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentAssociate>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(createInvestmentTeamsAssociateLevelAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(deleteInvestmentTeamsAssociateLevelAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      deleteInvestmentTeamsAssociateLevelAsync.fulfilled,
      (state, action: PayloadAction<String>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(deleteInvestmentTeamsAssociateLevelAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default investmentAssociateSlice.reducer
export const { saveFormData } = investmentAssociateSlice.actions

export const selectInvestmentAssociate = (state: RootState) => state.investmentAssociate;
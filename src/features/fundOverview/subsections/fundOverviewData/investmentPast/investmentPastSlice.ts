
import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import { ActionWrapper } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentPast } from './IInvestmentPast'
import { createInvestmentPast, deleteInvestmentPast, fetchInvestmentPast, updateInvestmentPast } from './investmentPastApi'
import { getError } from '../../../../../lib/api-status/errorHandler'
import { FetchStatus, IStatus } from '../../../../../lib/api-status/IStatus'
import { RootState } from '../../../../../app/store'

type InitialState = {
  tableData: any
  investmentPasts: IInvestmentPast[]
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  tableData: [],
  investmentPasts: [],
  status: {fetchStatus: FetchStatus.IDLE},
  actionStatus: {fetchStatus: FetchStatus.IDLE}
}



export const fetchInvestmentPastAsync = createAsyncThunk(
  'fetchInvestmentPastAsync/getAll',
  async (args: ActionWrapper<Number | undefined>, {rejectWithValue}) => { 
    console.log("fetchInvestmentPastAsync called...")
    try {
      if(args.argument) {
        const response = await fetchInvestmentPast(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const createInvestmentPastAsync = createAsyncThunk(
  'createInvestmentPastAsync/create',
  async (args: ActionWrapper<IInvestmentPast>, {rejectWithValue}) => { 
    console.log("createInvestmentPastAsync called...")
    try {
      if(args.argument) {
        const response = await createInvestmentPast(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const updateInvestmentPastAsync = createAsyncThunk(
  'updateInvestmentPastAsync/create',
  async (args: ActionWrapper<IInvestmentPast>, {rejectWithValue}) => { 
    console.log("updateInvestmentPastAsync called...")
    try {
      if(args.argument) {
        const response = await updateInvestmentPast(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const deleteInvestmentPastAsync = createAsyncThunk(
  'deleteInvestmentPastAsync/delete',
  async (args: ActionWrapper<IInvestmentPast>, {rejectWithValue}) => { 
    console.log("deleteInvestmentPastAsync called...")
    try {
      if(args.argument) {
        const response = await deleteInvestmentPast(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)



const investmentPastSlice = createSlice({
  name: 'investmentPast',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchInvestmentPastAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      fetchInvestmentPastAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentPast[]>) => {
        state.investmentPasts = action.payload
        state.status.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(fetchInvestmentPastAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(updateInvestmentPastAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      updateInvestmentPastAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentPast>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(updateInvestmentPastAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(createInvestmentPastAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      createInvestmentPastAsync.fulfilled,
      (state, action: PayloadAction<IInvestmentPast>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(createInvestmentPastAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(deleteInvestmentPastAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      deleteInvestmentPastAsync.fulfilled,
      (state, action: PayloadAction<String>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(deleteInvestmentPastAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default investmentPastSlice.reducer

export const selectInvestmentPast = (state: RootState) => state.investmentPast;
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import { IQueryResolution } from './IQueryResolution';
import {getQuery, postQuery} from './queryResolutionApi'
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'


type InitialState = {
  query: IQueryResolution,
  queries: IQueryResolution[],
  response: string | undefined,
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  query: {} as IQueryResolution,
  queries: [],
  response: undefined,
  status: {fetchStatus: FetchStatus.IDLE},
  actionStatus: {fetchStatus: FetchStatus.IDLE}
}

export const fetchQuriesAsync = createAsyncThunk(
  'fetchQuriesAsync/getAll',
  async (args: ActionWrapper<string | undefined>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await getQuery(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)



export const postQuriesAsync = createAsyncThunk(
  'postQuriesAsync/create',
  async (args: ActionWrapper<IQueryResolution>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await postQuery(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

const queryResolutionSlice = createSlice({
  name: 'queryResolution',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(fetchQuriesAsync.pending, state => {
     
    })
    .addCase(
      fetchQuriesAsync.fulfilled,
      (state, action: PayloadAction<IQueryResolution[]>) => {
        state.queries = action.payload;
        state.response = undefined;
        state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(fetchQuriesAsync.rejected, (state, action) => {
     
    })
    .addCase(postQuriesAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      postQuriesAsync.fulfilled,
      (state, action: PayloadAction<IQueryResolution>) => {
        state.query= action.payload;
        state.response = undefined;
        state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(postQuriesAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default queryResolutionSlice.reducer
// export const { saveFormData } = fundOverviewDataSlice.actions

export const selectqueryResolution = (state: RootState) => state.queryResolution;
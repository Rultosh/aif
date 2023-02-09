import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import { IHistory } from './IHistory';
import {getHistory} from './historyApi'
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'


type InitialState = {
  history: IHistory,
  queries: IHistory[],
  response: string | undefined,
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  history: {} as IHistory,
  queries: [],
  response: undefined,
  status: {fetchStatus: FetchStatus.IDLE},
  actionStatus: {fetchStatus: FetchStatus.IDLE}
}

export const fetchHistoryAsync = createAsyncThunk(
  'fetchHistoryAsync/getAll',
  async (args: ActionWrapper<string | undefined>, {rejectWithValue}) => { 
    console.log("fetchHistoryAsync called...")
    try {
      if(args.argument) {
        const response = await getHistory(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(fetchHistoryAsync.pending, state => {
     
    })
    .addCase(
      fetchHistoryAsync.fulfilled,
      (state, action: PayloadAction<IHistory[]>) => {
        state.queries = action.payload;
        state.response = undefined;
        state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(fetchHistoryAsync.rejected, (state, action) => {
     
    })
  }
})

export default historySlice.reducer
// export const { saveFormData } = fundOverviewDataSlice.actions

export const selecthistory = (state: RootState) => state.history;
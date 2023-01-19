import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'
import { setPassword } from './forgotPasswordApi'
import { IForgotPassword } from "./IForgotPassword"

type InitialState = {
  response: string | undefined,
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  response: undefined,
  status: { fetchStatus: FetchStatus.IDLE },
  actionStatus: { fetchStatus: FetchStatus.IDLE }
}

export const setUserPasswordAsync = createAsyncThunk(
  'setUserPasswordAsync/create',
  async (args: ActionWrapper<IForgotPassword>, { rejectWithValue }) => {
    console.log("setUserPasswordAsync called...")
    try {
      if (args.argument) {
        const response = await setPassword(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)


const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(setUserPasswordAsync.pending, state => {

    })
      .addCase(
        setUserPasswordAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          console.log(action.payload);
          state.response = action.payload;
          state.status.fetchStatus = FetchStatus.IDLE;
        }
      )
      .addCase(setUserPasswordAsync.rejected, (state, action) => {
        state.response = 'Error in signup';
      })
  }
})
export default forgotPasswordSlice.reducer
export const selectedforgotPassword = (state: RootState) => state.forgotPassword;

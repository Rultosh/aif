import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'
import { setPassword, resetForgotPassword, changePassword } from './forgotPasswordApi'
import { IForgotPassword } from "./IForgotPassword"
import { IResetPassword } from "../resetPassword/IResetPassword"
import {IChangePassword} from '../changePassword/IChangePassword'

type InitialState = {
  response: string | undefined,
  response_resetPassword: string | undefined,
  response_changePassword: string | undefined,
  status: IStatus,
  actionStatus: IStatus
}
const initialState: InitialState = {
  response: undefined,
  response_resetPassword: undefined,
  response_changePassword: undefined,
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


export const resetUserPasswordAsync = createAsyncThunk(
  'resetUserPasswordAsync/create',
  async (args: ActionWrapper<IResetPassword>, { rejectWithValue }) => {
    console.log("setUserPasswordAsync called...")
    try {
      if (args.argument) {
        const response = await resetForgotPassword(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const changeUserPasswordAsync = createAsyncThunk(
  'changeUserPasswordAsync/create',
  async (args: ActionWrapper<IChangePassword>, { rejectWithValue }) => {
    console.log("setUserPasswordAsync called...")
    try {
      if (args.argument) {
        const response = await changePassword(args.argument);
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
      .addCase(setUserPasswordAsync.rejected, (state, action:any) => {
        state.response = action.payload?.message;
        state.status.fetchStatus = FetchStatus.FAILED;
      })
      .addCase(resetUserPasswordAsync.pending, state => {

      })
        .addCase(
          resetUserPasswordAsync.fulfilled,
          (state, action: PayloadAction<string>) => {
            console.log(action.payload);
            state.response_resetPassword = action.payload;
            state.status.fetchStatus = FetchStatus.IDLE;
          }
        )
        .addCase(resetUserPasswordAsync.rejected, (state, action:any) => {
          state.response_resetPassword = action.payload?.message;
          state.status.fetchStatus = FetchStatus.FAILED;
        })
        .addCase(changeUserPasswordAsync.pending, state => {

        })
          .addCase(
            changeUserPasswordAsync.fulfilled,
            (state, action: PayloadAction<string>) => {
              console.log(action.payload);
              state.response_changePassword = action.payload;
              state.status.fetchStatus = FetchStatus.IDLE;
            }
          )
          .addCase(changeUserPasswordAsync.rejected, (state, action:any) => {
            state.response_changePassword = action.payload?.message;
            state.status.fetchStatus = FetchStatus.FAILED;
          })
        
  }
})
export default forgotPasswordSlice.reducer
export const selectedforgotPassword = (state: RootState) => state.forgotPassword;

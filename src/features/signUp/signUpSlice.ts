import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import {IUser, IUserApprove} from "../admin/IUser"
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'
import {signupUser} from './signupApi'
import { ISignup } from "./ISignup"

type InitialState = {
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  status: {fetchStatus: FetchStatus.IDLE},
  actionStatus: {fetchStatus: FetchStatus.IDLE}
}

export const signupUsersAsync = createAsyncThunk(
  'signupUsersAsync/create',
  async (args: ActionWrapper<ISignup>, {rejectWithValue}) => { 
    console.log("fetchContributorDetailsAsync called...")
    try {
      if(args.argument) {
        const response = await signupUser(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)


  const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
      
    },
    extraReducers: builder => {
      builder.addCase(signupUsersAsync.pending, state => {
       
      })
      .addCase(
        signupUsersAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          console.log(action.payload);
          state.status.fetchStatus = FetchStatus.IDLE;
        }
      )
      .addCase(signupUsersAsync.rejected, (state, action) => {
       
      })
    }
  })
export default signupSlice.reducer
export const selectedSignup = (state: RootState) => state.signup;

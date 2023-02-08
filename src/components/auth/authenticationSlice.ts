import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import { authenticate } from "./authenticationApi"
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'

type InitialState = {
    token: String | undefined,
    response: string | undefined,
    status: IStatus,
    actionStatus: IStatus
}
const initialState: InitialState = {
    token: undefined,
    response: undefined,
    status: { fetchStatus: FetchStatus.IDLE },
    actionStatus: { fetchStatus: FetchStatus.IDLE }
}

export interface ILoginRequest {
    username: String | undefined,
    password: String | undefined
}

export const defaultLoginRequest = {
    username: undefined,
    password: undefined
}

interface ILoginResponse {
    currentUser: String
}

export const authenticateThunk = createAsyncThunk(
  'auth/authenticate',
  //First argument of void is needed to inject rejectWithValue
  async (args: ActionWrapper<ILoginRequest>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await authenticate(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

const authticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(authenticateThunk.pending, state => {
     
    })
    .addCase(
        authenticateThunk.fulfilled,
      (state, action: PayloadAction<ILoginResponse>) => {
        console.log(action.payload);
        state.token = action.payload.currentUser;
        console.log(JSON.stringify(state));
        state.response = undefined;
        localStorage.setItem('token', String(state.token));
      }
    )
    .addCase(authenticateThunk.rejected, (state, action: any) => {
      let errStr = "unknown error. please contact support"
      const errOut = "Invalid Username / Password entered. Try again!"
      state.response = action.payload?.message ? action.payload?.message.toLowerCase() == errStr ? errOut : action.payload?.message: "Error Contact Support";
      state.status.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default authticationSlice.reducer
// export const { saveFormData } = fundOverviewDataSlice.actions

export const selectAuthenticatedUser = (state: RootState) => state.auth;
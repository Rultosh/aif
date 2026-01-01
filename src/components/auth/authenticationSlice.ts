import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import { authenticate } from "./authenticationApi"
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'
import { Password } from "@mui/icons-material"

type Password = {
    ciphertext: String | undefined,
    salt: String | undefined,
    iv: String | undefined,
}

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
    password: String | undefined,
    passwordWithSaltAndIv: Password | undefined,
    captchaResponse: String | undefined,
}

export const defaultLoginRequest = {
    username: undefined,
    passwordWithSaltAndIv: undefined,
    password: undefined,
    captchaResponse: undefined,
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
    clearErrorMessage:  (state) => {
      state.status.fetchStatus = FetchStatus.IDLE;
    },
    setErrorMessage:  (state, action: PayloadAction<string>) => {
      state.response = action.payload
      state.status.fetchStatus = FetchStatus.FAILED
    }
  },
  extraReducers: builder => {
    builder.addCase(authenticateThunk.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
        authenticateThunk.fulfilled,
      (state, action: PayloadAction<ILoginResponse>) => {
        console.log(action.payload);
        state.token = action.payload.currentUser;
        console.log(JSON.stringify(state));
        state.response = undefined;
        localStorage.setItem('token', String(state.token));
        state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(authenticateThunk.rejected, (state, action: any) => {
      // let errStr = "unknown error. please contact support"
      // const errOut = "Invalid Username / Password entered. Try again!"
      // state.response = action.payload?.message ? action.payload?.message.toLowerCase() == errStr ? errOut : action.payload?.message: "Error Contact Support";
      console.log(action.payload);
      state.response = action.payload.message;
      state.status.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default authticationSlice.reducer
export const { setErrorMessage, clearErrorMessage } = authticationSlice.actions

export const selectAuthenticatedUser = (state: RootState) => state.auth;
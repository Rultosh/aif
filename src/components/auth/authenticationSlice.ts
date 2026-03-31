import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import { authenticate, verifyMfa } from "./authenticationApi"
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'
import { Password } from "@mui/icons-material"

type Password = {
    ciphertext: String | undefined,
    salt: String | undefined,
    iv: String | undefined,
}

export type MfaPendingState = {
    challengeId: string
    maskedEmail?: string | null
    expiresInSeconds?: number | null
}

type InitialState = {
    token: String | undefined,
    response: string | undefined,
    status: IStatus,
    actionStatus: IStatus,
    mfaPending: MfaPendingState | undefined,
}
const initialState: InitialState = {
    token: undefined,
    response: undefined,
    status: { fetchStatus: FetchStatus.IDLE },
    actionStatus: { fetchStatus: FetchStatus.IDLE },
    mfaPending: undefined,
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

export interface ILoginResponse {
    mfaRequired?: boolean
    currentUser?: string
    challengeId?: string | null
    expiresInSeconds?: number | null
    maskedEmail?: string | null
    refreshToken?: string | null
}

interface IMfaVerifyResponse {
    currentUser: string
    refreshToken?: string | null
}

export const authenticateThunk = createAsyncThunk(
  'auth/authenticate',
  //First argument of void is needed to inject rejectWithValue
  async (args: ActionWrapper<ILoginRequest>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await authenticate(args.argument);
        return response.data as ILoginResponse;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const verifyMfaThunk = createAsyncThunk(
  'auth/verifyMfa',
  async (args: ActionWrapper<{ challengeId: string; otp: string }>, { rejectWithValue }) => {
    try {
      if (!args.argument) {
        return rejectWithValue({ message: 'Missing verification data' });
      }
      const response = await verifyMfa(args.argument);
      return response.data as IMfaVerifyResponse;
    } catch (reason) {
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
    clearMfaPending: (state) => {
      state.mfaPending = undefined;
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
      (state, action: PayloadAction<ILoginResponse | undefined>) => {
        const payload = action.payload;
        console.log(payload);
        if (payload?.mfaRequired === true && payload.challengeId) {
          state.mfaPending = {
            challengeId: payload.challengeId,
            maskedEmail: payload.maskedEmail,
            expiresInSeconds: payload.expiresInSeconds,
          };
          state.response = undefined;
          state.status.fetchStatus = FetchStatus.IDLE;
          return;
        }
        if (payload?.currentUser) {
          state.token = payload.currentUser;
          state.mfaPending = undefined;
          console.log(JSON.stringify(state));
          state.response = undefined;
          localStorage.setItem('token', String(state.token));
          if (payload.refreshToken) {
            localStorage.setItem('refreshToken', String(payload.refreshToken));
          }
        }
        state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(verifyMfaThunk.pending, (state) => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    .addCase(verifyMfaThunk.fulfilled, (state, action: PayloadAction<IMfaVerifyResponse | undefined>) => {
      const token = action.payload?.currentUser;
      if (token) {
        state.token = token;
        state.mfaPending = undefined;
        state.response = undefined;
        localStorage.setItem('token', String(state.token));
        const refresh = action.payload?.refreshToken;
        if (refresh) {
          localStorage.setItem('refreshToken', String(refresh));
        }
      }
      state.status.fetchStatus = FetchStatus.IDLE;
    })
    .addCase(verifyMfaThunk.rejected, (state, action: any) => {
      state.response = action.payload?.message;
      state.status.fetchStatus = FetchStatus.FAILED;
    })
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
export const { setErrorMessage, clearErrorMessage, clearMfaPending } = authticationSlice.actions

export const selectAuthenticatedUser = (state: RootState) => state.auth;
export const selectMfaPending = (state: RootState) => state.auth.mfaPending;
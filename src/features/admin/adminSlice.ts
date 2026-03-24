import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ActionWrapper } from "../../lib/api-status/actionWrapper"
import { getError } from "../../lib/api-status/errorHandler"
import {IUser, IUserApprove} from "./IUser"
import {fetchUsers, approveUser, whoAmI, patchUserOtpRequired, deleteUser} from './adminApi'
import { FetchStatus, IStatus } from '../../lib/api-status/IStatus'


type InitialState = {
  role: string | undefined,
  me: IUser,
  users: IUser[],
  response: string | undefined,
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  role: undefined,
  me: {} as IUser,
  users: [],
  response: undefined,
  status: {fetchStatus: FetchStatus.IDLE},
  actionStatus: {fetchStatus: FetchStatus.IDLE}
}

export const fetchUsersAsync = createAsyncThunk(
  'fetchUsersAsync/getAll',
  async (args: ActionWrapper<Number | undefined>, {rejectWithValue}) => { 
    console.log("fetchContributorDetailsAsync called...")
    try {
      
        const response = await fetchUsers();
        return response.data;
      
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)


export const fetchRoleAsync = createAsyncThunk(
  'fetchRoleAsync/get',
  async (args: ActionWrapper<Number | undefined>, {rejectWithValue}) => { 
    console.log("fetchContributorDetailsAsync called...")
    try {
      
        const response = await whoAmI();
        return response.data;
      
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const approveUsersAsync = createAsyncThunk(
  'approveUsersAsync/create',
  async (args: ActionWrapper<IUser>, {rejectWithValue}) => { 
    console.log("fetchContributorDetailsAsync called...")
    try {
      if(args.argument) {
        const response = await approveUser(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const updateUserOtpRequiredAsync = createAsyncThunk(
  'users/updateOtpRequired',
  async (args: ActionWrapper<{ id: number; otpRequired: boolean }>, { rejectWithValue }) => {
    try {
      if (!args.argument) {
        return rejectWithValue({ message: 'Missing data' });
      }
      const { id, otpRequired } = args.argument;
      const response = await patchUserOtpRequired(id, otpRequired);
      return response.data as IUser;
    } catch (reason) {
      return rejectWithValue(getError(reason));
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/delete',
  async (args: ActionWrapper<number>, { rejectWithValue }) => {
    try {
      if (args.argument == null) {
        return rejectWithValue({ message: 'Missing user id' });
      }
      await deleteUser(args.argument);
      return args.argument;
    } catch (reason) {
      return rejectWithValue(getError(reason));
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(fetchUsersAsync.pending, state => {
     
    })
    .addCase(
      fetchUsersAsync.fulfilled,
      (state, action: PayloadAction<IUser[]>) => {
        state.users = action.payload;
        state.response = undefined;
        state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(fetchUsersAsync.rejected, (state, action) => {
     
    })
    .addCase(approveUsersAsync.pending, state => {
     
    })
    .addCase(
      approveUsersAsync.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.response = action.payload;
        state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(approveUsersAsync.rejected, (state, action) => {
     
    })
    .addCase(fetchRoleAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      fetchRoleAsync.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.role = action.payload.role;
        state.me = action.payload;
        state.response = undefined;
        state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(fetchRoleAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
    .addCase(updateUserOtpRequiredAsync.fulfilled, (state, action: PayloadAction<IUser>) => {
      const updated = action.payload;
      state.users = state.users.map((row) =>
        row.id === updated.id ? { ...row, ...updated } : row
      );
    })
    .addCase(deleteUserAsync.fulfilled, (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((row) => row.id !== action.payload);
    })
  }
})

export default usersSlice.reducer
// export const { saveFormData } = fundOverviewDataSlice.actions

export const selectUsers = (state: RootState) => state.users;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActionWrapper } from '../../../../../lib/api-status/actionWrapper'
import { IContributorDetails } from './IContributorDetails'
import { updateContributorDetails, createContributorDetails, fetchContributorDetails, deleteContributorDetails } from './contributorDetailsApi'
import { getError } from '../../../../../lib/api-status/errorHandler'
import { FetchStatus, IStatus } from '../../../../../lib/api-status/IStatus'
import { RootState } from '../../../../../app/store'

type InitialState = {
  tableData: any
  contributorDetails: IContributorDetails[]
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  tableData: [],
  contributorDetails: [],
  status: {fetchStatus: FetchStatus.IDLE},
  actionStatus: {fetchStatus: FetchStatus.IDLE}
}



export const fetchContributorDetailsAsync = createAsyncThunk(
  'fetchContributorDetailsAsync/getAll',
  async (args: ActionWrapper<Number | undefined>, {rejectWithValue}) => { 
    console.log("fetchContributorDetailsAsync called...")
    try {
      if(args.argument) {
        const response = await fetchContributorDetails(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const createContributorDetailsAsync = createAsyncThunk(
  'createContributorDetailsAsync/create',
  async (args: ActionWrapper<IContributorDetails>, {rejectWithValue}) => { 
    console.log("updatePrelimApplicationAsync called...")
    try {
      if(args.argument) {
        const response = await createContributorDetails(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const updateContributorDetailsAsync = createAsyncThunk(
  'updateContributorDetailsAsyncAsync/create',
  async (args: ActionWrapper<IContributorDetails>, {rejectWithValue}) => { 
    console.log("updatePrelimApplicationAsync called...")
    try {
      if(args.argument) {
        const response = await updateContributorDetails(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const deleteContributorDetailsAsync = createAsyncThunk(
  'deleteContributorDetailsAsync/delete',
  async (args: ActionWrapper<IContributorDetails>, {rejectWithValue}) => { 
    console.log("deleteContributorDetailsAsync called...")
    try {
      if(args.argument) {
        const response = await deleteContributorDetails(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)



const contributorDetailsSlice = createSlice({
  name: 'contributorDetails',
  initialState,
  reducers: {
    saveFormData: (state, action: PayloadAction<any>) => {

      state.tableData = action.payload;
      console.log("From Save:", state.tableData)
      //state.formdata[action.payload.id] = action.payload.value;
      //console.log("logging after slice-state - length",state.formdata.length)
    },

  },
  extraReducers: builder => {
    builder.addCase(fetchContributorDetailsAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      fetchContributorDetailsAsync.fulfilled,
      (state, action: PayloadAction<IContributorDetails[]>) => {
        state.contributorDetails = action.payload
        state.status.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(fetchContributorDetailsAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(updateContributorDetailsAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      updateContributorDetailsAsync.fulfilled,
      (state, action: PayloadAction<IContributorDetails>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(updateContributorDetailsAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(createContributorDetailsAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      createContributorDetailsAsync.fulfilled,
      (state, action: PayloadAction<IContributorDetails>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(createContributorDetailsAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(deleteContributorDetailsAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      deleteContributorDetailsAsync.fulfilled,
      (state, action: PayloadAction<String>) => {
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
      
    )
    builder.addCase(deleteContributorDetailsAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default contributorDetailsSlice.reducer
export const { saveFormData } = contributorDetailsSlice.actions

export const selectContributorDetails = (state: RootState) => state.contributorDetails;
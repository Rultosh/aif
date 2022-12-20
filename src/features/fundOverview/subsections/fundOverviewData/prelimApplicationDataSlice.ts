import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActionWrapper } from '../../../../lib/api-status/actionWrapper'
import { fetchFundOverviewData, fetchFundOverviewList, patchPrelimApplication, postPrelimApplication } from './fundOverviewDataApi'
import { getError } from '../../../../lib/api-status/errorHandler'
import { defaultIPrelimApplicationData, IPrelimApplicationData } from './IPrelimApplicationData'
import { FetchStatus, IStatus } from '../../../../lib/api-status/IStatus'
import { RootState } from '../../../../app/store'

export interface PrelimApplicationState {
  prelimApplications: IPrelimApplicationData[],
  prelimApplication: IPrelimApplicationData,
  status: IStatus,
  allStatus: IStatus,
}

export interface IPageInfo {
  pageNumber: Number,
  pageSize: Number
}

const initialState : PrelimApplicationState = {
  prelimApplications: [],
  prelimApplication : defaultIPrelimApplicationData,
  status : {},
  allStatus : {}
}

export const getPrelimApplicationData = createAsyncThunk(
  'prelimApplicationdata/read',
  async (args: ActionWrapper<Number>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await fetchFundOverviewData(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const getPrelimApplicationList = createAsyncThunk(
  'prelimApplicationlist/read',
  async (args: ActionWrapper<IPageInfo>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await fetchFundOverviewList(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const updatePrelimApplicationAsync = createAsyncThunk(
  'prelimApplicationdata/update',
  async (args: ActionWrapper<IPrelimApplicationData>, {rejectWithValue}) => { 
    console.log("updatePrelimApplicationAsync called...")
    try {
      if(args.argument) {
        const response = await patchPrelimApplication(args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const createPrelimApplicationAsync = createAsyncThunk(
  'prelimApplicationdata/create',
  async (args: ActionWrapper<IPrelimApplicationData>, {rejectWithValue}) => { 
    try {
      if(args.argument) {
        const response = await postPrelimApplication(args.argument);
        console.log('prelimApplicationdata/create', args.argument);
        return response.data;
      }
    } catch(reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

const prelimApplicationDataSlice = createSlice({
  name: 'fundOverviewData',
  initialState,
  reducers: {
    saveFormData:  (state, action: PayloadAction<IPrelimApplicationData>) => {
        state.prelimApplication = action.payload;
        console.log("From Save:",state.prelimApplication)
      },
      clearPrelimApplication: (state, action: PayloadAction<void>) => {
        console.log('clearing state');
        state.status.fetchStatus = FetchStatus.DOING;
        state.prelimApplication = { ...defaultIPrelimApplicationData}
        console.log('clearing state', state.prelimApplication);
        state.status.fetchStatus = FetchStatus.IDLE;
      }
  },
  extraReducers: builder => {
    builder
    .addCase(getPrelimApplicationData.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      getPrelimApplicationData.fulfilled,
      (state, action: PayloadAction<IPrelimApplicationData>) => {
       state.prelimApplication = action.payload
       state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(getPrelimApplicationData.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
    .addCase(createPrelimApplicationAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      createPrelimApplicationAsync.fulfilled,
      (state, action: PayloadAction<IPrelimApplicationData>) => {
        console.log(action.payload)
       state.prelimApplication = action.payload
       state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(createPrelimApplicationAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
    .addCase(updatePrelimApplicationAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      updatePrelimApplicationAsync.fulfilled,
      (state, action: PayloadAction<IPrelimApplicationData>) => {
       state.prelimApplication = action.payload
       state.status.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(updatePrelimApplicationAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    }).addCase(getPrelimApplicationList.pending, state => {
      state.allStatus.fetchStatus = FetchStatus.DOING;
    })
    .addCase(
      getPrelimApplicationList.fulfilled,
      (state, action: PayloadAction<IPrelimApplicationData[]>) => {
       state.prelimApplications = action.payload
       state.allStatus.fetchStatus = FetchStatus.IDLE;
      }
    )
    .addCase(getPrelimApplicationList.rejected, (state, action) => {
      state.allStatus.fetchStatus = FetchStatus.FAILED;
    });
  }
})

export default prelimApplicationDataSlice.reducer
export const { saveFormData, clearPrelimApplication } = prelimApplicationDataSlice.actions

export const selectPrelimApplication = (state: RootState) => state.prelimApplication;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActionWrapper } from '../../../../lib/api-status/actionWrapper'
import { fetchFundOverviewData, fetchFundOverviewList, fetchFundOverviewAllList, patchPrelimApplication, postPrelimApplication, postApplication, postNewPreliminaryStarter } from './fundOverviewDataApi'
import { getError } from '../../../../lib/api-status/errorHandler'
import { defaultIPrelimApplicationData, IPrelimApplicationData, IApplicationData } from './IPrelimApplicationData'
import { FetchStatus, IStatus, ResponseCode } from '../../../../lib/api-status/IStatus'
import { RootState } from '../../../../app/store'

export interface PrelimApplicationState {
  prelimApplications: IPrelimApplicationData[],
  prelimApplication: IPrelimApplicationData,
  status: IStatus,
  allStatus: IStatus,
  totalEntries: number,
}

export interface IPageInfo {
  pageNumber: number,
  pageSize: number,
  searchAifName?: string,
  fundType?: string,
  /** Backend: START_DATE | TARGET_CORPUS | IA_SCORE | TOTAL_SCORE */
  sortBy?: string,
  sortDir?: 'asc' | 'desc',
}

const initialState: PrelimApplicationState = {
  prelimApplications: [],
  prelimApplication: defaultIPrelimApplicationData,
  status: {},
  allStatus: {},
  totalEntries: 0
}

export const getPrelimApplicationData = createAsyncThunk(
  'prelimApplicationdata/read',
  async (args: ActionWrapper<Number>, { rejectWithValue }) => {
    try {
      if (args.argument) {
        const response = await fetchFundOverviewData(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const getPrelimApplicationList = createAsyncThunk(
  'prelimApplicationlist/read',
  async (args: ActionWrapper<IPageInfo>, { rejectWithValue }) => {
    try {
      if (args.argument) {
        const response = await fetchFundOverviewList(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const getPrelimApplicationAllList = createAsyncThunk(
  'prelimApplicationAllList/read',
  async (args: ActionWrapper<IPageInfo>, { rejectWithValue }) => {
    try {
      if (args.argument) {
        const response = await fetchFundOverviewAllList(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const updatePrelimApplicationAsync = createAsyncThunk(
  'prelimApplicationdata/update',
  async (args: ActionWrapper<IPrelimApplicationData>, { rejectWithValue }) => {
    console.log("updatePrelimApplicationAsync called...")
    try {
      if (args.argument) {
        const response = await patchPrelimApplication(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const createPrelimApplicationAsync = createAsyncThunk(
  'prelimApplicationdata/create',
  async (args: ActionWrapper<IPrelimApplicationData>, { rejectWithValue }) => {
    try {
      if (args.argument) {
        const response = await postPrelimApplication(args.argument);
        console.log('prelimApplicationdata/create', args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const createPrelimStarterAsync = createAsyncThunk(
  'prelimApplicationStarter/create',
  async (args: ActionWrapper<IPrelimApplicationData>, { rejectWithValue }) => {
    try {
      if (args.argument) {
        const response = await postNewPreliminaryStarter(args.argument);
        console.log('prelimApplicationStarter/create', args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

export const createApplicationAsync = createAsyncThunk(
  'applicationdata/create',
  async (args: ActionWrapper<IApplicationData>, { rejectWithValue }) => {
    try {
      if (args.argument) {
        const response = await postApplication(args.argument);
        console.log('applicationdata/create', args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log("Error: " + reason)
      return rejectWithValue(getError(reason));
    }
  }
);

const prelimApplicationDataSlice = createSlice({
  name: 'fundOverviewData',
  initialState,
  reducers: {
    saveFormData: (state, action: PayloadAction<IPrelimApplicationData>) => {
      state.prelimApplication = action.payload;
      console.log("From Save:", state.prelimApplication)
    },
    clearPrelimApplication: (state, action: PayloadAction<void>) => {
      console.log('clearing state');
      state.status.fetchStatus = FetchStatus.DOING;
      state.prelimApplication = { ...defaultIPrelimApplicationData }
      console.log('clearing state', state.prelimApplication);
      state.status.fetchStatus = FetchStatus.IDLE;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPrelimApplicationData.pending, state => {
        state.status.fetchStatus = FetchStatus.DOING;
        state.status.responseCode = undefined;
        state.status.message = undefined;
      })
      .addCase(
        getPrelimApplicationData.fulfilled,
        (state, action: PayloadAction<IPrelimApplicationData>) => {
          state.prelimApplication = action.payload
          state.status.fetchStatus = FetchStatus.IDLE;
          state.status.responseCode = undefined;
          state.status.message = undefined;
        }
      )
      .addCase(getPrelimApplicationData.rejected, (state, action) => {
        const payload = action.payload as IStatus | undefined;
        state.status.fetchStatus = FetchStatus.FAILED;
        state.status.message = payload?.message;
        state.status.responseCode = payload?.responseCode;
        if (payload?.responseCode === ResponseCode.NOT_FOUND) {
          state.prelimApplication = { ...defaultIPrelimApplicationData };
        }
      })

      .addCase(createPrelimStarterAsync.pending, state => {
        state.status.fetchStatus = FetchStatus.DOING;
      })
      .addCase(
        createPrelimStarterAsync.fulfilled,
        (state, action: PayloadAction<IPrelimApplicationData>) => {
          console.log(action.payload)
          state.prelimApplication = action.payload
          state.status.fetchStatus = FetchStatus.IDLE;
        }
      )
      .addCase(createPrelimStarterAsync.rejected, (state, action) => {
        state.status.fetchStatus = FetchStatus.FAILED;
        state.status.message = (action.payload as IStatus)?.message;
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
        state.status.message = (action.payload as IStatus)?.message;
      })
      .addCase(updatePrelimApplicationAsync.pending, state => {
        state.status.fetchStatus = FetchStatus.DOING;
      })
      .addCase(
        updatePrelimApplicationAsync.fulfilled,
        (state, action: PayloadAction<IPrelimApplicationData>) => {
          state.prelimApplication = { ...state.prelimApplication, ...action.payload }
          state.status.fetchStatus = FetchStatus.IDLE;
        }
      )
      .addCase(updatePrelimApplicationAsync.rejected, (state, action) => {
        state.status.fetchStatus = FetchStatus.FAILED;
        state.status.message = (action.payload as IStatus)?.message;
      }).addCase(getPrelimApplicationList.pending, state => {
        state.allStatus.fetchStatus = FetchStatus.DOING;
      })
      .addCase(
        getPrelimApplicationList.fulfilled,
        (state, action: PayloadAction<IPrelimApplicationData[] | { content: IPrelimApplicationData[]; totalCount: number }>) => {
          const payload = action.payload as unknown;
          if (payload && typeof payload === 'object' && 'content' in (payload as object)) {
            const p = payload as { content: IPrelimApplicationData[]; totalCount: number };
            state.prelimApplications = p.content || [];
            state.totalEntries = typeof p.totalCount === 'number' ? p.totalCount : 0;
          } else if (Array.isArray(payload)) {
            state.prelimApplications = payload;
            state.totalEntries = payload.length;
          } else {
            state.prelimApplications = [];
          }
          state.allStatus.fetchStatus = FetchStatus.IDLE;
        }
      )
      .addCase(getPrelimApplicationList.rejected, (state, action) => {
        state.allStatus.fetchStatus = FetchStatus.FAILED;
        state.allStatus.message = (action.payload as IStatus)?.message;
      })
      .addCase(getPrelimApplicationAllList.fulfilled, (state, action: PayloadAction<IPrelimApplicationData[]>) => {
        state.totalEntries = action.payload?.length || 0;
      })
      .addCase(createApplicationAsync.pending, state => {
        state.status.fetchStatus = FetchStatus.DOING;
      })
      .addCase(
        createApplicationAsync.fulfilled,
        (state, action: PayloadAction<IPrelimApplicationData>) => {
          console.log(action.payload)
          state.prelimApplication = action.payload
          state.status.fetchStatus = FetchStatus.IDLE;
        }
      )
      .addCase(createApplicationAsync.rejected, (state, action) => {
        state.status.fetchStatus = FetchStatus.FAILED;
        state.status.message = (action.payload as IStatus)?.message;
      });

  }
})

export default prelimApplicationDataSlice.reducer
export const { saveFormData, clearPrelimApplication } = prelimApplicationDataSlice.actions

export const selectPrelimApplication = (state: RootState) => state.prelimApplication;
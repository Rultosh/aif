
import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { ActionWrapper } from '../../../../lib/api-status/actionWrapper'
import { defaultIISelfRating, ISelfRating } from './ISelfRating'
import { createIndependentRating, createSelfRating, deleteSelfRating, fetchSelfRating, updateSelfRating } from './selfRatingApi'
import { getError } from '../../../../lib/api-status/errorHandler'
import { FetchStatus, IStatus } from '../../../../lib/api-status/IStatus'
import { RootState } from '../../../../app/store'

type InitialState = {
  tableData: any
  selfRatings: ISelfRating
  status: IStatus
  actionStatus: IStatus
}
const initialState: InitialState = {
  tableData: [],
  selfRatings: defaultIISelfRating,
  status: { fetchStatus: FetchStatus.IDLE },
  actionStatus: { fetchStatus: FetchStatus.IDLE }
}


export const fetchSelfRatingAsync = createAsyncThunk(
  'fetchSelfRatingAsync/getAll',
  async (args: ActionWrapper<Number | undefined>, { rejectWithValue }) => {
    console.log("fetchSelfRatingAsync called...")
    try {
      if (args.argument) {
        const response = await fetchSelfRating(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const createSelfRatingAsync = createAsyncThunk(
  'createSelfRatingAsync/create',
  async (args: ActionWrapper<ISelfRating>, { rejectWithValue }) => {
    console.log("updatePrelimApplicationAsync called...")
    try {
      if (args.argument) {
        const response = await createSelfRating(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const createIndependentSelfRatingAsync = createAsyncThunk(
  'createIndependentSelfRatingAsync/create',
  async (args: ActionWrapper<ISelfRating>, { rejectWithValue }) => {
    console.log("updatePrelimApplicationAsync called...")
    try {
      if (args.argument) {
        const response = await createIndependentRating(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const updateSelfRatingAsync = createAsyncThunk(
  'updateSelfRatingAsync/create',
  async (args: ActionWrapper<ISelfRating>, { rejectWithValue }) => {
    console.log("updatePrelimApplicationAsync called...")
    try {
      if (args.argument) {
        const response = await updateSelfRating(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)

export const deleteSelfRatingAsync = createAsyncThunk(
  'deleteSelfRatingAsync/delete',
  async (args: ActionWrapper<ISelfRating>, { rejectWithValue }) => {
    console.log("deleteSelfRatingAsync called...")
    try {
      if (args.argument) {
        const response = await deleteSelfRating(args.argument);
        return response.data;
      }
    } catch (reason) {
      console.log(reason)
      return rejectWithValue(getError(reason));
    }
  }
)



const selfRatingSlice = createSlice({
  name: 'selfRating',
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
    builder.addCase(fetchSelfRatingAsync.pending, state => {
      state.status.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      fetchSelfRatingAsync.fulfilled,
      (state, action: PayloadAction<ISelfRating[]>) => {
        console.log("Full Payload", action.payload);
        if (action.payload.length === 0) {
          state.selfRatings = defaultIISelfRating;
        } else {
          state.selfRatings = action.payload[0]
        }

        console.log(state.selfRatings)
        state.status.fetchStatus = FetchStatus.IDLE;
      }

    )
    builder.addCase(fetchSelfRatingAsync.rejected, (state, action) => {
      state.status.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(updateSelfRatingAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      updateSelfRatingAsync.fulfilled,
      (state, action: PayloadAction<ISelfRating>) => {
        state.selfRatings = action.payload;
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
    )
    builder.addCase(updateSelfRatingAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(createIndependentSelfRatingAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      createIndependentSelfRatingAsync.fulfilled,
      (state, action: PayloadAction<ISelfRating>) => {
        state.selfRatings = action.payload;
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
    )

    builder.addCase(createIndependentSelfRatingAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(createSelfRatingAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      createSelfRatingAsync.fulfilled,
      (state, action: PayloadAction<ISelfRating>) => {
        state.selfRatings = action.payload;
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
    )
    builder.addCase(createSelfRatingAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
    builder.addCase(deleteSelfRatingAsync.pending, state => {
      state.actionStatus.fetchStatus = FetchStatus.DOING;
    })
    builder.addCase(
      deleteSelfRatingAsync.fulfilled,
      (state, action: PayloadAction<ISelfRating>) => {
        state.selfRatings = action.payload
        state.actionStatus.fetchStatus = FetchStatus.IDLE;
      }
    )
    builder.addCase(deleteSelfRatingAsync.rejected, (state, action) => {
      state.actionStatus.fetchStatus = FetchStatus.FAILED;
    })
  }
})

export default selfRatingSlice.reducer
export const { saveFormData } = selfRatingSlice.actions

export const selectSelfRatings = (state: RootState) => state.selfRating;
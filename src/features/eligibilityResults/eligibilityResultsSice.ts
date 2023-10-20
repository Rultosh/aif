import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {

    eligibleToApply: boolean

  loading: boolean
  error: string
}
const initialState: InitialState = {
    eligibleToApply: false,
  loading: true,
  error: ''
}

type resultSchema = {
  id:string,
  value:string
}

// Generates pending, fulfilled and rejected action types
export const fetchResults = createAsyncThunk('elegibilityResults/fetchResults', () => {
  console.log("Inside FetchResuts")
  return axios
    .get('http://localhost:5000/eligibilityResult')
    .then(response => response.data.value )
})



const eligibilityResultsSlice = createSlice({
  name: 'elegibilityResults',
  initialState,
  reducers: {
    updateResults:  (state, action: PayloadAction<resultSchema>) => {
    
      for (let id in action.payload){
        if(action.payload[id as keyof resultSchema] === 'no'){
          console.log("not eligible")
          state.eligibleToApply= false;
          break
        }
        else{
          console.log("eligible")
          state.eligibleToApply= true;
        }
      }
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchResults.pending, state => {
      state.loading = true
    })
    builder.addCase(
        fetchResults.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        console.log("Inside the case",action)
        state.loading = false
        state.eligibleToApply = action.payload
        state.error = ''
      }
    )
    builder.addCase(fetchResults.rejected, (state, action) => {
      state.loading = false
     
      state.error = action.error.message || 'Something went wrong'
    })
  }
})

export default eligibilityResultsSlice.reducer
export const { updateResults } = eligibilityResultsSlice.actions
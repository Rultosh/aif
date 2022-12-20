import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    rowData:[]
}

type resultSchema = {
  id:string,
  value:string
}

// Generates pending, fulfilled and rejected action types
export const fetchGridData = createAsyncThunk('home/fetchGridData', () => {
  console.log("Inside fetchGridData")
  return axios
    .get('http://localhost:5000/gridData')
    .then(response => response.data )
})



const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchGridData.pending, state => {
      
    })
    builder.addCase(
        fetchGridData.fulfilled,
      (state, action: PayloadAction<any>) => {
        console.log("Inside the case",action)
        state.rowData = action.payload
        
      }
    )
    builder.addCase(fetchGridData.rejected, (state, action) => {
     
     
     
    })
  }
})

export default homeSlice.reducer

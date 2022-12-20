
import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'

type InitialState = {

    agreed:boolean


}
const initialState: InitialState = {
   agreed:false
}


// Generates pending, fulfilled and rejected action types
export const submitResults = createAsyncThunk('declaration/submitResults', (obj:any) => {  
 let url = 'http://localhost:5000/declaration/' 
  console.log("tempdaa from declaration",obj);
  return axios
    .post(url,obj)
    .then(response => response.data.value )
})

export const fetchData = createAsyncThunk('declaration/fetchData', () => {
  console.log("Inside fetchResults")
  return axios
    .get('http://localhost:5000/declaration')
    .then(response => response.data ) 
})

const declarationSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    saveFormData:  (state, action: PayloadAction<boolean>) => {
      
        state.agreed = action.payload;
        
      },
    
  },
  extraReducers: builder => {
    builder.addCase(fetchData.pending, state => {
     
    })
    builder.addCase(
        fetchData.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        
       state.agreed = action.payload
      }
    )
    builder.addCase(fetchData.rejected, (state, action) => {
     
    })
    builder.addCase(submitResults.pending, state => {
     console.log("Inside Pending")
    })
    builder.addCase(
        submitResults.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        
        console.log("Inside fulfilled")
      }
    )
    builder.addCase(submitResults.rejected, (state, action) => {
        console.log("Inside rejected")
    })
  }
})

export default declarationSlice.reducer
export const { saveFormData } = declarationSlice.actions
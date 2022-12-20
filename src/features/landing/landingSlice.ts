import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {

  validUser: boolean
  error: string|undefined
}
const initialState: InitialState = {
  validUser: false,
  error: undefined
}

type credentials = {
  name: string,
  password: string
}

// Generates pending, fulfilled and rejected action types
export const validateUser = createAsyncThunk('landing/validateUser',  async (value:credentials) => {
  
    return fetch('https://vcf-backend.herokuapp.com/api/registeredusers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          value
        ),
    })

})

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(validateUser.pending, state => {
      
    })
    builder.addCase(
      validateUser.fulfilled,
      (state, action) => {
        if(action.payload.status === 200 || action.payload.ok){
          state.validUser = true;
        }else{
          state.error = 'Invaid Email/Password'
        }
        
        
      }
    )
    builder.addCase(validateUser.rejected, (state, action) => {

      state.error = action.error.message || 'Something went wrong'
    })
  }
})

export default landingSlice.reducer
import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type signUpFormData = {

    name: string,
    companyName: string,
    email: string,
    phoneNo: string,
    state: string,
    title: string,
    city: string,
    address: string

}
type InitialState = {

    formSubmitResponse: boolean
    loading: boolean
    error: string
    formData: any
}
const initialState: InitialState = {
    formSubmitResponse: false,
    loading: true,
    error: '',
    formData: {} as signUpFormData

}

type resultSchema = {
  id:string,
  value:string
}

// Generates pending, fulfilled and rejected action types
export const submitForm = createAsyncThunk('signUp/submitForm', (formDataToPublish:any) => {


  return fetch('https://salty-headland-21861.herokuapp.com/api/registeredusers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formDataToPublish),
})

})

const resetPasswordSlice = createSlice({
  name: 'signUpSlice',
  initialState,
  reducers: {
    updateFormData:  (state, action: PayloadAction<resultSchema>) => {
      
      state.formData[action.payload.id] = action.payload.value;
     
      //state.formdata[action.payload.id] = action.payload.value;
      //console.log("logging after slice-state - length",state.formdata.length)
    },
    resetFormData:  (state) => {
      console.log("inside reset forms")
      state.formData = {} as signUpFormData;
      //state.formData["name"] = "sampath test";
     
      //state.formdata[action.payload.id] = action.payload.value;
      //console.log("logging after slice-state - length",state.formdata.length)
    }
  },
  extraReducers: builder => {
    builder.addCase(submitForm.pending, state => {
      state.loading = true
    })
    builder.addCase(
        submitForm.fulfilled,
      (state, action: PayloadAction<any>) => {
        console.log("Inside the fulfil case",action)
        state.loading = false
        state.formSubmitResponse = action.payload.ok
        state.error = ''
      }
    )
    builder.addCase(submitForm.rejected, (state, action) => {
      state.loading = false
      console.log("Inside the error case",action)
      state.error = action.error.message || 'Something went wrong'
    })
  }
})

export default resetPasswordSlice.reducer
export const { updateFormData, resetFormData } = resetPasswordSlice.actions
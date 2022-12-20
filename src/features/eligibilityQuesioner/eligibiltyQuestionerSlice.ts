import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {questions} from './elegibilityQuestions'


type resultSchema = {
  id:string,
  value:string
}

type InitialState = {
  questions: any
  error: string
  results: any
}
const initialState: InitialState = {
  questions: [],
  error: '',
  results:{} as resultSchema
}

// Generates pending, fulfilled and rejected action types
export const fetchQuestions = createAsyncThunk('eligibilityQuestioner/fetchQuestions', () => {
  console.log("Inside FetchQuestions")
  return axios
    .get('http://localhost:5000/eligibilityQuestions')
    .then(response => response.data ) 
})

const eligibilityQuestionerSlice = createSlice({
  name: 'eligibilityQuestioner',
  initialState,
  reducers: {
    selected:  (state, action: PayloadAction<resultSchema>) => {
      state.results = action.payload;
     /* console.log("logging from slice-state",state.results)
      console.log("logging from slice",action)
      state.results[action.payload.id] = action.payload.value;
      console.log("logging after slice-state - length",state.results.length)*/
    },
    getQuestions:  (state) => { //To be removed
      
      //state.questions = questions.eligibilityQuestions['Fund of funds']
      state.questions = questions.eligibilityQuestions
     
    }
  },
  extraReducers: builder => {
    builder.addCase(
      fetchQuestions.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        console.log("Inside the case",action)
        state.questions = action.payload
        state.error = ''
      }
    )
    builder.addCase(fetchQuestions.rejected, (state, action) => {
      console.log('Inside fetch error') //To be removed
        // To be removed
      state.error = action.error.message || 'Something went wrong'
    })
  }
})

export default eligibilityQuestionerSlice.reducer
export const { selected, getQuestions } = eligibilityQuestionerSlice.actions
import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActionWrapper } from '../../../../lib/api-status/actionWrapper'
import { fetchFundOverviewData } from './fundOverviewDataApi'
import { getError } from '../../../../lib/api-status/errorHandler'
import { IPrelimApplicationData } from './IPrelimApplicationData'
import { IStatus } from '../../../../lib/api-status/IStatus'

type InitialState = {
    formData: any
}
const initialState: InitialState = {
    formData: {} as fundOverviewData
}

interface fundOverviewData{
    NameOfTheFund: string,
    sponcer: string,
    investmentManager: string,
    FundManager: string,
    dealType: string,
    impact: string,
    aifCategory: string,
    nameOfTheTrustee: string,
    contribution: string,
    term: string,
    commitment: string,
    returnPercent: string,
    fees: string,
    carriedInterest: string,
    dealSector: string,
    dealSubSector: string,
    description: string,
    investmentStrategy: string,
    supportingDescription: string,
    domestic: string,
    overseas: string,
    totalCorpus: string,
    domesticAmount: string,
    overseasAmount: string,
}
// Generates pending, fulfilled and rejected action types
export const submitResults = createAsyncThunk('fundData/submitResults', (fundOverviewData:any) => {
  console.log("Inside submitResults")
  //const article = { title: 'React POST Request Example1' };
  return axios
    .post('http://localhost:5000/fundOverview',fundOverviewData)
    .then(response => response.data.value )
})

export const fetchResults = createAsyncThunk('fundData/fetchResults', () => {
  console.log("Inside fetchResults")
  return axios
    .get('http://localhost:5000/fundOverview')
    .then(response => response.data ) 
})

export const getFundOverviewData = createAsyncThunk(
  '/api/prelims/{prelimAppId}',
  //First argument of void is needed to inject rejectWithValue
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

const fundOverviewDataSlice = createSlice({
  name: 'fundOverviewData',
  initialState,
  reducers: {
    saveFormData:  (state, action: PayloadAction<fundOverviewData>) => {
      
        state.formData = action.payload;
        console.log("From Save:",state.formData)
        //state.formdata[action.payload.id] = action.payload.value;
        //console.log("logging after slice-state - length",state.formdata.length)
      },
    
  },
  extraReducers: builder => {
    builder.addCase(fetchResults.pending, state => {
     
    })
    .addCase(
      fetchResults.fulfilled,
      (state, action: PayloadAction<fundOverviewData>) => {
        console.log("Inside the fulfil case",action)
       state.formData = action.payload
      }
    )
    .addCase(fetchResults.rejected, (state, action) => {
     
    })
  }
})

export default fundOverviewDataSlice.reducer
export const { saveFormData } = fundOverviewDataSlice.actions
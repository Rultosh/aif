
import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'

type InitialState = {
  data: any,
  id: string | undefined,
  value: any,
  leadTableData: any,
  nonLeadTableData: any,
  parentTableData: any


}
const initialState: InitialState = {
  data: {},
  id: undefined,
  value: {},
  leadTableData: [],
  nonLeadTableData: [],
  parentTableData: []
}


// Generates pending, fulfilled and rejected action types
export const submitResults = createAsyncThunk('profile/submitResults', (rowData: any) => {
  console.log("Inside submitResults of investment slice ");
  const { tableName, data, id } = rowData;
  console.log("Inside submitResults", rowData);


  //let url = tableName==='leadTableData'? 'http://localhost:5000/profile/leadTableData' : 'http://localhost:5000/profile/nonLeadTableData'
  let url = 'https://vcf-backend-oracle.herokuapp.com/api/prelims/1/teamMembers'
  console.log("tempdata", data);
  return axios
    .post(url, data)
    .then(response => response.data.value)
})

export const fetchTableData = createAsyncThunk('profile/fetchTableData', () => {
  console.log("Inside fetchResults")
  return axios
    //.get('http://localhost:5000/profile')
    .get('https://vcf-backend-oracle.herokuapp.com/api/prelims/1/teamMembers')
    .then(response => response.data)
})

const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '1'
  }
};
export const fetchTeamMember = createAsyncThunk('profile/fetchTeamMember', (prelimApplicationId: string) => {
  console.log("Inside fetchResults")
  let url = `https://vcf-backend-oracle.herokuapp.com/api/prelims/${prelimApplicationId}/teamMembers`
  return axios
    //.get('http://localhost:5000/profile')
    .get(url, config)
    .then(response => response.data)
})

export const createTeamMember = createAsyncThunk('profile/createTeamMember', (rowData: any) => {
  console.log("Inside submitResults of investment slice ");
  const { tableName, data, id } = rowData;
  console.log("Inside submitResults", rowData);

  let url = `https://vcf-backend-oracle.herokuapp.com/api/prelims/${id}/teamMembers`
  console.log("tempdata", data);
  //let t = {"name": "sampath", "dob": '1', "location": 'c'}
  return axios
    .post(url, data, config)
    .then(response => response.data)
})

export const fetchLead = createAsyncThunk('profile/fetchLead', (prelimApplicationId: string) => {
  console.log("Inside fetchResults")
  let url = `https://vcf-backend-oracle.herokuapp.com/api/teamMembers/${prelimApplicationId}/investmentsResponsibleAsLead`
  return axios
    //.get('http://localhost:5000/profile')
    .get(url, config)
    .then(response => response.data)
})

export const createLead = createAsyncThunk('profile/createLead', (rowData: any) => {
  console.log("Inside submitResults of investment slice ");
  const { tableName, data, id } = rowData;
  console.log("Inside submitResults", rowData);

  let url = `https://vcf-backend-oracle.herokuapp.com/api/teamMembers/${id}/investmentsResponsibleAsLead`
  console.log("tempdata", data);
  return axios
    .post(url, data, config)
    .then(response => response.data)
})

export const fetchNonLead = createAsyncThunk('profile/fetchNonLead', (prelimApplicationId: string) => {
  let url = `https://vcf-backend-oracle.herokuapp.com/api/teamMembers/${prelimApplicationId}/investmentsResponsibleForNonLead`
  return axios
    //.get('http://localhost:5000/profile')
    .get(url, config)
    .then(response => response.data)
})

export const createNonLead = createAsyncThunk('profile/crecreateNonLeadateLead', (rowData: any) => {
  const { tableName, data, id } = rowData;
  let url = `https://vcf-backend-oracle.herokuapp.com/api/teamMembers/${id}/investmentsResponsibleForNonLead`;
  return axios
    .post(url, data, config)
    .then(response => response.data)
})



export const create = createAsyncThunk('profile/create', (data: any) => {

  let url = 'http://localhost:5000/profile/'
  return axios
    .post(url, data)
    .then(response => response.data.value)
})

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    saveFormData: (state, action: PayloadAction<any>) => {

      //state.leadTableData = action.payload;
      //console.log("From Save:",state.leadTableData)

    },

  },
  extraReducers: builder => {
    builder.addCase(fetchTableData.pending, state => {

    })
    builder.addCase(
      fetchTableData.fulfilled,
      (state, action: PayloadAction<any>) => {
        console.log("Inside the fulfil case", action)
        state.data = action.payload;
        state.leadTableData = action.payload.leadTableData;
        state.nonLeadTableData = action.payload.nonLeadTableData;
        state.parentTableData = action.payload.parentTableData
      }
    )
    builder.addCase(fetchTableData.rejected, (state, action) => {

    })
    builder.addCase(fetchTeamMember.pending, (state, action) => {

    })
    builder.addCase(fetchTeamMember.fulfilled, (state, action: PayloadAction<any>) => {
      console.log("************************")
      console.log(action.payload)
      state.parentTableData = action.payload
      console.log("************************")
    })
    builder.addCase(fetchTeamMember.rejected, (state, action) => {

    })
    builder.addCase(createTeamMember.pending, (state, action) => {

    })
    builder.addCase(createTeamMember.fulfilled, (state, action: PayloadAction<any>) => {
      console.log("************************")
      console.log(action.payload)
      //state.parentTableData = action.payload
      console.log("************************")
    })
    builder.addCase(createTeamMember.rejected, (state, action) => {

    })
    builder.addCase(createLead.pending, (state, action) => {

    })
    builder.addCase(createLead.fulfilled, (state, action: PayloadAction<any>) => {
      console.log("************************")
      console.log(action.payload)
      //state.parentTableData = action.payload
      console.log("************************")
    })
    builder.addCase(createLead.rejected, (state, action) => {

    })
    builder.addCase(fetchLead.pending, (state, action) => {

    })
    builder.addCase(fetchLead.fulfilled, (state, action: PayloadAction<any>) => {
      state.leadTableData = action.payload
    })
    builder.addCase(fetchLead.rejected, (state, action) => {

    })
    builder.addCase(createNonLead.pending, (state, action) => {
      console.log(action.payload)
    })
    builder.addCase(createNonLead.fulfilled, (state, action: PayloadAction<any>) => {
      console.log("************************")
      console.log(action.payload)
      //state.parentTableData = action.payload
      console.log("************************")
    })
    builder.addCase(createNonLead.rejected, (state, action) => {
      console.log(action.payload)
    })
    builder.addCase(fetchNonLead.pending, (state, action) => {

    })
    builder.addCase(fetchNonLead.fulfilled, (state, action: PayloadAction<any>) => {
      state.nonLeadTableData = action.payload
    })
    builder.addCase(fetchNonLead.rejected, (state, action) => {

    })

  }
})

export default profileSlice.reducer
export const { saveFormData } = profileSlice.actions
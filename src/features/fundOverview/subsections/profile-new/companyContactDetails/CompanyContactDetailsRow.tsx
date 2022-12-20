import { Delete, Edit } from '@mui/icons-material'
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import React from "react"
import { useState } from "react"
import uuid from "react-uuid";
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { ICompanyContactDetails } from './ICompanyContactDetails'
import { CompanyContactDetailsModel } from './CompanyContactDetailsModel';
import { deleteCompanyContactDetailsAsync } from './companyContactDetailsSlice';

interface CompanyContactDetailsRowProps {
  companyContactDetails: ICompanyContactDetails
}

export const CompanyContactDetailsRow = (props: CompanyContactDetailsRowProps) => {
  const [actionUid] = useState(uuid());
  const dispatch = useAppDispatch();
  const [companyContactDetails, setTeamMember] = useState(props.companyContactDetails)

  const tableHeaders = ["Name of company", "Name of promoter/CEO", "Address", "Tele.", "Mobile", "Email", "Alt. Email", "Year of investment", "Action"]

  let headerComponent = []

  for (let i = 0; i < tableHeaders.length; i++) {
    headerComponent.push(
      <React.Fragment >
        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
      </React.Fragment>)
  }

  console.log("companyContactDetails")

  function handleDelete() {
    dispatch(
      deleteCompanyContactDetailsAsync(
        wrapArgument(
          actionUid, companyContactDetails
        )
      )
    )
  }

  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  return <><Box >
    <Grid container spacing={2} >
      <Grid item xs={12}>
        <Box >
          <TableContainer component={Paper}  >
            <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
              <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                <TableRow>
                  {headerComponent}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={companyContactDetails.id}>
                  <TableCell align="center" component="th" scope="row">
                    {companyContactDetails.nameOfCompany}
                  </TableCell>
                  <TableCell align="center">{companyContactDetails.nameOfPromoter}</TableCell>
                  <TableCell align="center">{companyContactDetails.address}</TableCell>
                  <TableCell align="center">{companyContactDetails.telephoneNo}</TableCell>
                  <TableCell align="center">{companyContactDetails.mobileNo}</TableCell>
                  <TableCell align="center">{companyContactDetails.email}</TableCell>
                  <TableCell align="center">{companyContactDetails.alternateEmail}</TableCell>
                  <TableCell align="center">{companyContactDetails.yearOfInvestment}</TableCell>
                  <TableCell align="center">
                    <Edit onClick={handleOpen} />&nbsp;
                    <Delete onClick={handleDelete}></Delete>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>

      {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right' }}>
        <Box onClick={handleShow}>
          <ExpandMoreIcon sx={{ color: 'black', backgroundColor: 'white' }} />
        </Box>
      </Grid>
      {show ?
        <Grid item xs={12}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <LeadTable idProp={props.idProp}></LeadTable>
          </Box>
        </Grid>
        : null}
      {show ?
        <Grid item xs={12}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <NonLeadTable></NonLeadTable>
          </Box>
        </Grid> : null}
      {show ?
        <Grid item xs={12}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <CompanyContacts></CompanyContacts>
          </Box>
        </Grid> : null}
      {show ?
        <Grid item xs={12}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Reference></Reference>
          </Box>
        </Grid> : null} */}
    </Grid>
  </Box>
    <CompanyContactDetailsModel
      companyContactDetails={companyContactDetails}
      open={open}
      onClose={setOpen} /></>

}
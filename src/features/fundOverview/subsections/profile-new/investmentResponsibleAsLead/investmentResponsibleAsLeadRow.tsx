import { Delete, Edit } from '@mui/icons-material'
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import React from "react"
import { useState } from "react"
import uuid from "react-uuid";
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentResponsibleAsLead } from './IInvestmentResponsibleAsLead'
import { InvestmentResponsibleAsLeadModel } from './InvestmentResponsibleAsLeadModel';
import { deleteInvestmentResponsibleAsLeadAsync } from './investmentResponsibleAsLeadSlice';

interface InvestmentResponsibleAsLeadRowProps {
  investmentResponsibleAsLead: IInvestmentResponsibleAsLead
}

export const InvestmentResponsibleAsLeadRow = (props: InvestmentResponsibleAsLeadRowProps) => {
  const [actionUid] = useState(uuid());
  const dispatch = useAppDispatch();
  const [investmentResponsibleAsLead, setTeamMember] = useState(props.investmentResponsibleAsLead)

  const tableHeaders = ["Name of company", "Amount invested", "Date of investment", "Exited/Write off", "Date of exit", "Comment", "Action"]

  let headerComponent = []

  for (let i = 0; i < tableHeaders.length; i++) {
    headerComponent.push(
      <React.Fragment >
        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
      </React.Fragment>)
  }

  console.log("investmentResponsibleAsLead")

  function handleDelete() {
    dispatch(
      deleteInvestmentResponsibleAsLeadAsync(
        wrapArgument(
          actionUid, investmentResponsibleAsLead
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
                <TableRow key={investmentResponsibleAsLead.id}>
                  <TableCell align="center" component="th" scope="row">
                    {investmentResponsibleAsLead.nameOfCompany}
                  </TableCell>
                  <TableCell align="center">{investmentResponsibleAsLead.amountInvested}</TableCell>
                  <TableCell align="center">{investmentResponsibleAsLead.dateOfInvestment}</TableCell>
                  <TableCell align="center">{investmentResponsibleAsLead.exitOrWriteOff}</TableCell>
                  <TableCell align="center">{investmentResponsibleAsLead.dateofExitorWriteOff}</TableCell>
                  <TableCell align="center">{investmentResponsibleAsLead.comment}</TableCell>
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
    <InvestmentResponsibleAsLeadModel
      investmentResponsibleAsLead={investmentResponsibleAsLead}
      open={open}
      onClose={setOpen} /></>

}
import { Delete, Edit } from '@mui/icons-material'
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import React from "react"
import { useState } from "react"
import uuid from "react-uuid";
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentResponsibleAsNonLead } from './IInvestmentResponsibleAsNonLead'
import { InvestmentResponsibleAsNonLeadModel } from './InvestmentResponsibleAsNonLeadModel';
import { deleteInvestmentResponsibleAsNonLeadAsync } from './investmentResponsibleAsNonLeadSlice';

interface InvestmentResponsibleAsNonLeadRowProps {
  investmentResponsibleAsNonLead: IInvestmentResponsibleAsNonLead
}

export const InvestmentResponsibleAsNonLeadRow = (props: InvestmentResponsibleAsNonLeadRowProps) => {
  const [actionUid] = useState(uuid());
  const dispatch = useAppDispatch();
  const [investmentResponsibleAsNonLead, setTeamMember] = useState(props.investmentResponsibleAsNonLead)

  const tableHeaders = ["Name of company", "Amount invested", "Date of investment", "Exited/Write off", "Date of exit", "Comment", "Action"]

  let headerComponent = []

  for (let i = 0; i < tableHeaders.length; i++) {
    headerComponent.push(
      <React.Fragment >
        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
      </React.Fragment>)
  }

  console.log("investmentResponsibleAsNonLead")

  function handleDelete() {
    dispatch(
      deleteInvestmentResponsibleAsNonLeadAsync(
        wrapArgument(
          actionUid, investmentResponsibleAsNonLead
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
                <TableRow key={investmentResponsibleAsNonLead.id}>
                  <TableCell align="center" component="th" scope="row">
                    {investmentResponsibleAsNonLead.nameOfCompany}
                  </TableCell>
                  <TableCell align="center">{investmentResponsibleAsNonLead.amountInvested}</TableCell>
                  <TableCell align="center">{investmentResponsibleAsNonLead.dateOfInvestment}</TableCell>
                  <TableCell align="center">{investmentResponsibleAsNonLead.exitOrWriteOff}</TableCell>
                  <TableCell align="center">{investmentResponsibleAsNonLead.dateofExitorWriteOff}</TableCell>
                  <TableCell align="center">{investmentResponsibleAsNonLead.comment}</TableCell>
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
    <InvestmentResponsibleAsNonLeadModel
      investmentResponsibleAsNonLead={investmentResponsibleAsNonLead}
      open={open}
      onClose={setOpen} /></>

}
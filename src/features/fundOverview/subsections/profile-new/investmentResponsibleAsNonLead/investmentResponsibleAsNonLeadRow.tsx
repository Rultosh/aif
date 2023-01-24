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

  return (
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
  <InvestmentResponsibleAsNonLeadModel
    investmentResponsibleAsNonLead={investmentResponsibleAsNonLead}
    open={open}
    onClose={setOpen} />
    </TableRow>)
}
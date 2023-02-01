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
  

  function handleDelete() {
    dispatch(
      deleteInvestmentResponsibleAsLeadAsync(
        wrapArgument(
          actionUid, props.investmentResponsibleAsLead
        )
      )
    )
  }

  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  return (
    <TableRow key={props.investmentResponsibleAsLead.id}>
      <TableCell align="center" component="th" scope="row">
        {props.investmentResponsibleAsLead.nameOfCompany}
      </TableCell>
      <TableCell align="center">{props.investmentResponsibleAsLead.amountInvested}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsLead.dateOfInvestment}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsLead.exitOrWriteOff}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsLead.dateofExitorWriteOff}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsLead.comment}</TableCell>
      <TableCell align="center">
        <Edit onClick={handleOpen} />&nbsp;
        <Delete onClick={handleDelete}></Delete>
      </TableCell>
    
    
  <InvestmentResponsibleAsLeadModel
    investmentResponsibleAsLead={props.investmentResponsibleAsLead}
    open={open}
    onClose={setOpen} />
    </TableRow>)

}
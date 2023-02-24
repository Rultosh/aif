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
import Moment from 'moment';

interface InvestmentResponsibleAsNonLeadRowProps {
  investmentResponsibleAsNonLead: IInvestmentResponsibleAsNonLead
}

export const InvestmentResponsibleAsNonLeadRow = (props: InvestmentResponsibleAsNonLeadRowProps) => {
  const [actionUid] = useState(uuid());
  const dispatch = useAppDispatch();

  function handleDelete() {
    dispatch(
      deleteInvestmentResponsibleAsNonLeadAsync(
        wrapArgument(
          actionUid, props.investmentResponsibleAsNonLead
        )
      )
    )
  }

  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  return (
    <TableRow key={props.investmentResponsibleAsNonLead.id}>
      <TableCell align="center" component="th" scope="row">
        {props.investmentResponsibleAsNonLead.nameOfCompany}
      </TableCell>
      <TableCell align="center">{props.investmentResponsibleAsNonLead.amountInvested}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsNonLead.dateOfInvestment && Moment(props.investmentResponsibleAsNonLead.dateOfInvestment).format("DD/MM/YYYY")}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsNonLead.exitOrWriteOff}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsNonLead.dateofExitorWriteOff && Moment(props.investmentResponsibleAsNonLead.dateofExitorWriteOff).format("DD/MM/YYYY")}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsNonLead.irrPercent}</TableCell>
      <TableCell align="center">{props.investmentResponsibleAsNonLead.comment}</TableCell>
      <TableCell align="center">
        <div style={{ display: 'flex' }}>
          <Edit onClick={handleOpen} />&nbsp;
          <Delete onClick={handleDelete}></Delete>
        </div>
      </TableCell>
  <InvestmentResponsibleAsNonLeadModel
    investmentResponsibleAsNonLead={props.investmentResponsibleAsNonLead}
    open={open}
    onClose={setOpen} />
    </TableRow>)
}
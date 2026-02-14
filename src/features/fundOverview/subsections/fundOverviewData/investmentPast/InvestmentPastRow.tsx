import { Delete, Edit } from '@mui/icons-material'
import { TableCell, TableRow } from '@mui/material'
import React, * as Rect from 'react'
import { useDispatch } from 'react-redux'
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentPast } from './IInvestmentPast'
import { deleteInvestmentPastAsync } from './investmentPastSlice'
import uuid from "react-uuid";
import { useAppDispatch } from '../../../../../app/hooks'
import { InvestmentPastModel } from './InvestmentPastModel'
import Moment from 'moment';

interface InvestmentPastRowPros {
  row: IInvestmentPast
}

export const InvestmentPastRow = (props: InvestmentPastRowPros) => {

  const dispatch = useAppDispatch();
  const [actionUid] = Rect.useState(uuid())

  const [open, setOpen] = Rect.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleDelete() {
    dispatch(
      deleteInvestmentPastAsync(
        wrapArgument(
          actionUid, props.row)
      ))
  }

  return <TableRow key={`${props.row.nameOfCompany}`}>
    <TableCell align="center" component="th" scope="row">
      {props.row.nameOfCompany}
    </TableCell>
    <TableCell align="center">{props.row.sector}</TableCell>
    <TableCell align="center">{String(props.row.amountInvested)}</TableCell>
    <TableCell align="center">{Moment(String(props.row.dateOfInvestment)).format("DD/MM/YYYY")}</TableCell>
    <TableCell align="center">{String(props.row.briefProfile)}</TableCell>
    <TableCell align="center">
      <Edit onClick={handleOpen} />&nbsp;
      <Delete onClick={handleDelete}></Delete>
    </TableCell>
    {open ? <InvestmentPastModel
      investmentPastFormData={props.row}
      open={open}
      handleClose={handleClose}
      prelimApplicationId={props.row.prelimApplicationId} />
      : <></>}
  </TableRow>
}
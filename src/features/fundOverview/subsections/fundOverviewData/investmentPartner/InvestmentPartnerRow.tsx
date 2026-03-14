import { Delete, Edit } from '@mui/icons-material'
import { TableCell, TableRow } from '@mui/material'
import React, * as Rect from 'react'
import { useDispatch } from 'react-redux'
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentPartner } from './IInvestmentPartner'
import { deleteInvestmentTeamPartnerLevelAsync } from './investmentPartnerSlice'
import uuid from "react-uuid";
import { useAppDispatch } from '../../../../../app/hooks'
import { InvestmentPartnerModel } from './InvestmentPartnerModel'

interface InvestmentPartnerRowPros {
  row: IInvestmentPartner
}

export const InvestmentPartnerRow = (props: InvestmentPartnerRowPros) => {

  const dispatch = useAppDispatch();
  const [actionUid] = Rect.useState(uuid())

  const [open, setOpen] = Rect.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleDelete() {
    dispatch(
      deleteInvestmentTeamPartnerLevelAsync(
        wrapArgument(
          actionUid, props.row)
      ))
  }

  return <TableRow key={`${props.row.name}`}>
    <TableCell align="left" component="th" scope="row">
      {props.row.name}
    </TableCell>
    <TableCell align="left">{props.row.designation}</TableCell>
    <TableCell align="left">{String(props.row.age)}</TableCell>
    <TableCell align="left">{props.row.qualification}</TableCell>
    <TableCell align="left">{String(props.row.vcpeExperience)}</TableCell>
    <TableCell align="justify">{props.row.areaOfExpertise}</TableCell>
    <TableCell align="left">
      <Edit onClick={handleOpen} sx={{ color: '#2764c8', cursor: 'pointer' }} />&nbsp;&nbsp;
      <Delete onClick={handleDelete} sx={{ color: '#df3744', cursor: 'pointer' }}></Delete>
    </TableCell>
    {open ? <InvestmentPartnerModel
      investmentPartnerFormData={props.row}
      open={open}
      handleClose={handleClose}
      prelimApplicationId={props.row.prelimApplicationId} />
      : <></>}
  </TableRow>
}
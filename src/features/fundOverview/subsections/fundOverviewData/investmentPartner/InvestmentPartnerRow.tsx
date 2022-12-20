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
    <TableCell align="center" component="th" scope="row">
      {props.row.name}
    </TableCell>
    <TableCell align="center">{props.row.designation}</TableCell>
    <TableCell align="center">{String(props.row.age)}</TableCell>
    <TableCell align="center">{props.row.qualification}</TableCell>
    <TableCell align="center">{String(props.row.vcpeExperience)}</TableCell>
    <TableCell align="center">{props.row.description}</TableCell>
    <TableCell align="center">
      <Edit onClick={handleOpen}/>&nbsp;
      <Delete onClick={handleDelete}></Delete>
    </TableCell>
    {open?<InvestmentPartnerModel 
            investmentPartnerFormData={props.row} 
            open={open} 
            handleClose={handleClose} 
            prelimApplicationId={props.row.prelimApplicationId}/>
          :<></>}
  </TableRow>
}
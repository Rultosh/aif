import { Delete, Edit } from '@mui/icons-material'
import { TableCell, TableRow } from '@mui/material'
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { IContributorDetails } from './IContributorDetails'
import { deleteContributorDetailsAsync } from './contributorDetailsSlice'
import uuid from "react-uuid";
import React, * as Rect from 'react'
import { useAppDispatch } from '../../../../../app/hooks'
import { ContributorDetailsModel } from './ContributorDetailsModel'

interface ContributorDetailsRowPros {
  row: IContributorDetails
}

export const ContributorDetailsRow = (props: ContributorDetailsRowPros) => {

  const dispatch = useAppDispatch();
  const [actionUid] = Rect.useState(uuid())

  const [open, setOpen] = Rect.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleDelete() {
      dispatch(
        deleteContributorDetailsAsync(
          wrapArgument(
            actionUid, props.row)
        ))
  }

  return <TableRow key={`${props.row.name}`}>
    <TableCell align="center" component="th" scope="row">
      {props.row.name}
    </TableCell>
    <TableCell align="center">{String(props.row.amount)}</TableCell>
    <TableCell align="center">{String(props.row.percentOfCorpus)}</TableCell>
    <TableCell align="center">
      <Edit onClick={handleOpen}/>&nbsp;
      <Delete onClick={handleDelete}></Delete>
    </TableCell>
    {open?<ContributorDetailsModel 
            contributorDetailsFormData={props.row} 
            open={open} 
            handleClose={handleClose} 
            prelimApplicationId={props.row.prelimApplicationId}/>
          :<></>}
  </TableRow>
}
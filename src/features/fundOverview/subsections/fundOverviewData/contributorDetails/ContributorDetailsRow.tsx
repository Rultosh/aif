import { Delete, Edit } from '@mui/icons-material'
import { TableCell, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
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

  const [deleteConfirmOpen, setDeleteConfirmOpen] = Rect.useState(false);

  function handleDelete() {
    dispatch(
      deleteContributorDetailsAsync(
        wrapArgument(
          actionUid, props.row)
      ))
    setDeleteConfirmOpen(false);
  }

  return <TableRow key={`${props.row.name}`}>
    <TableCell align="justify" component="th" scope="row">
      {props.row.name}
    </TableCell>
    <TableCell align="left">{String(props.row.amount)}</TableCell>
    <TableCell align="left">{String(props.row.percentOfCorpus)}</TableCell>
    <TableCell align="left">{String(props.row.contributionType)}</TableCell>
    <TableCell align="left">
      <Edit onClick={handleOpen} sx={{ cursor: 'pointer', color: '#1976d2' }} />&nbsp;
      {props.row.name !== 'Sponsor' && (
        <Delete onClick={() => setDeleteConfirmOpen(true)} sx={{ cursor: 'pointer', color: '#d32f2f' }} />
      )}
    </TableCell>
    {open && <ContributorDetailsModel
      contributorDetailsFormData={props.row}
      open={open}
      handleClose={handleClose}
      prelimApplicationId={props.row.prelimApplicationId} />}

    <Dialog
      open={deleteConfirmOpen}
      onClose={() => setDeleteConfirmOpen(false)}
      aria-labelledby="delete-dialog-title"
      PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}
    >
      <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 'bold' }}>
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this contributor? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setDeleteConfirmOpen(false)} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" autoFocus sx={{ borderRadius: '8px', textTransform: 'none' }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </TableRow>
}
import { Delete, Edit } from '@mui/icons-material'
import { Chip, TableCell, TableRow, Tooltip } from '@mui/material'
import React, * as Rect from 'react'
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentAssociate } from './IInvestmentAssociate'
import { deleteInvestmentTeamsAssociateLevelAsync } from './investmentAssociateSlice'
import uuid from "react-uuid";
import { useAppDispatch } from '../../../../../app/hooks'
import { InvestmentAssociateModel } from './InvestmentAssociateModel'

interface InvestmentAssociateRowPros {
  row: IInvestmentAssociate
  /** True when server reports this row is missing the mandatory resume/CV upload. */
  rowDocInvalid?: boolean
  /** Called after the edit modal closes so the parent can re-check document status. */
  onRowModalClosed?: () => void
}

const invalidRowSx = {
  bgcolor: 'rgba(211, 47, 47, 0.07)',
  outline: '1px solid rgba(211, 47, 47, 0.35)',
  outlineOffset: '-1px',
} as const;

export const InvestmentAssociateRow = (props: InvestmentAssociateRowPros) => {

  const dispatch = useAppDispatch();
  const [actionUid] = Rect.useState(uuid())

  const [open, setOpen] = Rect.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.onRowModalClosed?.();
  };

  function handleDelete() {
    dispatch(
      deleteInvestmentTeamsAssociateLevelAsync(
        wrapArgument(
          actionUid, props.row)
      ))
  }

  const row = (
    <TableRow sx={props.rowDocInvalid ? invalidRowSx : undefined}>
      <TableCell align="left" component="th" scope="row">
        {props.row.name}
      </TableCell>
      <TableCell align="left">{props.row.designation}</TableCell>
      <TableCell align="left">{String(props.row.age)}</TableCell>
      <TableCell align="left">{props.row.qualification}</TableCell>
      <TableCell align="left">{String(props.row.investmentExperience)}</TableCell>
      <TableCell align="justify">{props.row.areaOfExpertise}</TableCell>
      <TableCell align="left">
        {props.rowDocInvalid ? (
          <Chip
            size="small"
            label="Missing resume"
            color="error"
            variant="outlined"
            sx={{ mr: 1, verticalAlign: 'middle', fontWeight: 600 }}
          />
        ) : null}
        <Edit onClick={handleOpen} sx={{ color: '#2764c8', cursor: 'pointer' }} />&nbsp;&nbsp;
        <Delete onClick={handleDelete} sx={{ color: '#df3744', cursor: 'pointer' }}></Delete>
      </TableCell>
      {open ? <InvestmentAssociateModel
        investmentAssociateFormData={props.row}
        open={open}
        handleClose={handleClose}
        prelimApplicationId={props.row.prelimApplicationId} />
        : <></>}
    </TableRow>
  );

  if (props.rowDocInvalid) {
    return (
      <Tooltip title="Resume/CV upload is mandatory for this team member. Click Edit to add the document." placement="top-start">
        {row}
      </Tooltip>
    );
  }

  return row;
}

import { Delete, Edit } from '@mui/icons-material'
import { Chip, TableCell, TableRow, Tooltip } from '@mui/material'
import React, * as Rect from 'react'
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { IInvestmentPartner } from './IInvestmentPartner'
import { deleteInvestmentTeamPartnerLevelAsync } from './investmentPartnerSlice'
import uuid from "react-uuid";
import { useAppDispatch } from '../../../../../app/hooks'
import { InvestmentPartnerModel } from './InvestmentPartnerModel'

interface InvestmentPartnerRowPros {
  row: IInvestmentPartner
  missingPastTenYearsDoc?: boolean
  missingResumeDoc?: boolean
  onRowModalClosed?: () => void
}

const invalidRowSx = {
  bgcolor: 'rgba(211, 47, 47, 0.07)',
  outline: '1px solid rgba(211, 47, 47, 0.35)',
  outlineOffset: '-1px',
} as const;

export const InvestmentPartnerRow = (props: InvestmentPartnerRowPros) => {

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
      deleteInvestmentTeamPartnerLevelAsync(
        wrapArgument(
          actionUid, props.row)
      ))
  }

  const rowInvalid = Boolean(props.missingPastTenYearsDoc || props.missingResumeDoc);

  const tooltipParts: string[] = [];
  if (props.missingPastTenYearsDoc) {
    tooltipParts.push('Past 10 years investments document is required.');
  }
  if (props.missingResumeDoc) {
    tooltipParts.push('Resume/CV/Experience upload is required.');
  }
  const tooltipTitle =
    tooltipParts.length > 0
      ? `${tooltipParts.join(' ')} Click Edit to upload.`
      : '';

  const row = (
    <TableRow sx={rowInvalid ? invalidRowSx : undefined}>
      <TableCell align="left" component="th" scope="row">
        {props.row.name}
      </TableCell>
      <TableCell align="left">{props.row.designation}</TableCell>
      <TableCell align="left">{String(props.row.age)}</TableCell>
      <TableCell align="left">{props.row.qualification}</TableCell>
      <TableCell align="left">{String(props.row.vcpeExperience)}</TableCell>
      <TableCell align="justify">{props.row.areaOfExpertise}</TableCell>
      <TableCell align="left">
        {props.missingPastTenYearsDoc ? (
          <Chip
            size="small"
            label="Missing past 10 yrs"
            color="error"
            variant="outlined"
            sx={{ mr: 0.5, mb: 0.5, verticalAlign: 'middle', fontWeight: 600 }}
          />
        ) : null}
        {props.missingResumeDoc ? (
          <Chip
            size="small"
            label="Missing resume"
            color="error"
            variant="outlined"
            sx={{ mr: 1, mb: 0.5, verticalAlign: 'middle', fontWeight: 600 }}
          />
        ) : null}
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
  );

  if (rowInvalid) {
    return (
      <Tooltip title={tooltipTitle} placement="top-start">
        {row}
      </Tooltip>
    );
  }

  return row;
}

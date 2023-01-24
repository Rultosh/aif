import { Delete, Edit } from '@mui/icons-material'
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import React from "react"
import { useState } from "react"
import uuid from "react-uuid";
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { ICompanyContactDetails } from './ICompanyContactDetails'
import { CompanyContactDetailsModel } from './CompanyContactDetailsModel';
import { deleteCompanyContactDetailsAsync } from './companyContactDetailsSlice';

interface CompanyContactDetailsRowProps {
  companyContactDetails: ICompanyContactDetails
}

export const CompanyContactDetailsRow = (props: CompanyContactDetailsRowProps) => {
  const [actionUid] = useState(uuid());
  const dispatch = useAppDispatch();
  const [companyContactDetails, setTeamMember] = useState(props.companyContactDetails)



  console.log("companyContactDetails")

  function handleDelete() {
    dispatch(
      deleteCompanyContactDetailsAsync(
        wrapArgument(
          actionUid, companyContactDetails
        )
      )
    )
  }

  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  return (
  <TableRow key={companyContactDetails.id}>
    <TableCell align="center" component="th" scope="row">
      {companyContactDetails.nameOfCompany}
    </TableCell>
    <TableCell align="center">{companyContactDetails.nameOfPromoter}</TableCell>
    <TableCell align="center">{companyContactDetails.address}</TableCell>
    <TableCell align="center">{companyContactDetails.telephoneNo}</TableCell>
    <TableCell align="center">{companyContactDetails.mobileNo}</TableCell>
    <TableCell align="center">{companyContactDetails.email}</TableCell>
    <TableCell align="center">{companyContactDetails.alternateEmail}</TableCell>
    <TableCell align="center">{companyContactDetails.yearOfInvestment}</TableCell>
    <TableCell align="center">
      <Edit onClick={handleOpen} />&nbsp;
      <Delete onClick={handleDelete}></Delete>
    </TableCell>
    <CompanyContactDetailsModel
      companyContactDetails={companyContactDetails}
      open={open}
      onClose={setOpen} />
  </TableRow>)

}
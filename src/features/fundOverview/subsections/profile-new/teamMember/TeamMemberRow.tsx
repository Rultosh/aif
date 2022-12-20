import { Delete, Edit } from '@mui/icons-material'
import { Box, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import React from "react"
import { useState } from "react"
import { TeamMemberModel } from './TeamMemberModel'
import { deleteTeamMemberAsync } from "./teamMemberSlice"
import { defaultTeamMember, ITeamMember } from "./ITeamMember";
import uuid from "react-uuid";
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper'
import { InvestmentResponsibleAsLeadList } from '../investmentResponsibleAsLead/InvestmentResponsibleAsLeadList'
import { InvestmentResponsibleAsNonLeadList } from '../investmentResponsibleAsNonLead/InvestmentResponsibleAsNonLeadList'
import { CompanyContactDetailsList } from '../companyContactDetails/CompanyContactDetailsList'
import { IndependentReferencesRow } from '../independentReferences/IndependentReferencesRow'
import { IndependentReferencesList } from '../independentReferences/IndependentReferencesList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface TeamMemberRowProps {
  teamMember: ITeamMember
}

export const TeamMemberRow = (props: TeamMemberRowProps) => {
  const [actionUid] = useState(uuid());
  const dispatch = useAppDispatch();
  const [teamMember, setTeamMember] = useState(props.teamMember)
  const [show, setShow] = useState(true);
  const handleShow = () => setShow(!show);

  const tableHeaders = ["Name", "DOB", "Date of Joining", "Location", "Year of Relevent Experience", "Key Person", "Directorship Held", "Action"]

  let headerComponent = []

  for (let i = 0; i < tableHeaders.length; i++) {
    headerComponent.push(
      <React.Fragment >
        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
      </React.Fragment>)
  }

  function handleDelete() {
    dispatch(
      deleteTeamMemberAsync(
        wrapArgument(
          actionUid, teamMember
        )
      )
    )
  }

  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  return <div><Box >
    <Card sx={{ mt: 4, backgroundColor: "#363062" }}>
      <CardContent >
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <Box sx={{ width: 'auto' }}>
              <TableContainer component={Paper}  >
                <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                  <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                    <TableRow>
                      {headerComponent}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={teamMember.id}>
                      <TableCell align="center" component="th" scope="row">
                        {teamMember.name}
                      </TableCell>
                      <TableCell align="center">{teamMember.dob}</TableCell>
                      <TableCell align="center">{teamMember.dateofJoiningAMC}</TableCell>
                      <TableCell align="center">{teamMember.location}</TableCell>
                      <TableCell align="center">{teamMember.yearsOfRelevantExp}</TableCell>
                      <TableCell align="center">{teamMember.keyPerson}</TableCell>
                      <TableCell align="center">{teamMember.directorship}</TableCell>
                      <TableCell align="center">
                        <Edit onClick={handleOpen} />&nbsp;
                        <Delete onClick={handleDelete}></Delete>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Box onClick={handleShow}>
                        <ExpandMoreIcon sx={{ color: 'black', backgroundColor: 'white' }} />
                    </Box>
                </Grid>
                {show ? <div>
          <Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 2 }}>
              <InvestmentResponsibleAsLeadList teamMemberId={teamMember.id} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 2 }}>
              <InvestmentResponsibleAsNonLeadList teamMemberId={teamMember.id} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 2 }}>
              <CompanyContactDetailsList teamMemberId={teamMember.id} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 2 }}>
              <IndependentReferencesList parentId={teamMember.id} />
            </Box>
          </Grid> </div>:null}


        </Grid>
      </CardContent></Card>
  </Box>
    <TeamMemberModel
      teamMember={teamMember}
      open={open}
      onClose={setOpen} /></div>

}
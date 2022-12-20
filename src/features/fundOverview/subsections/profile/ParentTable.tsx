import { Box, Button, Card, CardContent, CardHeader, Chip, FormControlLabel, Grid, Modal, Paper, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveFormData, submitResults, fetchTableData, fetchTeamMember, createTeamMember } from './profileSlice'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import React, * as Rect from 'react'
import LeadTable from "./LeadTable";
import NonLeadTable from "./NonLeadTable";
import CompanyContacts from './CompanyContacts'
import Reference from './Reference'
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const initialState = {
    "name": undefined,
    "dateOfBirth": undefined,
    "dateOfJoining": undefined,
    "location": undefined,
    "yearOfExperience": undefined,
    "previousExperience": undefined,
    "education": undefined,
    "memberOfInvesteeCommitee": undefined,
    "keyPerson": undefined,
    "directorshipsHeld": undefined,
    "action": undefined
}



export const ParentTable = (props:any) => {

    const dispatch = useAppDispatch()
    const [show, setShow] = useState(true);
    const handleShow = () => setShow(!show);
    const {row,leadRowData,nonLeadRowData} = props;
    const tableHeaders = ["Name", "DOB", "Date of Joining", "Location", "Year of Relevent Experience", "Previous Professional Experience", "Education", "Member of Investee Commitee", "Key Person", "Directorship Held", "Action"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    /*
    useEffect(() => {
        dispatch(fetchTeamMember("1"))
    }, [])
    */
    return (
        <Box >
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <Box >
                        <TableContainer component={Paper}  >
                            <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                    <TableRow>
                                        {headerComponent}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                <TableRow key={row.id}>
                                            <TableCell align="center" component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="center">{row.dob}</TableCell>
                                            <TableCell align="center">{row.dateofJoiningAMC}</TableCell>
                                            <TableCell align="center">{row.location}</TableCell>
                                            <TableCell align="center">{row.yearsOfRelevantExp}</TableCell>
                                            <TableCell align="center">{row.previousExperience}</TableCell>
                                            <TableCell align="center">{row.education}</TableCell>
                                            <TableCell align="center">{row.memberOfInvesteeCommitee}</TableCell>
                                            <TableCell align="center">{row.keyPerson}</TableCell>
                                            <TableCell align="center">{row.directorship}</TableCell>
                                            <TableCell align="center">{row.action}</TableCell>
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
                {show ?
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <LeadTable idProp={props.idProp} rows={leadRowData}></LeadTable>
                        </Box>
                    </Grid>
                    : null} 
                {show ?
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <NonLeadTable idProp={props.idProp} rows={nonLeadRowData}></NonLeadTable>
                        </Box>
                    </Grid> : null} {/*
                    {show ?
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <CompanyContacts></CompanyContacts>
                        </Box>
                    </Grid> : null}
                    {show ?
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Reference></Reference>
                        </Box>
                    </Grid> : null} */}
            </Grid>
        </Box>
    );
}



export default ParentTable;
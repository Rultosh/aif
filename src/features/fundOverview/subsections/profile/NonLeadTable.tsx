import { Box, Button, Card, CardContent, CardHeader, Chip, FormControlLabel, Grid, Modal, Paper, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveFormData, submitResults, fetchTableData , fetchNonLead, createNonLead} from './profileSlice'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import React, * as Rect from 'react'



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




export const NonLeadTable = (props:any) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    //const rows = useAppSelector(state => state.profile.nonLeadTableData) || [];
    const {rows} = props;
    const dispatch = useAppDispatch()
    const [formValue, setFormValue] = useState({} as any);

    const tableHeaders = ["Name of company", "Amount Invested", "Date of Investment", "Exited/Write Off", "Date of exit", "IRR", "Comments", "Action"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }
/*
    useEffect(() => {
        if (Object.entries(rows).length === 0) {
        //dispatch(fetchNonLead("1"))
        console.log("in use effect,", rows);
        }
        else{
           // dispatch(fetchNonLead("1"))
        }

    }, [rows])  */

    function handleSubmitForm(id: any) {

        let tempData = { data: formValue, id: id }
        dispatch(createNonLead(tempData))
        setFormValue({});
        dispatch(fetchNonLead(id))
    }

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...formValue };
        if (ev.target.id !== undefined) {
            copiedValue[ev.target.id] = ev.target.value;
        } else {
            copiedValue[ev.target.name] = ev.target.value;
        }
        setFormValue(copiedValue);
    };




    return (
        <Box >
            <Card>
                <CardContent>
                    <Grid container spacing={2} >
                        <Grid item xs={12}>
                            <Box >
                                <Typography variant="subtitle2" sx={{ flex: 1, mb: 1 }}>Investmets responsible for (as Non Lead)</Typography>
                                <TableContainer component={Paper}  >
                                    <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                                        <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                            <TableRow>
                                                {headerComponent}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {rows.map((row: any) => (
                                                <TableRow key={row.id}>
                                                    <TableCell align="center" component="th" scope="row">
                                                        {row.nameOfCompany}
                                                    </TableCell>
                                                    <TableCell align="center">{row.amountInvested}</TableCell>
                                                    <TableCell align="center">{row.dateOfInvestment}</TableCell>
                                                    <TableCell align="center">{row.exitOrWriteOff}</TableCell>
                                                    <TableCell align="center">{row.dateofExitorWriteOff}</TableCell>
                                                    <TableCell align="center">{row.irr}</TableCell>
                                                    <TableCell align="center">{row.comments}</TableCell>
                                                    <TableCell align="center">{row.action}</TableCell>
                                                </TableRow>
                                           ))} 
                                           
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Grid>
                        <Grid item xs={11.5}>
                            <Button onClick={handleOpen} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                Add
                            </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
                                        <Card sx={{ display: 'flex', }}>

                                            <CardContent sx={{ flex: 1 }}>
                                                <Grid container spacing={2} >
                                                    <Grid item xs={9}>
                                                        <Box sx={{ display: 'inline-flex' }}>
                                                            <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Details of Investment Team</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={4.5}>
                                                        <TextField
                                                            required
                                                            id="nameOfCompany"
                                                            label="Company Name"
                                                            //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                            //value={formValue["NameOfTheFund"]}
                                                            variant="standard"
                                                            onChange={handleChange}

                                                            sx={{ display: 'flex' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3.5}>
                                                        <TextField
                                                            required
                                                            id="amountInvested"
                                                            label="Amount Invested"
                                                            //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                            //value={formValue["NameOfTheFund"]}
                                                            variant="standard"
                                                            //onChange={handleChange}

                                                            sx={{ display: 'flex' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <TextField
                                                            required
                                                            id="dateOfInvestment"
                                                            label="Date Of Investment"
                                                            //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                            //value={formValue["NameOfTheFund"]}
                                                            variant="standard"
                                                            //onChange={handleChange}

                                                            sx={{ display: 'flex' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4.5}>
                                                        <TextField
                                                            required
                                                            id="exitOrWriteOff"
                                                            label="Exited/Write Off"
                                                            //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                            //value={formValue["NameOfTheFund"]}
                                                            variant="standard"
                                                            //onChange={handleChange}

                                                            sx={{ display: 'flex' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4.5}>
                                                        <TextField
                                                            required
                                                            id="dateofExitorWriteOff"
                                                            label="Date Of Exit"
                                                            //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                            //value={formValue["NameOfTheFund"]}
                                                            variant="standard"
                                                            //onChange={handleChange}

                                                            sx={{ display: 'flex' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4.5}>
                                                        <TextField
                                                            required
                                                            id="irr"
                                                            label="IRR"
                                                            //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                            //value={formValue["NameOfTheFund"]}
                                                            variant="standard"
                                                            //onChange={handleChange}

                                                            sx={{ display: 'flex' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4.5}>
                                                        <TextField
                                                            required
                                                            id="comment"
                                                            label="Comments"
                                                            //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                            //value={formValue["NameOfTheFund"]}
                                                            variant="standard"
                                                            //onChange={handleChange}

                                                            sx={{ display: 'flex' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4.5}>
                                                        <TextField
                                                            required
                                                            id="action"
                                                            label="Action"
                                                            //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                            //value={formValue["NameOfTheFund"]}
                                                            variant="standard"
                                                            //onChange={handleChange}

                                                            sx={{ display: 'flex' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} >
                                                        <Button onClick={() => handleSubmitForm(props.idProp)} color='success' variant="contained" disableElevation sx={{ textTransform: 'none' }} >
                                                            Submit
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>

                                    </Box>
                                </Box>
                            </Modal>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}



export default NonLeadTable;

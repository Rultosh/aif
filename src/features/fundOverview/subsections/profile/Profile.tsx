import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, Modal, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import NonLeadTable from './NonLeadTable'
import LeadTable from './LeadTable'
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ParentTable from './ParentTable'
import React, * as Rect from 'react'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { saveFormData, submitResults, fetchTableData, create, fetchTeamMember, createTeamMember } from './profileSlice'


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


export const Profile = () => {

    const { id } = useParams();

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const rows = useAppSelector(state => state.profile.parentTableData) || [];
    const [formValue, setFormValue] = useState({} as any);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);




    useEffect(() => {
        if (Object.entries(rows).length === 0) {
            dispatch(fetchTeamMember("1"))
        }

    }, [])

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

    function handleSubmitForm(id: any) {

        let tempData = { data: formValue, id: id }
        dispatch(createTeamMember(tempData))
        setFormValue({});
        dispatch(fetchTeamMember("1"))
    }

    
    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'previous') {
            navigate(`/preliminary/${id}/fund`)
        } else {
            navigate(`/preliminary/${id}/selfRating`)
        }
    }

    function handleClickSave() {

    }
    
    return (
        <Card sx={{ display: 'flex', mb: 2 }}>
            <CardContent sx={{ flex: 1 }}>

                <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Profile</Typography>
                <Typography variant="subtitle2" sx={{ flex: 1, mt: 1 }}>Experience of Investment Team Members (please furnish for each team member seperately)</Typography>
                <Card sx={{ display: 'flex', mt: 2, backgroundColor: "#f2f2f2" }}>
                    <CardContent sx={{ flex: 1 }}>
                        {rows.map((row: any) => (
                            <Card sx={{ mt: 4, backgroundColor: "#363062" }}>
                                <CardContent >
                                    <Box sx={{ mb: 2 }}>
                                        <ParentTable row={row} idProp={"1"}></ParentTable>
                                    </Box>
                                </CardContent>
                            </Card>))}
                        {/*outputComponents*/}

                    </CardContent>
                </Card>

                <Box>
                    <Button onClick={handleOpen} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                        Add new data
                    </Button>
                    <Modal
                        //id= {props.idProp}
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
                                                    id="name"
                                                    label="Name"
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
                                                    id="dob"
                                                    label="Date Of Birth"
                                                    //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                    //value={formValue["NameOfTheFund"]}
                                                    variant="standard"
                                                    onChange={handleChange}

                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <TextField
                                                    required
                                                    id="dateofJoiningAMC"
                                                    label="Date Of Joining"
                                                    //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                    //value={formValue["NameOfTheFund"]}
                                                    variant="standard"
                                                    onChange={handleChange}

                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={4.5}>
                                                <TextField
                                                    required
                                                    id="location"
                                                    label="Location"
                                                    //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                    //value={formValue["NameOfTheFund"]}
                                                    variant="standard"
                                                    onChange={handleChange}

                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={4.5}>
                                                <TextField
                                                    required
                                                    id="yearsOfRelevantExp"
                                                    label="Years of Relevent Experience"
                                                    //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                    //value={formValue["NameOfTheFund"]}
                                                    variant="standard"
                                                    onChange={handleChange}

                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={4.5}>
                                                <TextField
                                                    required
                                                    id="keyPerson"
                                                    label="Key Person"
                                                    //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                    //value={formValue["NameOfTheFund"]}
                                                    variant="standard"
                                                    onChange={handleChange}

                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={4.5}>
                                                <TextField
                                                    required
                                                    id="directorship"
                                                    label="Directorship Held"
                                                    //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                                                    //value={formValue["NameOfTheFund"]}
                                                    variant="standard"
                                                    onChange={handleChange}

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
                                                    onChange={handleChange}

                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Button onClick={() => handleSubmitForm("1")} color='success' variant="contained" disableElevation sx={{ textTransform: 'none' }} >
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                            </Box>
                        </Box>
                    </Modal>
                </Box>

                <Button onClick={(e) => handleClick(e, "previous")} startIcon={<ArrowLeftIcon />} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Details Of the Funds
                </Button>

                <Button onClick={handleClickSave} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Save
                </Button>

                <Button onClick={(e) => handleClick(e, "next")} endIcon={<ArrowRightIcon />} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Self Rating
                </Button>

            </CardContent >
        </Card >
    );
}


export default Profile;
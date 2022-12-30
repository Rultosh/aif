import { IconButton, Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, InputLabel } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import uuid from "react-uuid";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { Controller } from "../../../../lib/api-wrappers/Controller";
import { defaultIDetailedApplication2E, IDetailedApplication2E } from "./IDetailedApplication2E";
import { detailedApplication2EThunk, selectDetailedApplication2E } from "./detailedApplication2ESlice";
import {updateNavIndex}from '../sideNavBarSlice'
import UploadComponents from '../uploadComponents'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileUpload from "../../../../components/FileUpload";
import SaveIcon from '@mui/icons-material/Save';


export const DetailedApplication2E = (props: any) => {

    const params = useParams()
    const parentId  = Number(params.id)
    const [formData, setFormData] = useState(defaultIDetailedApplication2E);
    const actionId = useState(uuid());
    const controller = new Controller(actionId, detailedApplication2EThunk);
    const state = useAppSelector(selectDetailedApplication2E);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();

    const handleOnClickUpload = () => {
        setOpen(true)
    }

    useEffect(() => {
        dispatch(updateNavIndex(4))
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: parentId })
                controller.all({ ...formData, parentId: parentId });
            }
        }
    }, [])

    useEffect(() => {
        dispatch(updateNavIndex(4))
        if (state[parentId]?.data && Object.keys(state[parentId]?.data).length > 0 && props.isCrtStateToUpdate(state[parentId]?.data, defaultIDetailedApplication2E)){
            Object.keys(state[parentId]?.data).map((key) => {
                let value = state[parentId]?.data[key]
                if (value && value.id) {
                    setFormData(value);
                } else {
                    setFormData({ ...formData, parentId: parentId })
                }
            });
        }
    }, [state[parentId]?.data])

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...formData }
        let key = ev.target.id ? ev.target.id : ev.target.name;
        copiedValue[key as keyof typeof formData] = ev.target.value;
        setFormData(copiedValue);
    };

    const handleSave = () => {
        controller.save(formData);
    }


    const handleClick = (ev: any, navTo: string) => {
        handleSave()
        if (navTo === 'next') {
            navigate(`/Detailed/${parentId}/detailed2F`);
        }
        else{
            navigate(`/Detailed/${parentId}/detailed2D`);
        }
    }


    return (<>
        <SideNavBar></SideNavBar>
        <Grid item xs={9}>

            <Card sx={{ display: 'flex', mb: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                <Grid container spacing={2} >
                        <Grid item xs={11}>
                            <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Detailed Application</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            {/*} <IconButton onClick={handleSave} style={{ float: 'right' }} sx={{ position: 'fixed', backgroundColor: '#D586F7', display: 'flex', borderRadius: '8%', cursor: 'pointer' }}>
                                <SaveIcon  ></SaveIcon>
    </IconButton>*/}
                            <Button
                                onClick={handleSave}
                                endIcon={<SaveIcon />}
                                variant="contained"
                                disableElevation
                                color='success'
                                sx={{ textTransform: 'none', position: 'fixed'}} >
                                Save
                            </Button>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>E. Due diligence, documentation and monitoring </Typography>


                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="listOfExternalFirms"
                                label="26. List of external firms (legal, technical, financial / accounting etc.) who are assisting / would be assisting the Investment Manager in the due diligence process."
                                //defaultValue={formDatalistOfExternalFirms === undefined ? " " : formData["listOfExternalFirms"]}
                                value={formData["listOfExternalFirms"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>


                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="monitoringPractices"
                                label="27. List the activities involved in monitoring and follow-up of investments? How frequently do the investee companies furnish reports to the Investment Manager? Please give details of the same."
                                //defaultValue={formDatamonitoringPractices === undefined ? " " : formData["monitoringPractices"]}
                                value={formData["monitoringPractices"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>


                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="imValueAdd"
                                label="28. Please describe how the investment manager(s) add value / propose to add value to the investments."
                                //defaultValue={formDataimValueAdd === undefined ? " " : formData["imValueAdd"]}
                                value={formData["imValueAdd"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid container>
                                <Grid item xs={9}>
                                    <InputLabel variant="standard" sx={{ml:2}}>29. What are the risks in the investments planned for this fund and what are the risk mitigation efforts?
                                        <FileUploadIcon onClick={handleOnClickUpload} >
                                        </FileUploadIcon>
                                        <FileUpload
                                            id={props.id}
                                            onSuccess={(id: String, url: String) => {
                                                props.onSuccess(props.id, url);
                                            }}
                                            open={open} setOpen={setOpen}></FileUpload>
                                    </InputLabel>
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                                <div style={{margin: "15px"}}>
                                    <UploadComponents id={`riskInInvestment${parentId}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    

                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                onClick={(e) => handleClick(e, "previous")}
                                startIcon={<ArrowLeftIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={4} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(E) of 5</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={4} sx={{ justifyContent: 'right' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <Button
                                    onClick={(e) => handleClick(e, "next")}
                                    endIcon={<ArrowRightIcon />}
                                    variant="contained"
                                    disableElevation
                                    sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2, mr: 2 }} >
                                    Next
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    </>
    );
}


export default DetailedApplication2E;
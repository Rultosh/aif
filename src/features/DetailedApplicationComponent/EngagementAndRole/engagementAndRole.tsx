import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, FormControlLabel, Switch } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams } from "react-router-dom";
import DocumentUpload from "../../../components/DocumentUpload";
import uuid from "react-uuid";
import ListFiles from "../../../components/ListFiles";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { Controller } from "../../../lib/api-wrappers/Controller";
import { detailedApplicationThunk, selectedDetailedApplications } from "../../detailedApplication/sidbiReference/detailedApplicationSlice";
import { defaultIDetailedApplication } from "../../detailedApplication/sidbiReference/IDetailedApplication";
import { updateStepperIndex } from '../subsections/sideNavBarSlice';

export const EngagementAndRole = (props: any) => {
    const { id } = useParams()
    const [parentId] = useState(Number(id))
    const [formData, setFormData] = useState(defaultIDetailedApplication);
    const actionId = useState(uuid());
    const controller = new Controller(actionId, detailedApplicationThunk);
    const state = useAppSelector(selectedDetailedApplications);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(updateStepperIndex(3))        
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: parentId })
                controller.all({ ...formData, parentId: parentId });
            }
        }
    }, [])

    useEffect(() => {
        dispatch(updateStepperIndex(3))        
        if (id && state[parentId]?.data) {
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
            navigate(`/Detailed/${id}/carryDistribution`);
        }
        else {
            navigate(`/Detailed/${id}/InvestmentThemeOfFund`);
        }
    }

    const [engagementAndRoleRefreshId, setEngagementAndRoleRefreshId] = useState(uuid());

    const engagementAndRoleSuccess = () => {
        setEngagementAndRoleRefreshId(uuid());
    }

    return (<>

        <Grid item xs={12}>


            <Card sx={{ display: 'flex', mb: 2, mt: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Detailed engagement and role IM with the portfolio companies</Typography>

                    <Divider sx={{ mt: 2 }} />
                    <Card sx={{ display: 'flex', mt: 3, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="imRoleAndEngagement"
                                label="Please provide details as per caption"
                                //defaultValue={formData.imRoleAndEngagement === undefined ? " " : formData["fundLaunchedDate"]}
                                value={formData["imRoleAndEngagement"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                        </CardContent>
                    </Card>
                    <div style={{marginTop: "10px"}}>
                    <ListFiles 
                        id={`engagementAndRole${id}`} refreshId={engagementAndRoleRefreshId}/>
                    </div>
                    <Button
                        onClick={(e) => handleClick(e, "previous")}
                        variant="outlined"
                        disableElevation
                        sx={{ textTransform: 'none', mt: 9, mb: 3, ml: 2, width: '90px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} >
                        Download
                    </Button>
                    <DocumentUpload id={`engagementAndRole${id}`} onSuccess={engagementAndRoleSuccess}>
                    <Button
                        // onClick={(e) => handleClick(e, "previous")}
                        variant="outlined"
                        disableElevation
                        sx={{ textTransform: 'none', mt: 9, mb: 3, ml: 2, width: '90px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} >
                        Upload
                    </Button>
                    </DocumentUpload>
                    <Divider sx={{ mt: 2 }} />
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 4 of 5</Typography>
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


export default EngagementAndRole;
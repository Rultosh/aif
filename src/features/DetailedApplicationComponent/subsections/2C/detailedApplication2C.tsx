import { IconButton, Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

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
import { defaultIDetailedApplication2C, IDetailedApplication2C } from "./IDetailedApplication2C";
import { detailedApplication2CThunk, selectDetailedApplication2C } from "./detailedApplication2CSlice";
import { updateNavIndex } from '../sideNavBarSlice'
import { Delete } from "@mui/icons-material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import React, * as Rect from 'react'
import FileUpload from "../../../../components/FileUpload";
import UploadComponents from '../uploadComponents'
import SaveIcon from '@mui/icons-material/Save';

export const DetailedApplication2C = (props: any) => {

    const params = useParams()
    const parentId = Number(params.id)
    const [formData, setFormData] = useState(defaultIDetailedApplication2C);
    const actionId = useState(uuid());
    const controller = new Controller(actionId, detailedApplication2CThunk);
    const state = useAppSelector(selectDetailedApplication2C);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();


    const handleOnClickUpload = () => {
        setOpen(true)
    }
    useEffect(() => {
        dispatch(updateNavIndex(2))
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: Number(parentId) })
                controller.all({ ...formData, parentId: Number(parentId) });
            }
        }
    }, [])

    useEffect(() => {
        dispatch(updateNavIndex(2))
        if (state[parentId]?.data && Object.keys(state[parentId]?.data).length > 0 && props.isCrtStateToUpdate(state[parentId]?.data, defaultIDetailedApplication2C)) {
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
        //controller.clear({ ...formData, parentId: parentId });
        if (navTo === 'next') {
            navigate(`/Detailed/${parentId}/detailed2D`);
        }
        else {
            navigate(`/Detailed/${parentId}/detailed2B`);
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
                                sx={{ textTransform: 'none', position: 'fixed' }} >
                                Save
                            </Button>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>C. Investment, divestment & other matters </Typography>


                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="approvers"
                                label="16. Who approves investment and divestment decisions? Please give details of the process of evaluation of the deals and approvals / investments/exits thereafter."
                                //defaultValue={formData.approvers === undefined ? " " : formData["approvers"]}
                                value={formData["approvers"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ flex: 1, color: '#363062', ml: 2, mb: 1 }} >17. Please provide policy for nomination of representatives on any of the Committees and furnish details of the composition of the Investment Committee (IC), reporting relationships between the IC and the Investment Manager.</Typography>
                            <TextField
                                required
                                id="nominatinPolicy"
                                //label="17. Please provide policy for nomination of representatives on any of the Committees and furnish details of the composition of the Investment Committee (IC), reporting relationships between the IC and the Investment Manager."
                                //defaultValue={formData.nominatinPolicy === undefined ? " " : formData["nominatinPolicy"]}
                                value={formData["nominatinPolicy"] || ''}
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
                                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', ml: 2, mb: 1 }} >18. Please furnish detailed profile, remuneration details, location of each member of the IC</Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                                <div style={{ margin: "15px" }}>
                                    <UploadComponents id={`detailedApplicationDetailedProfile${formData.id}`}></UploadComponents>
                                </div>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid container>
                                <Grid item xs={9}>
                                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', ml: 2, mb: 1 }} >19. Please furnish profile, location and remuneration details, location of each member of the Advisory Board(if applicable).</Typography>
                                    {/*<InputLabel variant="standard" sx={{ ml: 2 }}>

                                        <FileUploadIcon onClick={handleOnClickUpload} >
                                        </FileUploadIcon>
                                        <FileUpload
                                            id={props.id}
                                            onSuccess={(id: String, url: String) => {
                                                props.onSuccess(props.id, url);
                                            }}
                                            open={open} setOpen={setOpen}></FileUpload>
                                        </InputLabel> */}
                                </Grid>

                            </Grid>
                            <Grid item xs={3}>
                                <div style={{ margin: "15px" }}>
                                    <UploadComponents id={`profileLocRenum${formData.id}`}></UploadComponents>
                                </div>
                            </Grid>
                        </CardContent>
                    </Card>


                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: '#363062', ml: 2, mb: 1 }} >20. What is your investment strategy and what is its basis? What are the focus investment sectors for the fund? How does the investment strategy compare to the past fund strategies (if applicable)? Explain the reason for any significant change in your strategy. Are there any sectors or types of transactions/situations you would not invest in? If yes, please give details and reasons for the same</Typography>
                            <TextField
                                required
                                id="investmentStrategy"
                                //label="20. What is your investment strategy and what is its basis? What are the focus investment sectors for the fund? How does the investment strategy compare to the past fund strategies (if applicable)? Explain the reason for any significant change in your strategy. Are there any sectors or types of transactions/situations you would not invest in? If yes, please give details and reasons for the same"
                                //defaultValue={formData.investmentStrategy === undefined ? " " : formData["investmentStrategy"]}
                                value={formData["investmentStrategy"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>21. Describe the following investment considerations: </Typography>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="grossReturnObjective"
                                label="Gross return objective of the overall fund"
                                //defaultValue={formData.grossReturnObjective === undefined ? " " : formData["grossReturnObjective"]}
                                value={formData["grossReturnObjective"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="targetSizePercentage"
                                label="Target investment size and percentage stake"
                                //defaultValue={formData.targetSizePercentage === undefined ? " " : formData["targetSizePercentage"]}
                                value={formData["targetSizePercentage"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="targetNumberOfInvestmentPlanned"
                                label="Target number of investments planned"
                                //defaultValue={formData.targetNumberOfInvestmentPlanned === undefined ? " " : formData["targetNumberOfInvestmentPlanned"]}
                                value={formData["targetNumberOfInvestmentPlanned"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="avgHoldingPeriod"
                                label="Average holding period for a typical investment"
                                //defaultValue={formData.avgHoldingPeriod === undefined ? " " : formData["avgHoldingPeriod"]}
                                value={formData["avgHoldingPeriod"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="exitStrategy"
                                label="Exit strategy"
                                //defaultValue={formData.exitStrategy === undefined ? " " : formData["exitStrategy"]}
                                value={formData["exitStrategy"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: '#363062', ml: 2, mb: 1 }} >22. What controls and rights do you take / plan to take with minority shares? How do you ensure / propose to ensure your ability to exit when an opportunity comes? Will the fund typically be looking at gaining control positions? If yes, do you have the skills set to manage such investments? If yes, please give details.</Typography>
                            <TextField
                                required
                                id="controlsAndRights"
                                //label='22. What controls and rights do you take / plan to take with minority shares? How do you ensure / propose to ensure your ability to exit when an opportunity comes? Will the fund typically be looking at gaining control positions? If yes, do you have the skills set to manage such investments? If yes, please give details.'
                                //defaultValue={formData.controlsAndRights === undefined ? " " : formData["controlsAndRights"]}
                                value={formData["controlsAndRights"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: '#363062', ml: 2, mb: 1 }} >23. In how many cases in your previous fund(s), were you active in replacing the management team when it was needed? How successful was the fund in doing so?</Typography>
                            <TextField
                                required
                                id="managementReplacements"
                                //label='23. In how many cases in your previous fund(s), were you active in replacing the management team when it was needed? How successful was the fund in doing so?'
                                //defaultValue={formData.managementReplacements === undefined ? " " : formData["managementReplacements"]}
                                value={formData["managementReplacements"] || ''}
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
                                id="investmentRollover"
                                label='24. Have you had any investments rolled over from previous fund(s)? Please give details'
                                //defaultValue={formData.investmentRollover === undefined ? " " : formData["investmentRollover"]}
                                value={formData["investmentRollover"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(C) of 5</Typography>
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


export default DetailedApplication2C;
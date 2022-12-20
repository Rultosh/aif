import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, FormControlLabel, Switch } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams } from "react-router-dom";



export const EngagementAndRole = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


        const handleClick = (ev: any, navTo: string) => {
            if (navTo === 'next') {
                navigate(`/Detailed/${id}/carryDistribution`);
            }
            else{
                navigate(`/Detailed/${id}/detailed2K`);
            }
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
                                id="captionDetails"
                                label="Please provide details as per caption"
                                //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                //value={formData["fundLaunchedDate"]}
                                variant="standard"
                               // onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>
                    <Button
                        onClick={(e) => handleClick(e, "previous")}
                        variant="outlined"
                        disableElevation
                        sx={{ textTransform: 'none', mt: 9, mb: 3, ml: 2 ,width:'90px',backgroundColor:'white',color:'black',borderColor:'black'}} >
                        Download
                    </Button>
                    <Button
                        onClick={(e) => handleClick(e, "previous")}
                        variant="outlined"
                        disableElevation
                        sx={{ textTransform: 'none', mt: 9, mb: 3, ml: 2 ,width:'90px',backgroundColor:'white',color:'black',borderColor:'black'}} >
                        Upload
                    </Button>
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
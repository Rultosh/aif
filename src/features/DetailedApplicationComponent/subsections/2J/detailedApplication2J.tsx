import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, FormControlLabel, Switch, Checkbox, FormGroup } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import {updateNavIndex}from '../sideNavBarSlice'
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";

export const DetailedApplication2J = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>(false);
    const [agreed, setAgreed] = useState(false);
    const dispatch = useAppDispatch();


    useEffect(() => {
        dispatch(updateNavIndex(9))
        
    })

    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate(`/Detailed/${id}/detailed2K`);
        }
        else{
            navigate(`/Detailed/${id}/detailed2I`);
        }
    }

    function handleChange() {

        setAgreed(!agreed)
    }

    return (<>
        <SideNavBar></SideNavBar>
        <Grid item xs={9}>
            <Card sx={{ display: 'flex', mb: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Detailed Application</Typography>

                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>J. KYC Details and Undertakings</Typography>

                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>53. Details of Board of Directors of Trustee Company, AMC, Sponsor, Advisory Board, Members of IC, I nvestment/Management Team to be provided in the format attached (Annexure I) for verification of Defaulter's Checklist.</Typography>
                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Download Annexure - I
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileUploadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Upload Annexure - I
                            </Button>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>54. Whether provision of the connected lending by the select all-India Financial Institutions (Fls) of RBI vide letter dated December 21, 2002 attracted, (Annexure II).</Typography>
                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Download Annexure - II
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileUploadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Upload Annexure - II
                            </Button>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />

                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>55. KYC Form of the Board of Directors of Trustee Company, AMC, Sponsor, Advisory Board, Members of IC, Investment/Management Team to be provided in the format attached in Annexure III. Along with the self-attested copy of POI (Proof of Identity), POA (Proof of address permanent and correspondent), Two passport size photograph for purpose of KYC.</Typography>
                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Download Annexure - III
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileUploadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Upload Annexure - III
                            </Button>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>56. Board resolution or the requisite documents for such authorization to submit application on behalf of the IM</Typography>
                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Download
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileUploadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Upload
                            </Button>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                    </Grid>
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(J) of 5</Typography>
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


export default DetailedApplication2J;
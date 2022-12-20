import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import {updateNavIndex}from '../sideNavBarSlice'
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";

export const DetailedApplication2F = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>(false);
    const dispatch = useAppDispatch();


    useEffect(() => {
        dispatch(updateNavIndex(5))
    })
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate(`/Detailed/${id}/detailed2G`);
        }
        else{
            navigate(`/Detailed/${id}/detailed2E`);
        }
    }


    return (<>
        <SideNavBar></SideNavBar>
        <Grid item xs={9}>

            <Card sx={{ display: 'flex', mb: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Detailed Application</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>F. MIS and communication to contributors </Typography>
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>30. What is the reporting structure / procedure for the contributors (quarterly / half-yearly / annual) .</Typography>
                    <Typography sx={{ flex: 1, color: '#363062', mt: 2, ml: 7 }}>1. Bulletins (attached sample)</Typography>
                    <Typography sx={{ flex: 1, color: '#363062', ml: 7 }}>2. NAV reporting </Typography>
                    <Typography sx={{ flex: 1, color: '#363062', ml: 7 }}>3. Detailed valuation report </Typography>
                    <Typography sx={{ flex: 1, color: '#363062', ml: 7 }}>4. Guidelines for calculating NAV</Typography>


                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="listOfExternalFirms"
                                label=""
                                //defaultValue={formValue.nameOfTheTrustee === undefined ? " " : formValue["NameOfTheFund"]}
                                //value={formValue["NameOfTheFund"]}
                                variant="standard"
                                //onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>


                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="monitoringPractices"
                                label="31. Frequency of meetings to update the contributor. "
                                //defaultValue={formValue.nameOfTheTrustee === undefined ? " " : formValue["NameOfTheFund"]}
                                //value={formValue["NameOfTheFund"]}
                                variant="standard"
                                //onChange={handleChange}

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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(F) of 5</Typography>
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


export default DetailedApplication2F;
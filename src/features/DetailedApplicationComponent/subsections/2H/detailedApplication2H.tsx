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

export const DetailedApplication2H = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>(false);
    const dispatch = useAppDispatch();

       
    useEffect(() => {
        dispatch(updateNavIndex(7))
        
    })

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate(`/Detailed/${id}/detailed2I`);
        }
        else{
            navigate(`/Detailed/${id}/detailed2G`);
        }
    }

    let listItem = ["a. Name of the fund(s), features of the fund like industry / sector / investment stage / geographic focus etc. (as may be applicable),", "b. total corpus, total amount invested, total number of investments, average investment size,", "c. total amount distributed to the contributors,", "d. undrawn capital (if any, with reasons thereof),", "e. IRR of the kind (full exits, partial exits, entire fund, in the hands of the contributors),", "f. Please furnish the list of investee companies along with their status (current valuation / exit value) of those fund(s)."]
    let subListItem = [":- Company & amount invested holding & valuation (pre-money and post-money)", ":- Key reasons for the investment & basis for investment valuation", ":- What was / is the value add made by the Investment Manager", ":- Strategy for exit (if not exited);", ":- If not exited (as on date), then valuation as on recent date along with valuation report", ":- If exited, then exit amount, IRR on exit, method of exit."]
    return (<>
        <SideNavBar></SideNavBar>
        <Grid item xs={9}>

            <Card sx={{ display: 'flex', mb: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Detailed Application</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>H. Past fund(s) managed by the Investment Manager </Typography>

                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>43. If the Investment Manager is managing other VC / PE funds, please give details thereof including -</Typography>


                    <Card sx={{ display: 'flex', mb: 2, ml: 4, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            {listItem.map((item) => (
                                <div>
                                    <ListItem>
                                        <Typography variant="body2" sx={{ flex: 1, color: '#363062' }}>{item}</Typography>
                                    </ListItem>

                                </div>
                            ))}
                            {subListItem.map((subItem) => (
                                <div>
                                    <ListItem>
                                        <Typography variant="body2" sx={{ flex: 1, ml: 3, color: '#363062' }}>{subItem}</Typography>
                                    </ListItem>

                                </div>
                            ))}

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />

                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>44. Any disputes / litigations with </Typography>
                    <Typography sx={{ flex: 1, color: '#363062', mt: 4, ml: 7 }}>1. Income Tax, Service Tax, or any other regulatory authorities etc. </Typography>
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, ml: 7 }}>2. any of the investee companies etc.</Typography>




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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(H) of 5</Typography>
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


export default DetailedApplication2H;
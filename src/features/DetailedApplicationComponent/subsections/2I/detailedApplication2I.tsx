import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, FormControlLabel, Switch } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import {updateNavIndex}from '../sideNavBarSlice'
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";

export const DetailedApplication2I = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(updateNavIndex(8))
        
    })

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate(`/Detailed/${id}/detailed2J`);
        }
        else{
            navigate(`/Detailed/${id}/detailed2H`);
        }
    }

    return (<>
        <SideNavBar></SideNavBar>
        <Grid item xs={9}>

            <Card sx={{ display: 'flex', mb: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Detailed Application</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>I. Fund Related Documents</Typography>

                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>45. Private Placement Memorandum (filename should be named as Fundname_PPM_Date)</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>46. Latest Investor presentation (filename should be named as Fundname_Pitch_Date)</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>47. Contribution agreement (draft); also attach copies of agreements signed with other contributors. (filename should be named as Fundname_Contributor_Date)</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>48. Investment Management Agreement (filename should be named as Fundname_IM_Agmt_Date)</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>49. Trust deed (filename should be named as Fundname_TrustDeed_Date)</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>50. SEBI registration certificate. (filename should be named as Fundname_SEBI_Certificate_Date)</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>51. Compliance certificate on SEBI's VCF/AIF Regulations, if applicable. If not applicable, please give reasons, if any.</Typography>
                    <FormControlLabel sx={{ mt: 2, mb: 2, ml: 2 }} control={<Switch />} label="No" />
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="reason"
                                label='If No, reasons therefore'
                                // defaultValue={formData.reason === undefined ? " " : formData["reason"]}
                                //value={formData["reason"]}
                                variant="standard"
                                //onChange={handleChange}
                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent></Card>
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(I) of 5</Typography>
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


export default DetailedApplication2I;
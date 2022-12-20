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

export const DetailedApplication2K = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>(false);
    const [agreed, setAgreed] = useState(false);
    const dispatch = useAppDispatch();


    useEffect(() => {
        dispatch(updateNavIndex(10))
       
    })

    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate(`/Detailed/${id}/InvestmentThemeOfFund`);
        }
        else{
            navigate(`/Detailed/${id}/detailed2J`);
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
                <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>K. Declaration</Typography>
                <Card sx={{ display: 'flex', mb: 2, background: '#f2f2f2' ,color:'#363062'}}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography sx={{ flex: 1, fontWeight: 'bold' }}>I / We (Partner/Directors) hereby declare that</Typography>
                        <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>1.  The information given above and the statements and other papers enclosed are to be the best of our knowledge and belief,true and correct in all particulars.</Typography>
                        <Divider />
                        <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>2.  There are no arrears of statutory dues and no government enquiries/proceedings/prosecution/legal acrtion are pending/initiated against the Fund / Sponsor/ AMC / Trustee Company / promoters / directors / partners except as indicated in the application.</Typography>
                        <Divider />
                        <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>3.  I / We also confirm that I/none of the Sponsors / promoters or directors or partners have at any time declared themselves as insolvent;</Typography>
                        <Divider />
                        <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>4.  I / We have no objection if SIDBI furnishes the information submitted by me/us to other banks /FIs/CIBIL/RBI/any other agency may be deemed fit in connection with considaration of my.our application for capital Commitment to the proposed venture capital fund.</Typography>
                        <Divider />
                        <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>5.  I / We have no objection if SIDBI and/or its representatives making necessary enquiries/verification (incuding in CIBIL or any other credit information agencies database) while considering my/our application for capital contribution. I / We undertake to furnish all other information that may be by SIDBI in connection with my/ our application for capital Commitment.</Typography>
                        <Divider />
                        <FormGroup>
                            <FormControlLabel sx={{ mt: 2 }} control={<Checkbox checked={agreed} onChange={handleChange} />} label={<Typography sx={{ flex: 1, fontWeight: 'bold' }}>I Accept the condition</Typography>} />
                        </FormGroup>
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
                            <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(K) of 5</Typography>
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


export default DetailedApplication2K;
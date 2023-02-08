import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, FormControlLabel, Switch, Checkbox, FormGroup, IconButton } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import {updateNavIndex, updateStepperIndex}from '../sideNavBarSlice'
import uuid from "react-uuid";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { Controller } from "../../../../lib/api-wrappers/Controller";
import { detailedApplicationThunk, selectedDetailedApplications } from '../../../detailedApplication/sidbiReference/detailedApplicationSlice';
import { defaultIDetailedApplication } from "../../../detailedApplication/sidbiReference/IDetailedApplication";
import SaveIcon from '@mui/icons-material/Save';

export const DetailedApplication2K = (props: any) => {

    const params = useParams()
    const parentId  = Number(params.id)
    const [formData, setFormData] = useState(defaultIDetailedApplication);
    const [actionId] = useState(uuid())
    const controller = new Controller(actionId, detailedApplicationThunk);
    const state = useAppSelector(selectedDetailedApplications);
    const [agreed, setAgreed] = useState(false);
    const [submitForm, setSubmitForm] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })
    
    useEffect(() => {
        dispatch(updateNavIndex(10))
        dispatch(updateStepperIndex(1))

    })

    const handleClick = (ev: any, navTo: string) => {
        handleSave()
        if (navTo === 'next') {
            navigate(`/Detailed/${parentId}/InvestmentThemeOfFund`);
        }
        else{
            navigate(`/Detailed/${parentId}/detailed2J`);
        }
    }

    function handleChange1() {

        setAgreed(!agreed)
    }


    useEffect(() => {
        if (parentId && Number(parentId)) {
          if (!state[0]?.data[parentId]) {
            controller.fetch({ ...formData, parentId: Number(parentId) });
            }
        }
    }, [])

    useEffect(() => {
        let newData = state[0]?.data[Number(parentId)];
        if (newData) setFormData(newData)
    }, [state[0]?.data])

    /*const handleChange = (key:string) => {
      //ev.preventDefault();
      setAgreed(!agreed)
      let copiedValue = { ...formData }
      //let key =  'declarationAccepted'
      copiedValue[key as keyof typeof formData]   = (!agreed).toString() ?? " ";
      setFormData(copiedValue);
    };*/

    const handleChange = (ev: any) => {
        ev.preventDefault();
        setAgreed(!agreed)
        let copiedValue = { ...formData }
        copiedValue.declarationAccepted = !agreed;//Boolean(ev.target.value);
        setFormData(copiedValue);
    };

    const handleSave = () => {
        controller.save(formData);
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
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>K. Declaration</Typography>
                    <Card sx={{ display: 'flex', mb: 2, background: '#f2f2f2', color: '#363062' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ flex: 1, fontWeight: 'bold' }}>I / We (Partner/Directors) hereby declare that</Typography>
                            <Typography variant="body2" sx={{ flex: 1, mt: 2, mb: 2 }}>1.  The information given above and the statements and other papers enclosed are to be the best of our knowledge and belief,true and correct in all particulars.</Typography>
                            <Divider />
                            <Typography variant="body2" sx={{ flex: 1, mt: 2, mb: 2 }}>2.  There are no arrears of statutory dues and no government enquiries/proceedings/prosecution/legal action are pending/initiated against the Fund / Sponsor/ AMC / Trustee Company / promoters / directors / partners except as indicated in the application.</Typography>
                            <Divider />
                            <Typography variant="body2" sx={{ flex: 1, mt: 2, mb: 2 }}>3.  I / We also confirm that I/none of the Sponsors / promoters or directors or partners have at any time declared themselves as insolvent;</Typography>
                            <Divider />
                            <Typography variant="body2" sx={{ flex: 1, mt: 2, mb: 2 }}>4.  I / We have no objection if SIDBI furnishes the information submitted by me/us to other banks /FIs/CIBIL/RBI/any other agency may be deemed fit in connection with considaration of my.our application for capital Commitment to the proposed venture capital fund.</Typography>
                            <Divider />
                            <Typography variant="body2" sx={{ flex: 1, mt: 2, mb: 2 }}>5.  I / We have no objection if SIDBI and/or its representatives making necessary enquiries/verification (incuding in CIBIL or any other credit information agencies database) while considering my/our application for capital contribution. I / We undertake to furnish all other information that may be by SIDBI in connection with my/ our application for capital Commitment.</Typography>
                            <Divider />
                            <FormGroup>
                                {/*<FormControlLabel sx={{ mt: 2 }} control={<Checkbox checked={agreed} onChange={handleChange} />} label={<Typography sx={{ flex: 1, fontWeight: 'bold' }}>I Accept the condition</Typography>} /> */}
                                {/*state[0]?.status[actionId].actionStatus.fetchStatus == 'idle' ? <FormControlLabel sx={{ mt: 2 }} name="declarationAccepted" value={!agreed} control={<Checkbox defaultChecked={true}  onChange={handleChange} />} label={<Typography sx={{ flex: 1, fontWeight: 'bold' }}>I Accept the condition</Typography>} /> : null}*/}
                                {/*<FormControlLabel sx={{ mt: 2 }} name="declarationAccepted" value={!agreed} control={<Checkbox defaultChecked={true}  onChange={handleChange} />} label={<Typography sx={{ flex: 1, fontWeight: 'bold' }}>I Accept the condition</Typography>} />*/}
                                <FormControlLabel sx={{mt:2}} control={<Checkbox  checked={agreed}  onChange={handleChange}/>} label= {<Typography sx={{ flex: 1, fontWeight: 'bold' }}>I / We (Partner/Directors) hereby declare that</Typography>} />

                            </FormGroup>
                            {agreed == false && submitForm == true ?
                                <div style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>This value is required</>
                                    </Typography>
                                </div> : <></>}
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
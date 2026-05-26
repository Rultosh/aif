import { IconButton, InputLabel, Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import {updateNavIndex}from '../sideNavBarSlice'
import UploadComponents from "../uploadComponents";
import uuid from "react-uuid";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { Controller } from "../../../../lib/api-wrappers/Controller";
import { detailedApplicationThunk, selectedDetailedApplications } from '../../../detailedApplication/sidbiReference/detailedApplicationSlice';
import { defaultIDetailedApplication } from "../../../detailedApplication/sidbiReference/IDetailedApplication";
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const DetailedApplication2H = (props:any) => {

    const params = useParams()
    const parentId  = Number(params.id)
    const [formData, setFormData] = useState(defaultIDetailedApplication);
    const [actionId] = useState(uuid())
    const controller = new Controller(actionId, detailedApplicationThunk);
    const state = useAppSelector(selectedDetailedApplications);
    const [agreed, setAgreed] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })
    
       

    useEffect(() => {
        dispatch(updateNavIndex(7))
        
    })

    
    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...formData }
        let key = ev.target.id ? ev.target.id : ev.target.name;
        copiedValue[key as keyof typeof formData] = ev.target.value;
        setValue(ev.target.name, ev.target.value);
        setFormData(copiedValue);
    };

  const handleSave = () => {
    controller.save(formData);
  }

    
  useEffect(() => {
    if (parentId && Number(parentId)) {
      if (!state[0]?.data[parentId]) {
        controller.fetch({ ...formData, id: Number(parentId) });
      }
    }
  }, [])

  useEffect(() => {
    let newData = state[0]?.data[Number(parentId)];
    if (newData) setFormData(newData)
  }, [state[0]?.data])


    const handleClick = (ev: any, navTo: string) => {
        handleSave()
        if (navTo === 'next') {
            navigate(`/Detailed/${parentId}/detailed2I`);
        }
        else{
            navigate(`/Detailed/${parentId}/detailed2G`);
        }
    }

    let listItem = ["a. Name of the fund(s), features of the fund like industry / sector / investment stage / geographic focus etc. (as may be applicable),", "b. total corpus, total amount invested, total number of investments, average investment size,", "c. total amount distributed to the contributors,", "d. undrawn capital (if any, with reasons thereof),", "e. IRR of the fund (full exits, partial exits, entire fund, in the hands of the contributors),", "f. Please furnish the list of investee companies along with their status (current valuation / exit value) of those fund(s)."]
    let subListItem = ["• Company & amount invested", "• % holding & valuation (pre-money and post-money)", "• Key reasons for the investment & basis for investment valuation", "• What was / is the value add made by the Investment Manager", "• Strategy for exit (if not exited);", "• If not exited (as on date), then valuation as on recent date along with valuation report", "• If exited, then exit amount, IRR on exit, method of exit."]
    
    const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
    const htmlTagsNotAllowed = "Tags not allowed in input.";

    const validationSchema = Yup.object().shape({
        disputes: Yup.string().required("Disputes is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable()
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if(formData.id != undefined){
            reset(formData);
        }
    }, [formData])

    const onSubmit = (data: any) => {
        setFormData(data);
        handleSave();
    };

    const onSubmitNext = (data: any) => {
        setFormData(data);
        handleClick('', "next")
    };

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
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
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
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>H. Past fund(s) managed by the Investment Manager </Typography>

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>43. If the Investment Manager is managing other VC / PE funds, please give details thereof including -</Typography>


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

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{margin: "15px"}}>
                                    <Button href="/aif/portal/templates/SASF_Fund Track Record Template.xlsx">Download Template</Button>
                                    <UploadComponents id={`imPastFund${parentId}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    
                    <Divider sx={{ mt: 2 }} />

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>44. Any disputes / litigations with </Typography>
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mt: 4, ml: 7 }}>1. Income Tax, Service Tax, or any other regulatory authorities etc. </Typography>
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, ml: 7 }}>2. any of the investee companies etc.</Typography>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="disputes"
                                label=""
                                {...register("disputes")}
                                error={errors.disputes ? true : false}
                                //defaultValue={formData.monitoringPractices === undefined ? " " : formData["monitoringPractices"]}
                                value={formData["disputes"] || ''}
                                variant="standard"
                                multiline
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.disputes ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.disputes?.message}</>
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(H) of 5</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={4} sx={{ justifyContent: 'right' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <Button
                                    onClick={handleSubmit(onSubmitNext)}
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
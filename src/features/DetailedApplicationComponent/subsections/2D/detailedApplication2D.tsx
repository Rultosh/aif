import { IconButton, Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField } from "@mui/material";

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
import { defaultIDetailedApplication2D, IDetailedApplication2D } from "./IDetailedApplication2D";
import { detailedApplication2DThunk, selectDetailedApplication2D } from "./detailedApplication2DSlice";
import {updateNavIndex}from '../sideNavBarSlice'
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const DetailedApplication2D = (props: any) => {

    const params = useParams()
    const parentId  = Number(params.id)
    const [formData, setFormData] = useState(defaultIDetailedApplication2D);
    const actionId = useState(uuid());
    const controller = new Controller(actionId, detailedApplication2DThunk);
    const state = useAppSelector(selectDetailedApplication2D);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })
    
    useEffect(() => {
        dispatch(updateNavIndex(3))
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: parentId })
                controller.all({ ...formData, parentId: parentId });
            }
        }
    }, [])

    useEffect(() => {
        dispatch(updateNavIndex(3))
        if (state[parentId]?.data && Object.keys(state[parentId]?.data).length > 0 && props.isCrtStateToUpdate(state[parentId]?.data, defaultIDetailedApplication2D)){
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
        setValue(ev.target.name, ev.target.value);
        setFormData(copiedValue);
    };

    const handleSave = () => {
        controller.save(formData);
    }


    const handleClick = (ev: any, navTo: string) => {
        handleSave()
        if (navTo === 'next') {
            navigate(`/Detailed/${parentId}/detailed2E`);
        }
        else{
            navigate(`/Detailed/${parentId}/detailed2C`);
        }
    }
    
    const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
    const htmlTagsNotAllowed = "Tags not allowed in input.";

    const validationSchema = Yup.object().shape({
        numberOfDealsEvaluated: Yup.string().required("Total number of business plans / deals evaluated since fund inception is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        sourcingBreakUps: Yup.string().required("Break-up of sourcing of the deals - investment banks, sponsor network, direct etc is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        businessPlanBreakUps: Yup.string().required("Break-up of business plans / deals industry / sector-wise and stage-wise is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        conversionRation: Yup.string().required("Conversion Ration is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable()
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
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>D. Deal flow</Typography>

                    <Typography variant="body2"  sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>25. Please furnish following information (fund-wise):</Typography>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="numberOfDealsEvaluated"
                                label="A. Total number of business plans / deals evaluated since fund inception"
                                {...register("numberOfDealsEvaluated")}
                                error={errors.numberOfDealsEvaluated ? true : false}
                                //defaultValue={formData.numberOfDealsEvaluated === undefined ? " " : formData["numberOfDealsEvaluated"]}
                               value={formData["numberOfDealsEvaluated"] || ''}
                                variant="standard"
                                onChange={handleChange}
                                multiline

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.numberOfDealsEvaluated ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.numberOfDealsEvaluated?.message}</>
                                    </Typography>
                                </div> : <></>}
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="sourcingBreakUps"
                                label="B. Break-up of sourcing of the deals - investment banks, sponsor network, direct etc."
                                {...register("sourcingBreakUps")}
                                error={errors.sourcingBreakUps ? true : false}
                                //defaultValue={formData.sourcingBreakUps === undefined ? " " : formData["sourcingBreakUps"]}
                               value={formData["sourcingBreakUps"] || ''}
                                variant="standard"
                                onChange={handleChange}
                                multiline

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.sourcingBreakUps ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.sourcingBreakUps?.message}</>
                                    </Typography>
                                </div> : <></>}
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="businessPlanBreakUps"
                                label="C. Break-up of business plans / deals industry / sector-wise and stage-wise. "
                                {...register("businessPlanBreakUps")}
                                error={errors.businessPlanBreakUps ? true : false}
                                //defaultValue={formData.businessPlanBreakUps === undefined ? " " : formData["businessPlanBreakUps"]}
                               value={formData["businessPlanBreakUps"] || ''}
                                variant="standard"
                                onChange={handleChange}
                                multiline

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.businessPlanBreakUps ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.businessPlanBreakUps?.message}</>
                                    </Typography>
                                </div> : <></>}
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, ml: 7, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="conversionRation"
                                label="D. Conversion ratio for transactions sourced to those completed."
                                {...register("conversionRation")}
                                error={errors.conversionRation ? true : false}
                                //defaultValue={formData.conversionRation === undefined ? " " : formData["conversionRation"]}
                               value={formData["conversionRation"] || ''}
                                variant="standard"
                                onChange={handleChange}
                                multiline

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.conversionRation ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.conversionRation?.message}</>
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(D) of 5</Typography>
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


export default DetailedApplication2D;
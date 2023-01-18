import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, FormControlLabel, Switch, FormControl, InputLabel } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MasterData from "../../../components/master-data/MasterData";
import { useAppSelector, useAppDispatch } from ".././../../app/hooks";
import { Controller } from "../../../lib/api-wrappers/Controller";
import uuid from "react-uuid";
import { useParams } from "react-router-dom";
import { defaultICarryDistribution, ICarryDistribution } from "./ICarryDistribution";
import { carryDistributionThunk, selectCarryDistribution } from "./carryDistributionSlice";
import { defaultICarryDistributionDetails } from "./ICarryDistributionDetails";
import { carryDistributionDetailsThunk, selectCarryDistributionDetails } from "./carryDistributionDetailsSlice";
import UploadComponents from "../subsections/uploadComponents";
import React, * as Rect from 'react'
import { updateStepperIndex } from '../subsections/sideNavBarSlice'
import { wrapArgument } from "../../../lib/api-status/actionWrapper";
import { createApplicationAsync } from "../../../../src/features/fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice"
import { selectedDetailedApplications, detailedApplicationThunk } from "../../detailedApplication/sidbiReference/detailedApplicationSlice";
import { defaultIDetailedApplication } from "../../detailedApplication/sidbiReference/IDetailedApplication";

export const CarryDistribution = (props: any) => {


    const params = useParams()
    const parentId = Number(params.id)
    const [formData, setFormData] = useState(defaultICarryDistribution);
    const [actionId] = useState(uuid());
    const controller = new Controller(actionId, carryDistributionThunk);
    const state = useAppSelector(selectCarryDistribution);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [formDataDetailsList, setFormDataDetailsList] = useState({} as any);
    const [formDataDetails, setFormDataDetails] = useState(defaultICarryDistributionDetails);
    const detailsController = new Controller(actionId, carryDistributionDetailsThunk);
    const detailsState = useAppSelector(selectCarryDistributionDetails);
    const detailedApplicationState = useAppSelector(selectedDetailedApplications);
    const detailedController = new Controller(actionId, detailedApplicationThunk);
    const [prilimFormData, setPrilimFormData] = useState(defaultIDetailedApplication);
    const [commentPreview, setCommentPreview] = useState<String | undefined>(" ");

    //const prelimApplicationId = detailedApplicationState.



    useEffect(() => {
        dispatch(updateStepperIndex(4))
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: parentId })
                controller.all({ ...formData, parentId: parentId });
            }
        }
    }, [])

    useEffect(() => {
        dispatch(updateStepperIndex(4))
        if (state[parentId]?.data && Object.keys(state[parentId]?.data).length > 0 && props.isCrtStateToUpdate(state[parentId]?.data, defaultICarryDistribution)) {
            Object.keys(state[parentId]?.data).map((key) => {
                let value = state[parentId]?.data[key]
                if (value && value.id) {
                    setFormData(value);
                }
            });
        }
    }, [state[parentId]?.data])


    useEffect(() => {
        if (parentId) {

            if (!detailsState[parentId]?.data[0]) {
                setFormDataDetails({ ...formDataDetails, parentId: parentId })
                detailsController.all({ ...formDataDetails, parentId: parentId });
            }
        }
    }, [])

    useEffect(() => {
        if (detailsState[parentId]?.data && Object.keys(detailsState[parentId]?.data).length > 0 && props.isCrtStateToUpdate(detailsState[parentId]?.data, defaultICarryDistributionDetails)) {
            Object.keys(detailsState[parentId]?.data).map((key) => {
                let value = detailsState[parentId]?.data[key]
                if (value && value.id) {
                    setFormDataDetails(value);
                }
            });
        }
    }, [detailsState[parentId]?.data])

    useEffect(() => {
        if (detailsState[parentId]?.data != undefined && (Object.keys(detailsState[parentId]?.data).length > 0) && props.isCrtStateToUpdate(detailsState[parentId]?.data, defaultICarryDistributionDetails)) {
            let newData = detailsState[parentId]?.data;
            if (newData) {
                setFormDataDetailsList(newData)
            }
        }
    }, [detailsState[parentId]?.data])

    useEffect(() => {
        console.log("sampath test ", formDataDetailsList)
    }, [formDataDetailsList])

    useEffect(() => {

        if (parentId) {
            if (!detailedApplicationState[0]?.data[parentId]) {
                detailedController.fetch({ ...prilimFormData, id: parentId });
            }
        }
    }, [])

    useEffect(() => {

        let newData = detailedApplicationState[0]?.data[parentId];
        if (newData) setPrilimFormData(newData)
    }, [detailedApplicationState[0]?.data])

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...formData }
        let key = ev.target.id ? ev.target.id : ev.target.name;
        copiedValue[key as keyof typeof formData] = ev.target.value;
        setFormData(copiedValue);
    };

    const handleChangeCarryDetails = (ev: any, id_key: any) => {
        ev.preventDefault();
        let copiedValue = { ...formDataDetailsList }
        let key = ev.target.id ? ev.target.id : ev.target.name;
        let statusCopy = Object.assign({}, copiedValue[id_key]);
        statusCopy[key] = ev.target.value;
        let obj = {} as any
        obj[id_key] = statusCopy
        copiedValue = { ...copiedValue, ...obj }
        setFormDataDetailsList(copiedValue);
    };

    const handleSave = () => {
        controller.save(formData);
        for (let i = 0; i < Object.keys(formDataDetailsList).length; i++) {
            detailsController.save(formDataDetailsList[Object.keys(formDataDetailsList)[i]]);
        }

    }

    const getAmount = () => {
        let sum = (Number(formData?.capitalAmount) || 0) + (Number(formData?.hurdleAmount) || 0) + (Number(formData.catchupAmount) || 0) + (Number(formData.profitAmount) || 0) + (Number(formData.carryAmount || 0))
        console.log(sum)
        return sum
    }

    const getBalanceAmount = () => {
        let sum = (Number(formData?.capitalBalance) || 0) + (Number(formData?.hurdleBalance) || 0) + (Number(formData.catchupBalance) || 0) + (Number(formData.profitBalance) || 0) + (Number(formData.carryBalance || 0))
        console.log(sum)
        return sum
    }

    const getDisAmount = () => {
        let sum = ((Number(formData?.hurdleAmount) || 0) + (Number(formData.profitAmount) || 0))
        console.log(sum)
        return sum
    }

    const getDisBalanceAmount = () => {
        let sum = ((Number(formData?.hurdleBalance) || 0) + (Number(formData.profitBalance) || 0))
        console.log(sum)
        return sum
    }


    const handleClickSave = (ev: any, navTo: string) => {
        handleSave()
        if (navTo === 'previous') {
            navigate(`/Detailed/${parentId}/EngagementAndRole`);
        }
    }

    const handlePreviewComments = (ev: any) => {
        ev.preventDefault();
        console.log('handle change', ev, ev.target.id, ev.target.value);
        setCommentPreview(ev.target.value)
    };


    function handleClickSubmit(ev: any) {
        console.log("prelimId", parentId)
        handleSave()
        dispatch(
            createApplicationAsync(
                wrapArgument(
                    actionId, { id: Number(prilimFormData.prelimApplicationId), statusComments: commentPreview, status: ev.target.id }
                )
            )
        );
        navigate('/home')
    }



    let carryDetailsComponent = []
    if (formDataDetailsList != undefined) {
        let keysArr = Object.keys(formDataDetailsList)
        for (let i = 0; i < keysArr.length; i++) {
            carryDetailsComponent.push(
                <React.Fragment >
                    <Grid container spacing={6} >
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="distribution"
                                label=""
                                //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                value={formDataDetailsList[keysArr[i]]["distribution"] || ''}
                                variant="standard"
                                onChange={(e) => handleChangeCarryDetails(e, keysArr[i])}

                                sx={{ display: 'flex', ml: 2 }}
                            />
                        </Grid>
                        <Grid item xs={2.5}>
                            <TextField
                                required
                                //type="number"
                                id="percent"
                                label="%"
                                //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                value={formDataDetailsList[keysArr[i]]["percent"] || ''}
                                variant="standard"
                                //onChange={handleChangeCarryDetails}

                                sx={{ display: 'flex' }}
                            />
                        </Grid>

                        <Grid item xs={2.5}>
                            <TextField
                                required
                                //type="number"
                                id="carryOutOfCrore"
                                label=""
                                //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                value={formDataDetailsList[keysArr[i]]["carryOutOfCrore"] || ''}
                                variant="standard"
                                // onChange={handleChangeCarryDetails}

                                sx={{ display: 'flex' }}
                            />
                        </Grid>

                    </Grid>
                </React.Fragment>)
        }
    }

    return (<>

        <Grid item xs={12}>


            <Card sx={{ display: 'flex', mb: 2, mt: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Illustration of carry distribution of the Fund</Typography>

                    <Divider sx={{ mt: 2 }} />
                    <Card sx={{ display: 'flex', mt: 3, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>Carry Distribution</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        id="corpus"
                                        label="Corpus[Rs. In crore]"
                                        //defaultValue={formData.corpus === undefined ? " " : formData["corpus"]}
                                        value={formData["corpus"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2}}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="hurdle"
                                        label="Hurdle"
                                        //defaultValue={formData.corpus === undefined ? " " : formData["corpus"]}
                                        value={formData["hurdle"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2 }}
                                    />
                                    {/*<FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Hurdle</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={Number(formData.hurdle) || 0}
                                            //propertyValue={formData.hurdle || 0}
                                            onChange={handleSelectChange} />
    </FormControl>*/}
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="catchup"
                                        label="Catchup(%)"
                                        //defaultValue={formData.corpus === undefined ? " " : formData["corpus"]}
                                        value={formData["catchup"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2 }}
                                    />
                                    {/*}
                                    <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Catchup(%)</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={Number(formData.catchup) || 0}
                                            onChange={handleSelectChange} />
</FormControl>*/}
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="carry"
                                        label="Carry(%)"
                                        //defaultValue={formData.corpus === undefined ? " " : formData["corpus"]}
                                        value={formData["carry"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2 }}
                                    />
                                    {/*}
                                    <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Carry(%)</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={0}
                                            //propertyValue={formData.fundManager || 0}
                                            onChange={handleSelectChange} />
</FormControl>*/}
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="profit"
                                        label="Profit to investors(%)"
                                        //defaultValue={formData.corpus === undefined ? " " : formData["corpus"]}
                                        value={formData["profit"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2 }}
                                    />
                                        {/*}
                                    <FormControl variant="standard" sx={{ ml: 2, mt: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Profit to investors(%)</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={0}
                                            //propertyValue={formData.fundManager || 0}
                                            onChange={handleSelectChange} />
</FormControl>*/}
                                </Grid>

                                <Grid item xs={6}>

                                    <TextField
                                        required
                                        type="number"
                                        id="corpusAssumed"
                                        label="Distributable corpus assumed for illustration[Rs. Crore]"
                                        //defaultValue={formData.corpus === undefined ? " " : formData["corpus"]}
                                        value={formData["corpusAssumed"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2 }}
                                    />
                                    {/*}
                                    <FormControl variant="standard" sx={{ ml: 2, mt: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Distributable corpus assumed for illustration[Rs. Crore]</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={0}
                                            //propertyValue={formData.fundManager || 0}
                                            onChange={handleSelectChange} />
</FormControl> */}
                                </Grid>
                            </Grid>

                            <Divider sx={{ mt: 7, mb: 2 }} />

                            <Grid container spacing={6} >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Amount</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Balance Amount</Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>1.Capital to Investors (Rs. Crore)</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="capitalAmount"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["capitalAmount"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="capitalBalance"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["capitalBalance"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>2.Hurdle to the Investors (…….% on Capital to Investors) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="hurdleAmount"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["hurdleAmount"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="hurdleBalance"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["hurdleBalance"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>3.Catchup to Fund Manager (…….% on Hurdle to Investors) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="catchupAmount"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["catchupAmount"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="catchupBalance"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["catchupBalance"] || ''}
                                        variant="standard"
                                        onChange={handleChange}
                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>4.Profit to the Investors(..% after catch up i.e, 80% on Rs..cr)– Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="profitAmount"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["profitAmount"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="profitBalance"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["profitBalance"]}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>5.Carry to Fund Manager (…….% on Rs ………………… crore) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="carryAmount"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["carryAmount"]}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="carryBalance"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={formData["carryBalance"]}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>{"Total " + getAmount()}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>{getBalanceAmount()}</Typography>
                                </Grid>

                            </Grid>

                            <Divider sx={{ mt: 2 }} />

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>6.Profit to Investors (2+4) ) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="profittoInvestorsAmount"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={Number(formData.hurdleAmount || 0) + Number(formData.profitAmount || 0)}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="profittoInvestors"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={Number(formData.hurdleBalance || 0) + Number(formData.profitBalance || 0)}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>7.Distribution/Carry with Catchup to IM (3+5) ) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="distributionAmount"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={Number(formData.catchupAmount || 0) + Number(formData.carryAmount || 0)}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="distribution"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        value={Number(formData.catchupBalance || 0) + Number(formData.carryBalance || 0)}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2, mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Total</Typography>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>{"Total " + getDisAmount()}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>{getDisBalanceAmount()}</Typography>
                                </Grid>

                            </Grid>

                            <Divider sx={{ mt: 2 }} />

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Distribution of Carry:</Typography>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Carry%</Typography>

                                </Grid>
                                <Grid item xs={2.5}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Out of Rs crore Carry</Typography>

                                </Grid>
                            </Grid>
                            {carryDetailsComponent}
                            {/*<Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        id="distributionofCarry"
                                        label="8."
                                        {...register("distributionofCarry")}
                                        error={errors.distributionofCarry ? true : false}
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2 }}
                                    />
                                    {errors.distributionofCarry ?
                                        <div  style={{ marginTop: '-10px' }}>
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.distributionofCarry?.message}</>
                                            </Typography>
                                        </div> : <></>}
                                </Grid>
                                <Grid item xs={2.5}>
                                    <TextField
                                        required
                                        type="number"
                                        id="carry1"
                                        label="%"
                                        {...register("carry1")}
                                        error={errors.carry1 ? true : false}
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mb: 2 }}
                                    />
                                    {errors.carry1 ?
                                        <div  style={{ marginTop: '-10px' }}>
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.carry1?.message}</>
                                            </Typography>
                                        </div> : <></>}
                                </Grid>

                                <Grid item xs={2.5}>
                                    <TextField
                                        required
                                        type="number"
                                        id="outOfRs1"
                                        label="%"
                                        {...register("outOfRs")}
                                        error={errors.outOfRs1 ? true : false}
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mb: 2 }}
                                    />
                                    {errors.outOfRs1 ?
                                        <div  style={{ marginTop: '-10px' }}>
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.outOfRs1?.message}</>
                                            </Typography>
                                        </div> : <></>}
                                </Grid>

                            </Grid> */}

                            <Grid container spacing={6} >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={2.5}>
                                    <TextField
                                        required
                                        type="number"
                                        id="carry2"
                                        label="%"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        // value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mb: 2 }}
                                    />
                                </Grid>

                                <Grid item xs={2.5}>
                                    <TextField
                                        required
                                        type="number"
                                        id="outOfRs2"
                                        label="%"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        // value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mb: 2 }}
                                    />
                                </Grid>

                            </Grid>

                        </CardContent>
                    </Card>

                    <Divider sx={{ mt: 2 }} />

                    <Card sx={{ display: 'flex', mt: 3, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>Attachment Of Signed Document</Typography>
                            <Typography variant='body2' sx={{ flex: 1, color: '#363062', mb: 2, mt: 5 }}>* If application is in revision state Please download all pdf, copy sign it again and upload it then procced to submit.</Typography>

                            <Card sx={{ display: 'flex', mt: 3, background: '#ffffff' }}>
                                <CardContent sx={{ flex: 1 }}>
                                    <Toolbar disableGutters sx={{ mt: -2, ml: -2, mr: -2, justifyContent: "center", backgroundColor: '#d9d9d9' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2, ml: 2 }}>Section Name</Typography>

                                            </Grid>
                                            <Grid item xs={3}>
                                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2, ml: 2 }}>Download unsigned document</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2, ml: 2 }}>Upload signed document</Typography>
                                            </Grid>
                                        </Grid>
                                    </Toolbar>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 4 }}>Detailed Application</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                                <FileDownloadIcon />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                                <Grid item xs={3}>
                                                    <div style={{ margin: "15px" }}>
                                                        <UploadComponents id={`carryDetailedApplication${parentId}`}></UploadComponents>
                                                    </div>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ mt: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 4 }}>Investment Theme of Fund</Typography>

                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                                <FileDownloadIcon />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                                <Grid item xs={3}>
                                                    <div style={{ margin: "15px" }}>
                                                        <UploadComponents id={`carryInvestmentThemeOfFund${parentId}`}></UploadComponents>
                                                    </div>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ mt: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 4 }}>Detailed engagement and role of IM with Portfolio Companies</Typography>

                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                                <FileDownloadIcon />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                                <Grid item xs={3}>
                                                    <div style={{ margin: "15px" }}>
                                                        <UploadComponents id={`carryDetailedEngagement${parentId}`}></UploadComponents>
                                                    </div>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ mt: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 4 }}>Illustration of carry distribution of the Fund</Typography>

                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                                <FileDownloadIcon />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                                <Grid item xs={3}>
                                                    <div style={{ margin: "15px" }}>
                                                        <UploadComponents id={`carryIllustration${parentId}`}></UploadComponents>
                                                    </div>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ mt: 2 }} />

                                    
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                    <Grid container xs={12}>
                        <Grid item xs={12}>
                            <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                                <CardContent sx={{ flex: 1 }}>
                                    <TextField
                                        required
                                        id="previewComments"
                                        label="Leave a comment"
                                        //defaultValue={formData.commitmentReceived === undefined ? " " : formData["commitmentReceived"]}
                                        //value={formData["commitmentReceived"] || ''}
                                        variant="standard"
                                        onChange={handlePreviewComments}

                                        sx={{ display: 'flex', }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                onClick={(e) => handleClickSave(e, "previous")}
                                startIcon={<ArrowLeftIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={4} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 5 of 5</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={4} sx={{ justifyContent: 'right' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                {!(prilimFormData.status == 'SUBMITTED') ? <Button
                                    //onClick={(e) => handleClickSave(e, "submit")}
                                    // onClick={handleClickSubmit}
                                    onClick={handleClickSubmit}
                                    //endIcon={<ArrowRightIcon />}
                                    id = 'submit'
                                    color='success'
                                    variant="contained"
                                    disableElevation
                                    sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2, mr: 2 }} >
                                    Submit
                                </Button> :

                                    <>
                                        <Button color='success' id='approve' onClick={handleClickSubmit} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                            Approve
                                        </Button>
                                        <Button color='warning' id='revise' onClick={handleClickSubmit} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                            Revise
                                        </Button>
                                        <Button color='error' id='reject' onClick={handleClickSubmit} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                            Reject
                                        </Button>
                                    </>}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    </>
    );

}


export default CarryDistribution;
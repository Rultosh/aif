import { InputLabel, Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, IconButton } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { Controller } from "../../../../lib/api-wrappers/Controller";
import uuid from "react-uuid";
import { defaultIFeaturesOfFunds, IFeaturesOfFunds } from "./IFeaturesOfFund";
import { featureOfFundsThunk, selectFeatureOfFunds } from "./featuresOfFundSlice";
import SideNavBar from '../SideNavBar'
import { updateNavIndex, updateStepperIndex } from '../sideNavBarSlice'
import Textarea from '@mui/joy/Textarea';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const DetailedApplication2A = (props:any) => {

    const { id } = useParams()
    const [parentId] = useState(Number(id))
    const [featureOfFundId, setFeatureOfFundId] = useState(0)
    const [formData, setFormData] = useState(defaultIFeaturesOfFunds);
    const actionId = useState(uuid());
    const controller = new Controller(actionId, featureOfFundsThunk);
    const state = useAppSelector(selectFeatureOfFunds);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
// console.log(defaultIFeaturesOfFunds);
// console.log(formData);
    useEffect(() => {
        dispatch(updateNavIndex(0))
        dispatch(updateStepperIndex(1))
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: parentId })
                controller.all({ ...formData, parentId: parentId });
            }
        }
        console.log(formData);
    }, [])

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })
    
    useEffect(() => {
        dispatch(updateNavIndex(0))
        dispatch(updateStepperIndex(1))
        if (id && state[parentId]?.data) {
            Object.keys(state[parentId]?.data).map((key) => {
                let value = state[parentId]?.data[key]
                if (value && value.id) {
                    console.log(value);
                    setFormData(value);
                    setFeatureOfFundId(value.id);
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
        // controller.clear({ ...formData, parentId: parentId });
        if (navTo === 'next') {
            //navigate(`/Detailed/${parentId}/detailed2B`);
            navigate(`/Detailed/${parentId}/detailed2B`);
        }
        else {
            navigate(`/Detailed/${parentId}/SidbiReference`);
        }
    }

    let listItem = ['Please upload the files following convention as "FundName_Documentname_Date" for file (Include date in filename if relevent to the document) ', "Please fill up / answer all the points to the extent possible.", "Receipt of the information does not in any way bind / commits SIDBI to sanction assistance to the VC / PE fund, which will be considered on the merits of the case.", "If any of the points are covered in the Private Placement Memorandum (PPM), then please give reference to the relevant paragraph / page number of the PPM.", "Please upload the copy of supporting documents. Please ensure any single file is not more than 5MB.", "If there are more than one document against a specific question, please zip the relevant documents and upload the zipped file.", "Answers may be specific. Please avoid vague answers."];

    const validationSchema = Yup.object().shape({
        domesticAmount1: Yup.string().required("Domestic is required"),
        internationalAmount1: Yup.string().required("International is required"),
        totalAmount1: Yup.string().required("Total is required"),
        domesticAmount2: Yup.string().required("Domestic is required"),
        internationalAmount2: Yup.string().required("International is required"),
        totalAmount2: Yup.string().required("Total is required"),
        detailOfFundLife: Yup.string().required("Detail of Fund Life is required"),
        investmentPeriod: Yup.string().required("Investment Period is required"),
        targetReturnOfTheFund: Yup.string().required("Target Return Of The Fund is required"),
        hurdleRate: Yup.string().required("Hurdle Rate is required"),
        managementFee: Yup.string().required("Management Fee is required"),
        provisionOfFundSetup: Yup.string().required("Provision Of Fund Setup is required"),
        fundOnlyPrimaryInvestment: Yup.string().required("Fund Only Primary Investment is required"),
        detailsOfExistingFund: Yup.string().required("Details Of Existing Fund is required")
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
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
        {controller.isActionError(parentId, state) ?
            <div style={{ margin: "10px", color: "red" }}>{controller.error(parentId, state)}</div> : <></>}

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
                                // onClick={handleSave}
                                endIcon={<SaveIcon />}
                                variant="contained"
                                disableElevation
                                color='success'
                                sx={{ textTransform: 'none', position: 'fixed' }} >
                                Save
                            </Button>

                        </Grid>
                    </Grid>
                    <Card sx={{ display: 'flex', mb: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062' }}>Instruction</Typography>
                            {listItem.map((item) => (
                                <div>
                                    <ListItem>
                                        <Typography variant="body2" sx={{ flex: 1, color: '#363062' }}>{item}</Typography>
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mb: 2, background: '#bfbbdd' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <Button 
                                        href="/templates/SIDBI ASF-FFS Detailed Application.pdf"
                                        sx={{ background: "#363062", color: "white" 
                                    }} >Click here</Button>
                                </Grid>
                                <Grid item xs={10}>
                                    <Box sx={{ justifyContent: "center", ml: -6, mt: 1 }}>
                                        <Typography variant="body2" sx={{ flex: 1, color: '#363062' }}>To view the Detailed Application format to assess the data required for submission.</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 6 }} />

                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>A. Key Features of the Fund</Typography>
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062' }}>1. Target corpus (Rs Crores). Please provide provision for Green shoe (if any) </Typography>

                    <Card sx={{ display: 'flex', mb: 4, mt: 1 }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid container xs={12} spacing={2}>
                                <Grid item xs={4}>
                                    <Toolbar disableGutters sx={{ justifyContent: 'center', mt: -2, mr: -2, ml: -2, color: 'white', backgroundColor: '#363062' }}>
                                        Domestic
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={4}>
                                    <Toolbar disableGutters sx={{ justifyContent: 'center', mt: -2, mr: -2, ml: -2, color: 'white', backgroundColor: '#363062' }}>
                                        International
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={4}>
                                    <Toolbar disableGutters sx={{ justifyContent: 'center', mt: -2, mr: -2, color: 'white', backgroundColor: '#363062' }}>
                                        Total
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        required
                                        id="domesticAmount1"
                                        label="Response to question is required "
                                        {...register("domesticAmount1")}
                                        error={errors.domesticAmount1 && getValues("domesticAmount1") == '' ? true : false}
                                        //defaultValue={formData.domesticAmount1 === undefined ? " " : formData["domesticAmount1"]}
                                        value={formData["domesticAmount1"] || ''}
                                        variant="standard"
                                        onChange={handleChange}

                                        sx={{ display: 'flex', mb: 2 }}
                                    />
                                    <Typography variant="caption" color="error">
                                        <>{errors.domesticAmount1 && getValues("domesticAmount1") == ''? errors.domesticAmount1.message : ''}</>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        required
                                        id="internationalAmount1"
                                        label="Response to question is required"
                                        {...register("internationalAmount1")}
                                        error={errors.internationalAmount1 && getValues("internationalAmount1") == '' ? true : false}
                                        //defaultValue={formData.internationalAmount1 === undefined ? " " : formData["internationalAmount1"]}
                                        value={formData["internationalAmount1"] || ''}
                                        variant="standard"
                                        onChange={handleChange}
                                        sx={{ display: 'flex', mb: 2, ml: 2 }}
                                    />
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.internationalAmount1 && getValues("internationalAmount1") == ''? errors.internationalAmount1.message : ''}</>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        required
                                        id="totalAmount1"
                                        label="Response to question is required"
                                        {...register("totalAmount1")}
                                        error={errors.totalAmount1 && getValues("totalAmount1") == '' ? true : false}
                                        //defaultValue={formData.totalAmount1 === undefined ? " " : formData["totalAmount1"]}
                                        value={formData["totalAmount1"] || ''}
                                        variant="standard"
                                        onChange={handleChange}
                                        sx={{ display: 'flex', mb: 2, ml: 2 }}
                                    />
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.totalAmount1 && getValues("totalAmount1") == ''? errors.totalAmount1.message : ''}</>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        required
                                        id="domesticAmount2"
                                        label="Green shoe Response to question is required"
                                        {...register("domesticAmount2")}
                                        error={errors.domesticAmount2 && getValues("domesticAmount2") == '' ? true : false}
                                        //defaultValue={formData.domesticAmount2 === undefined ? " " : formData["domesticAmount2"]}
                                        value={formData["domesticAmount2"] || ''}
                                        variant="standard"
                                        onChange={handleChange}
                                        sx={{ display: 'flex', mb: 2 }}
                                    />
                                    <Typography variant="caption" color="error">
                                        <>{errors.domesticAmount2 && getValues("domesticAmount2") == ''? errors.domesticAmount2.message : ''}</>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        required
                                        id="internationalAmount2"
                                        label="Green shoe Response to question is required"
                                        {...register("internationalAmount2")}
                                        error={errors.internationalAmount2 && getValues("internationalAmount2") == '' ? true : false}
                                        //defaultValue={formData.internationalAmount2 === undefined ? " " : formData["internationalAmount2"]}
                                        value={formData["internationalAmount2"] || ''}
                                        variant="standard"
                                        onChange={handleChange}
                                        sx={{ display: 'flex', mb: 2, ml: 2 }}
                                    />
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.internationalAmount2 && getValues("internationalAmount2") == ''? errors.internationalAmount2.message : ''}</>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        required
                                        id="totalAmount2"
                                        label="Green shoe Response to question is required"
                                        {...register("totalAmount2")}
                                        error={errors.totalAmount2 && getValues("totalAmount2") == '' ? true : false}
                                        //defaultValue={formData.totalAmount2 === undefined ? " " : formData["totalAmount2"]}
                                        value={formData["totalAmount2"] || ''}
                                        variant="standard"
                                        onChange={handleChange}
                                        sx={{ display: 'flex', mb: 2, ml: 2 }}
                                    />
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.totalAmount2 && getValues("totalAmount2") == ''? errors.totalAmount2.message : ''}</>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="detailOfFundLife"
                                label="2. Details of fund life and provisions for extension."
                                {...register("detailOfFundLife")}
                                error={errors.detailOfFundLife && getValues("detailOfFundLife") == '' ? true : false}
                                //defaultValue={formData.detailOfFundLife === undefined ? " " : formData["detailOfFundLife"]}
                                value={formData["detailOfFundLife"] || ''}
                                variant="standard"
                                onChange={handleChange}
                                sx={{ display: 'flex', ml: 2 }}
                            />
                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                <>{errors.detailOfFundLife && getValues("detailOfFundLife") == ''? errors.detailOfFundLife.message : ''}</>
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="investmentPeriod"
                                label="3. Investment Period / commitment period."
                                {...register("investmentPeriod")}
                                error={errors.investmentPeriod && getValues("investmentPeriod") == '' ? true : false}
                                //defaultValue={formData.investmentPeriod === undefined ? " " : formData["investmentPeriod"]}
                                value={formData["investmentPeriod"] || ''}
                                variant="standard"
                                onChange={handleChange}
                                sx={{ display: 'flex', ml: 2 }}
                            />
                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                <>{errors.investmentPeriod && getValues("investmentPeriod") == ''? errors.investmentPeriod.message : ''}</>
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="targetReturnOfTheFund"
                                label="4. Target return for the fund."
                                {...register("targetReturnOfTheFund")}
                                error={errors.targetReturnOfTheFund && getValues("targetReturnOfTheFund") == '' ? true : false}
                                //defaultValue={formData.targetReturnOfTheFund === undefined ? " " : formData["targetReturnOfTheFund"]}
                                value={formData["targetReturnOfTheFund"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2 }}
                            />
                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                <>{errors.targetReturnOfTheFund && getValues("targetReturnOfTheFund") == ''? errors.targetReturnOfTheFund.message : ''}</>
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="hurdleRate"
                                label="5. Hurdle Rate & carried interest with basis / justification for the same."
                                {...register("hurdleRate")}
                                error={errors.hurdleRate && getValues("hurdleRate") == '' ? true : false}
                                //defaultValue={formData.hurdleRate === undefined ? " " : formData["hurdleRate"]}
                                value={formData["hurdleRate"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2 }}
                            />
                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                <>{errors.hurdleRate && getValues("hurdleRate") == ''? errors.hurdleRate.message : ''}</>
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="managementFee"
                                label="6. Management fee and trusteeship fee with basis / justification for the same."
                                {...register("managementFee")}
                                error={errors.managementFee && getValues("managementFee") == '' ? true : false}
                                //defaultValue={formData.managementFee === undefined ? " " : formData["managementFee"]}
                                value={formData["managementFee"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2 }}
                            />
                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                <>{errors.managementFee && getValues("managementFee") == ''? errors.managementFee.message : ''}</>
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: '#363062',ml:2,mb:1 }} >7. Provisions relating to fund set up costs and justification for the same and the provisions relating to other expenses like mentoring fee, upfront fee, processing fee, deal sourcing fee, sitting fees received by nominee directors appointed by the Fund / IM  etc.Will these be credited to the Fund or the IM? Will there be any other fee(s) collected by the IM/Fund?.</Typography>
                            <TextField
                                required
                                id="provisionOfFundSetup"
                                {...register("provisionOfFundSetup")}
                                error={errors.provisionOfFundSetup && getValues("provisionOfFundSetup") == '' ? true : false}
                                label=""
                                //defaultValue={formData.provisionOfFundSetup === undefined ? " " : formData["provisionOfFundSetup"]}
                                value={formData["provisionOfFundSetup"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2 }}
                            />
                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                <>{errors.provisionOfFundSetup && getValues("provisionOfFundSetup") == ''? errors.provisionOfFundSetup.message : ''}</>
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: '#363062',ml:2,mb:1 }} >8. Whether the Fund will make primary investment only i.e. the funds shall be utilized by the investee company only for its growth plans?</Typography>
                            <TextField
                                required
                                id="fundOnlyPrimaryInvestment"
                                //label="8. Whether the Fund will make primary investment only i.e. the funds shall be utilized by the investee company only for its growth plans?"
                                {...register("fundOnlyPrimaryInvestment")}
                                error={errors.fundOnlyPrimaryInvestment && getValues("fundOnlyPrimaryInvestment") == '' ? true : false}
                                //defaultValue={formData.fundOnlyPrimaryInvestment === undefined ? " " : formData["fundOnlyPrimaryInvestment"]}
                                value={formData["fundOnlyPrimaryInvestment"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2 }}
                            />
                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                <>{errors.fundOnlyPrimaryInvestment && getValues("fundOnlyPrimaryInvestment") == ''? errors.fundOnlyPrimaryInvestment.message : ''}</>
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: '#363062',ml:2,mb:1 }} >9. Details of existing investment made from the proposed fund (including warehouse investment), if any. What is the current pipeline of deals under consideration? Give details and timeline for investment.</Typography>
                            <TextField
                                required
                                id="detailsOfExistingFund"
                                {...register("detailsOfExistingFund")}
                                error={errors.detailsOfExistingFund && getValues("detailsOfExistingFund") == '' ? true : false}
                                //label="9. Details of existing investment made from the proposed fund (including warehouse investment), if any. What is the current pipeline of deals under considertaion? Give details and timeline for investment."
                                //defaultValue={formData.detailsOfExistingFund === undefined ? " " : formData["detailsOfExistingFund"]}
                                value={formData["detailsOfExistingFund"] || ''}
                                variant="standard"
                                onChange={handleChange}
                                sx={{ display: 'flex', ml: 2 }}
                            />
                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                <>{errors.detailsOfExistingFund && getValues("detailsOfExistingFund") == ''? errors.detailsOfExistingFund.message : ''}</>
                            </Typography>
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(A) of 5</Typography>
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


export default DetailedApplication2A;
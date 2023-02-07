import { IconButton, Card, CardContent, Typography, Grid, Box, Button, Divider, Toolbar, TextField, FormControlLabel, Switch } from "@mui/material";

import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import { updateNavIndex } from '../sideNavBarSlice'
import uuid from "react-uuid";
import UploadComponents from "../uploadComponents";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { Controller } from "../../../../lib/api-wrappers/Controller";
import { defaultIDetailedApplication2I, IDetailedApplication2I } from "./IDetailedApplication2I";
import { detailedApplication2IThunk, selectDetailedApplication2I } from "./detailedApplication2ISlice";
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const DetailedApplication2I = (props: any) => {
 
    const params = useParams()
    const parentId  = Number(params.id)
    const [formData, setFormData] = useState(defaultIDetailedApplication2I);
    const actionId = useState(uuid());
    const controller = new Controller(actionId, detailedApplication2IThunk);
    const state = useAppSelector(selectDetailedApplication2I);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [sebiComplianceAvailableSwitch, setsebiComplianceAvailableSwitch] = useState(formData.sebiComplianceAvailable || false);


    const handleToggle = () => {
        let copiedValue: IDetailedApplication2I = { ...formData };
        copiedValue.sebiComplianceAvailable = !sebiComplianceAvailableSwitch;
        setFormData(copiedValue);
        setsebiComplianceAvailableSwitch(!sebiComplianceAvailableSwitch)
    }

    const handleOnClickUpload = () => {
        setOpen(true)
    }
    useEffect(() => {
        dispatch(updateNavIndex(8))
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: parentId })
                controller.all({ ...formData, parentId: parentId });
            }
        }
    }, [])

    useEffect(() => {
        dispatch(updateNavIndex(8))
        if (state[parentId]?.data && Object.keys(state[parentId]?.data).length > 0 && props.isCrtStateToUpdate(state[parentId]?.data, defaultIDetailedApplication2I)){
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
            navigate(`/Detailed/${parentId}/detailed2J`);
        }
        else {
            navigate(`/Detailed/${parentId}/detailed2H`);
        }
    }

    const validationSchema = Yup.object().shape({
        sebiCompliance: Yup.string().required("Compliance is required")
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
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>I. Fund Related Documents</Typography>

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>45. Private Placement Memorandum (filename should be named as Fundname_PPM_Date)</Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{ margin: "15px" }}>
                                    <UploadComponents id={`ppm${parentId}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>46. Latest Investor presentation (filename should be named as Fundname_Pitch_Date)</Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{ margin: "15px" }}>
                                    <UploadComponents id={`pitch${parentId}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>47. Contribution agreement (draft); also attach copies of agreements signed with other contributors. (filename should be named as Fundname_Contributor_Date)</Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{ margin: "15px" }}>
                                    <UploadComponents id={`contributorAgreement${parentId}`}></UploadComponents>
                                </div>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>48. Investment Management Agreement (filename should be named as Fundname_IM_Agmt_Date)</Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{ margin: "15px" }}>
                                    <UploadComponents id={`imAgreement${parentId}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>49. Trust deed (filename should be named as Fundname_TrustDeed_Date)</Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{ margin: "15px" }}>
                                    <UploadComponents id={`trustDeed${parentId}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>50. SEBI registration certificate. (filename should be named as Fundname_SEBI_Certificate_Date)</Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{ margin: "15px" }}>
                                    <UploadComponents id={`sebiRegistrationCertificate${parentId}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>51. Compliance certificate on SEBI's VCF/AIF Regulations, if applicable. If not applicable, please give reasons, if any.</Typography>
                    <FormControlLabel sx={{ mt: 2, mb: 2, ml: 2 }} control={<Switch checked={formData.sebiComplianceAvailable} onChange={handleToggle} />} label={!formData.sebiComplianceAvailable? "No" : "Yes"} />
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            {!formData.sebiComplianceAvailable ?
                                <TextField
                                    required
                                    id="sebiCompliance"
                                    label='If No, reasons therefore'
                                    {...register("sebiCompliance")}
                                    error={errors.sebiCompliance && getValues("sebiCompliance") == '' ? true : false}
                                    // defaultValue={formData.reason === undefined ? " " : formData["reason"]}
                                    value={formData["sebiCompliance"] || ''}
                                    variant="standard"
                                    onChange={handleChange}
                                    sx={{ display: 'flex', ml: 2, mb: 2 }}
                                /> :
                                <Grid item xs={3}>
                                    <div style={{ margin: "15px" }}>
                                        {/*Need to change the upload doc ID*/}
                                        <UploadComponents id={`sebiComplianceCertificate${parentId}`}></UploadComponents>
                                    </div>
                                </Grid>}
                            {errors.sebiCompliance && getValues("sebiCompliance") == '' ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.sebiCompliance?.message}</>
                                    </Typography>
                                </div> : <></>}
                        </CardContent></Card>
                    <Divider sx={{ mt: 2 }} />

                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>52. Annual Report of past 3 years including balance Sheet, Income & Expenditure (P&LA/c) of Sponsor, Trustee Company, Asset Management Company, Previous Fund(s) & Present Fund.</Typography>


                    <Card sx={{ display: 'flex', mt: 3, background: '#ffffff' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Toolbar disableGutters sx={{ mt: -2, ml: -2, mr: -2, justifyContent: "center", backgroundColor: '#363062' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#ffffff', mb: 2, mt: 2, ml: 2 }}>File</Typography>

                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#ffffff', mb: 2, mt: 2, ml: 2 }}>Year 1</Typography>

                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#ffffff', mb: 2, mt: 2, ml: 2 }}>Year 2</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#ffffff', mb: 2, mt: 2, ml: 2 }}>Year 3</Typography>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 4 }}>Balance Sheet</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`balanceSheetY1${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`balanceSheetY2${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`balanceSheetY3${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ mt: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 4 }}>Income & Expenditure (P&LA/c) of Sponsor</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`incomeAndExpenditureY1${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`incomeAndExpenditureY2${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`incomeAndExpenditureY3${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ mt: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 4 }}>Trustee Company</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`truesteeCompanyY1${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`truesteeCompanyY2${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`truesteeCompanyY3${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ mt: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 4 }}>Asset Management Company</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`assetManagementCmpY1${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`assetManagementCmpY2${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`assetManagementCmpY3${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ mt: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, color: '#363062', mb: 2, mt: 4 }}>Previous Fund(s) & Present Fund</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`priorAndPresentFundyY1${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`priorAndPresentFundyY2${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ mb: 2, mt: 4, ml: 2 }}>
                                        {/* <Grid item xs={3}> */}
                                            <div style={{ margin: "15px" }}>
                                                <UploadComponents id={`priorAndPresentFundyY3${parentId}`}></UploadComponents>
                                            </div>
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ mt: 2 }} />
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(I) of 5</Typography>
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


export default DetailedApplication2I;
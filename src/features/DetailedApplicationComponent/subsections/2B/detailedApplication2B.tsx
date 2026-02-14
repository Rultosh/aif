import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, * as Rect from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileUpload from "../../../../components/FileUpload";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { Controller } from "../../../../lib/api-wrappers/Controller";
import uuid from "react-uuid";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Delete, Edit } from '@mui/icons-material'
import { defaultIDetailedApplication2B, IDetailedApplication2B } from "./IDetailedApplication2B";
import { detailedApplication2BThunk, selectDetailedApplication2B } from "./detailedApplication2BSlice";
import { InputLabel } from '@mui/material';
import SideNavBar from '../SideNavBar'
import { updateNavIndex } from '../sideNavBarSlice'
import DocumentUpload from "../../../../components/DocumentUpload";
import ListFiles from "../../../../components/ListFiles";
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import UploadComponents from '../uploadComponents'

export const DetailedApplication2B = (props: any) => {

    const params = useParams()
    const parentId  = Number(params.id)
    const [formData, setFormData] = useState(defaultIDetailedApplication2B);
    const actionId = useState(uuid());
    const controller = new Controller(actionId, detailedApplication2BThunk);
    const state = useAppSelector(selectDetailedApplication2B);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    //let isValidToUpdate = false


    const [firstClosingUid, setFirstClosingUid] = useState(uuid());
    const firstClosingSuccess = () => {
        setFirstClosingUid(uuid());
    }

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })
    

    const tableHeaders = ["File Name", "Action"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })

    useEffect(() => {
        //isValidToUpdate = false
        dispatch(updateNavIndex(1))
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: parentId })
                controller.all({ ...formData, parentId: parentId });
            }
        }
    }, [])

    useEffect(() => {
        //isValidToUpdate = false
        dispatch(updateNavIndex(1))
        if (state[parentId]?.data && Object.keys(state[parentId]?.data).length > 0 && props.isCrtStateToUpdate(state[parentId]?.data, defaultIDetailedApplication2B)){//&& state[Number(parentId)]?.data?.id) {
            Object.keys(state[parentId]?.data).map((key) => {
                let value = state[parentId]?.data[key]
                if (value && value.id) {
                    setFormData(value);
                } else {
                    setFormData({ ...formData, parentId: parentId })
                }
            });
        }
    }, [state[Number(parentId)]?.data])


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
        //controller.clear({ ...formData, parentId: parentId });
        if (navTo === 'next') {
            navigate(`/Detailed/${parentId}/detailed2C`);
        }
        else {
            navigate(`/Detailed/${parentId}/detailed2A`);
        }
    }

    const handleOnClickUpload = () => {
        setOpen(true)
    }

    const handleDocumentUpload = (id: String, url: any) => {
        /*  let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };
          copiedValue[id as keyof IPrelimApplicationData] = url;
          setPrelimApplicationFormData(copiedValue);
          dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, copiedValue)));*/
    }

    const handleDocumentDelete = (id: String) => {
        /* let copiedValue: IPrelimApplicationData = { ...defaultIPrelimApplicationData };
         console.log(copiedValue);
         console.log('handleDocDel', id)
         copiedValue.id = prelimApplicationFormData.id;
         copiedValue[id as keyof IPrelimApplicationData] = "" as any;
         
         setPrelimApplicationFormData(copiedValue);
         dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, copiedValue)));
         */
    }

    let listItem = ['Please upload the files following convention as "FundName_Documentname_Date" for file (Include date in filename if relevent to the document) ', "Please fill up / answer all the points to the extent possible.", "Receipt of the information does not in any way bind / commits NPS Trust to sanction assistance to the VC / PE fund, which will be considered on the merits of the case.", "If any of the points are covered in the Private Placement Memorandum (PPM), then please give reference to the relevant paragraph / page number of the PPM.", "Please upload the copy of supporting documents. Please ensure any single file is not more than 5MB.", "If there are more than one document against a specific question, please zip the relevant documents and upload the zipped file.", "Answers may be specific. Please avoid vague answers."];
    
    const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
    const htmlTagsNotAllowed = "Tags not allowed in input.";

    const validationSchema = Yup.object().shape({
        fundLaunchedDate: Yup.string().required("Fund Launched Date is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        commitmentReceived: Yup.string().required("Commitment Received is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        firstClosing: Yup.string().required("First Closing is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        dateOfFinalClosing: Yup.string().required("Date Of Final Closing is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        contribTerms: Yup.string().required("Contributor Terms is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        investmentManagerPlacementAgent: Yup.string().required("Investment Manager Placement Agent is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable()
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
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>B. Details of fund raising</Typography>


                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="fundLaunchedDate"
                                label="10. When was the fund launched?"
                                {...register("fundLaunchedDate")}
                                error={errors.fundLaunchedDate ? true : false}
                                //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                value={formData["fundLaunchedDate"] || ''}
                                variant="standard"
                                multiline
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.fundLaunchedDate ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.fundLaunchedDate?.message}</>
                                    </Typography>
                                </div> : <></>}
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                <Typography variant="body2" sx={{ flex: 1, color: '#363062',ml:2,mb:1 }} >11. How much commitments have been  received so far? Please indicate what % of commitments received from the investors who contributed to earlier Funds managed by the Investment Manager and from non-institutional sources including employee(s) of the fund. List name(s) of contributors with amounts committed and attach copies of their commitment letters, documents signed with them.</Typography>
                                    <TextField
                                        required
                                        id="commitmentReceived"
                                        //label="11. How much commitments have been  received so far? Please indicate what % of commitments received from the investors who contributed to earlier Funds managed by the Investment Manager and from non-institutonal source including employee(s) of the fund. List name(s) of contributors with amounts commited and atttac copies of their commitment letters, document signed with them."
                                        {...register("commitmentReceived")}
                                        error={errors.commitmentReceived ? true : false}
                                        //defaultValue={formData.commitmentReceived === undefined ? " " : formData["commitmentReceived"]}
                                        value={formData["commitmentReceived"] || ''}
                                        variant="standard"
                                        multiline
                                        onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2 }}
                                    />
                                    {errors.commitmentReceived ?
                                        <div  style={{ marginTop: '-10px' }}>
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.commitmentReceived?.message}</>
                                            </Typography>
                                        </div> : <></>}
                                </Grid>
                                <Grid item xs={6} sx={{ mt: 2 }}>
                                    <UploadComponents id={`firstClosing${parentId}`}></UploadComponents>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="firstClosing"
                                        label='12. Has the "first closing"/"initial closing" been done? If so, when and at what amount?'
                                        {...register("firstClosing")}
                                        error={errors.firstClosing ? true : false}
                                        //defaultValue={formData.commitmentReceived === undefined ? " " : formData["commitmentReceived"]}
                                        value={formData["firstClosing"] || ''}
                                        variant="standard"
                                        multiline
                                        onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2, mb: 2 }}
                                    />
                                    {errors.firstClosing ?
                                        <div  style={{ marginTop: '-10px' }}>
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.firstClosing?.message}</>
                                            </Typography>
                                        </div> : <></>}
                                </Grid>

                            </Grid>

                        </CardContent>
                    </Card>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="dateOfFinalClosing"
                                label="13. What is the expected date of final closing of the fund?"
                                {...register("dateOfFinalClosing")}
                                error={errors.dateOfFinalClosing ? true : false}
                                //defaultValue={formData.dateOfFinalClosing === undefined ? " " : formData["dateOfFinalClosing"]}
                                value={formData["dateOfFinalClosing"] || ''}
                                variant="standard"
                                multiline
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.dateOfFinalClosing ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.dateOfFinalClosing?.message}</>
                                    </Typography>
                                </div> : <></>}
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: '#363062',ml:2,mb:1 }} >14. Are all contributors governed by same term and conditions or whether anyone or more has been offered special terms or terms different from that of others? If yes, please give details thereof and name of the contributor(along with reasons)</Typography>
                            <TextField
                                required
                                id="contribTerms"
                                //label="14. Are all contributors governed by same team and conditions or whether anyone or more has been offered special terms or terms different from that of others? If yes, please give details thereof and name of the contributor(along with reasons)"
                                {...register("contribTerms")}
                                error={errors.contribTerms ? true : false}
                                //defaultValue={formData.contribTerms === undefined ? " " : formData["contribTerms"]}
                                value={formData["contribTerms"] || ''}
                                variant="standard"
                                multiline
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.contribTerms ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.contribTerms?.message}</>
                                    </Typography>
                                </div> : <></>}
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: '#363062',ml:2,mb:1 }} >15. Has the Investment Manager or the Fund or the sponsor of anyone associated with the fund engaged any placement agents? If yes, please provide details of funds raised and payment(s) made / to be made to the agents. Please also clarify as to who is bearing the cost of the agents?</Typography>
                            <TextField
                                required
                                id="investmentManagerPlacementAgent"
                                //label="15. Has the Investment Manager or the Fund or the sponsor of anyone associated with the fund engaged any placement agents? If yes, please provide details of funds raised and payment(s) made / to be made to the agents. Please also clarify as to who is bearing the cost of the agents?"
                                {...register("investmentManagerPlacementAgent")}
                                error={errors.investmentManagerPlacementAgent ? true : false}
                                //defaultValue={formData.investmentManagerPlacementAgent === undefined ? " " : formData["investmentManagerPlacementAgent"]}
                                value={formData["investmentManagerPlacementAgent"] || ''}
                                variant="standard"
                                multiline
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: 2 }}
                            />
                            {errors.investmentManagerPlacementAgent ?
                                <div  style={{ marginTop: '-10px' }}>
                                    <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                        <>{errors.investmentManagerPlacementAgent?.message}</>
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(B) of 5</Typography>
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
        </Grid >
    </>
    );
}


export default DetailedApplication2B;
import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, Checkbox, FormGroup, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, * as Rect from 'react'
import { iteratorSymbol } from "immer/dist/internal";
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { getPrelimApplicationData, selectPrelimApplication, updatePrelimApplicationAsync, createApplicationAsync } from "../fundOverviewData/prelimApplicationDataSlice";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import { defaultIPrelimApplicationData } from "../fundOverviewData/IPrelimApplicationData";
import uuid from 'react-uuid';
import { FetchStatus } from "../../../../lib/api-status/IStatus";
import DocumentChip from "../../../../components/DocumentChip";
import client from '../../../../app/api'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { selectUsers } from '../../../admin/adminSlice'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const Preview = (props:any) => {

    const { id } = useParams();

    const navigate = useNavigate()

    // const isAgreed = useAppSelector(state => state.declaration.agreed)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    console.log(!prelimApplicationState.prelimApplication.declarationAccepted)
    const dispatch = useAppDispatch()
    const statusPrelims = prelimApplicationState.prelimApplication.status
    //const [statusPrelims, setStatusPrelims] = useState<String | undefined>(undefined);
    const [commentPreview, setCommentPreview] = useState<String | undefined>(" ");
    const [actionUid] = useState(uuid());
    const usersState = useAppSelector(selectUsers)

    /*const validationSchema = Yup.object().shape({
        previewComments: Yup.string().required("Comments is required"),
    });

    const { register, handleSubmit, formState: { errors },} = useForm({
        resolver: yupResolver(validationSchema),
        });*/
    useEffect(() => {
        if (props.checkUnAuth) {
            navigate('/login')
        }
    })



    const handleChange = (ev: any) => {
        ev.preventDefault();
        console.log('handle change', ev, ev.target.id, ev.target.value);
        setValue(ev.target.id, ev.target.value);
        setCommentPreview(ev.target.value)
    };

    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'previous') {
            navigate(`/preliminary/${prelimApplicationState.prelimApplication.id}/declaration`)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        if (!prelimApplicationState.prelimApplication.id && id) {
            dispatch(getPrelimApplicationData(
                wrapArgument(actionUid, Number(id))
            ))
        }
    }, [])

    useEffect(() => {

        //setStatusPrelims(prelimApplicationState.prelimApplication.status)
    }, [prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    function handleClickSave(ev: any) {
        console.log("prelimId", Number(id))
        dispatch(
            createApplicationAsync(
                wrapArgument(
                    actionUid, { id: Number(id), statusComments: commentPreview, status: ev.target.id }
                )
            )
        );
        navigate('/home')
    }

    const validationSchema = Yup.object().shape({
        previewComments: Yup.string().required("Comment is required")
    });

    const {
        control,
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
    resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any, e: any) => {
        console.log(data);
        setCommentPreview(data);
        // setInvestmentResponsibleAsLead({ ...teamMember, prelimApplicationId: Number(id) })
        handleClickSave(e);
    };

    return (
        <Card sx={{ display: 'flex', mb: 2 }}>
            <CardContent sx={{ flex: 1 }}>

                <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Preview</Typography>
                <Card sx={{ display: 'flex', mt: 2, backgroundColor: "#f2f2f2" }}>
                    <CardContent sx={{ flex: 1 }}>

                        <Card>
                            <CardContent>
                                {/* <object
                                    width="100%"
                                    height="600"
                                    data={`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${id}/preview?access_token=${localStorage.getItem('token')}`}
                                    //data={`${client.getUri()}/api/prelims/${id}/preview`}
                                    type="application/pdf">
                                </object> */}
                                {/* <embed 
                                    src={`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${id}/preview?access_token=${localStorage.getItem('token')}`} 
                                    width="800px" 
                                    height="2100px" /> */}
                                <iframe src={`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${id}/preview?access_token=${localStorage.getItem('token')}`} 
                                    width="100%"
                                    height="600"></iframe>
                            </CardContent>
                        </Card>



                    </CardContent>
                </Card>

                <Card sx={{ display: 'flex', mt: 2, backgroundColor: "#f2f2f2" }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography sx={{ flex: 1, mb: 1 }}>Please follow below steps:</Typography>
                        <Divider color='#363062' sx={{ mb: 2 }} />
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography sx={{ flex: 1, mb: 1 }}>1. Download Application</Typography>
                                <Typography sx={{ flex: 1, mb: 1 }}>2. Either digitally sign the application and upload Digitally Signed Application</Typography>
                                <Typography sx={{ flex: 1, }}>3. Or Upload Digital Certificate and manually Signed application on letter head of IM/AMC</Typography>

                            </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex' }}>
                            <div style={{ margin: '5px' }}>
                                <Chip
                                    icon={<FileDownloadIcon />}
                                    label="Download Applicaton"
                                    size="medium"
                                    component="a"
                                    href={`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${id}/downloadPreview?access_token=${localStorage.getItem('token')}`}
                                    sx={{ backgroundColor: '#D586F7', width: 'fit-content', cursor: 'pointer', ':hover': {backgroundColor: 'rgba(0, 0, 0, 0.12)' } }} />
                            </div>
                            <div style={{ margin: '5px' }}>
                                <Chip
                                    icon={<FileDownloadIcon />}
                                    label="Download All as Zip"
                                    size="medium"
                                    component="a"
                                    href={`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${id}/downloadAsZip?access_token=${localStorage.getItem('token')}`}
                                    sx={{ backgroundColor: '#D586F7', width: 'fit-content', cursor: 'pointer', ':hover': {backgroundColor: 'rgba(0, 0, 0, 0.12)' } }} />
                            </div>
                            <div style={{ margin: '5px' }}>
                                <DocumentChip
                                    label="Upload Digitally Signed Application"
                                    id={`DigitallySignedApplication${id}`} 
                                    signed={true}
                                    />
                            </div>
                            <div style={{ margin: '5px' }}>
                                <DocumentChip
                                    label="Upload Digital Certificates"
                                    id={`DigitalCertificate${id}`} />
                            </div>
                            <div style={{ margin: '5px' }}>
                                <DocumentChip
                                    label="Upload"
                                    id={`unsignedDocument${id}`} />
                            </div>
                        </Box>
                        <TextField
                            required
                            id="previewComments"
                            label="Leave a comment"
                            //defaultValue={formData.commitmentReceived === undefined ? " " : formData["commitmentReceived"]}
                            //value={formData["commitmentReceived"] || ''}
                            variant="standard"
                            {...register("previewComments")}
                            error={(errors.previewComments && getValues("previewComments") == '') ? true : false}
                            onChange={handleChange}

                            sx={{ display: 'flex', }}
                        />
                        <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                          <>{(errors.previewComments && getValues("previewComments") == '') ? errors.previewComments.message : ''}</>
                        </Typography>
                    </CardContent>
                </Card>

                
                <Button disabled={(statusPrelims == 'SUBMITTED') || usersState.role == 'ADMIN'} onClick={(e) => handleClick(e, "previous")} startIcon={<ArrowLeftIcon />} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Declaration
                </Button>

                {(!(statusPrelims == 'SUBMITTED') && usersState.role == 'USER') ? <Button color='success' id='submit' onClick={handleSubmit(onSubmit)} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Submit
                </Button> :  ( ['ADMIN','USERADMIN'].includes(usersState.role!= undefined? usersState.role : '') && statusPrelims == 'SUBMITTED')? <>
                    <Button color='success' id='approve' onClick={handleClickSave} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                        Approve
                    </Button>
                    <Button color='warning' id='revise' onClick={handleClickSave} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                        Revise
                    </Button>
                    <Button color='error' id='reject' onClick={handleClickSave} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                        Reject
                    </Button>
                </>:<></>}



            </CardContent >
        </Card >
    );
}


export default Preview;
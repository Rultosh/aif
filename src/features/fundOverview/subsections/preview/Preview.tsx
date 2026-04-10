import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, Checkbox, FormGroup, TextField, Dialog, DialogContent, Zoom } from "@mui/material";
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
import { fetchRoleAsync, selectUsers } from '../../../admin/adminSlice'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { isAllDocsAvailable } from './docsMandateApi'
import { ModalComponent } from '../../../../components/ModalComponent'
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const Preview = (props: any) => {

    const { id } = useParams();

    const navigate = useNavigate()

    // const isAgreed = useAppSelector(state => state.declaration.agreed)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    console.log(!prelimApplicationState.prelimApplication.declarationAccepted)
    const dispatch = useAppDispatch()
    const statusPrelims = prelimApplicationState.prelimApplication.status
    //const [statusPrelims, setStatusPrelims] = useState<String | undefined>(undefined);
    const [commentPreview, setCommentPreview] = useState<String | undefined>("");
    const [actionUid] = useState(uuid());
    const usersState = useAppSelector(selectUsers)
    const reviewedById = prelimApplicationState.prelimApplication.reviewedByUserId
    const currentUserId = usersState.me?.id
    const isCurrentUserForwarder =
        reviewedById != null &&
        currentUserId != null &&
        Number(reviewedById) === Number(currentUserId)
    /** Approve enabled only when no forwarder is recorded (legacy) or current user is not that forwarder. */
    const approveDisabled =
        reviewedById != null &&
        (currentUserId == null || Number(reviewedById) === Number(currentUserId))
    const [showResponse, setShowResponse] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const role = usersState.role || '';
    const isApplicantActionable =
        role === 'USER' && (statusPrelims == 'CREATED' || statusPrelims == 'REVISE');
    const isOperationalActionable =
        ['ADMIN', 'USERADMIN'].includes(role) &&
        (statusPrelims == 'SUBMITTED' || statusPrelims == 'REVIEWED' || statusPrelims == 'TEMP_CLOSED');
    const hasActionToPerform = isApplicantActionable || isOperationalActionable;

    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false);
        navigate('/home')
    }


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

    const [actionDate, setActionDate] = useState<Date>(prelimApplicationState.prelimApplication.actionDate || new Date());
    const [actionDateError, setActionDateError] = useState<string | undefined>();

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

        // Fetch user role if missing (on refresh)
        if (localStorage.getItem('token') && usersState.role === undefined && usersState.status.fetchStatus === FetchStatus.IDLE) {
            dispatch(fetchRoleAsync(wrapArgument(actionUid, undefined)));
        }
    }, [])

    useEffect(() => {

        //setStatusPrelims(prelimApplicationState.prelimApplication.status)
    }, [prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    async function checkAllDocsOk(id: any, applicationName: any) {
        if (usersState.role === 'ADMIN') {
            return true
        }
        try {
            const res = await isAllDocsAvailable(id, applicationName)
            if (res.status === 200) {
                return true
            }
            else {
                return false
            }
        } catch (reason) {
            console.log(reason);
            return false
        }
    }

    async function handleClickSave(ev: any, commentOverride?: string) {

        setActionDateError(undefined);

        const intendedStatus = ev?.currentTarget?.id || ev?.target?.id;

        if (await checkAllDocsOk(id, "prelims")) {
            console.log("prelimId", Number(id), "intendedStatus", intendedStatus)
            try {
                const remarkToSend = (commentOverride ?? String(commentPreview || '')).trim();
                await dispatch(
                    createApplicationAsync(
                        wrapArgument(
                            actionUid, { id: Number(id), statusComments: remarkToSend, status: intendedStatus }
                        )
                    )
                ).unwrap();

                if (intendedStatus === 'submit') {
                    setShowSuccessDialog(true);
                } else {
                    navigate('/home')
                }
            } catch (error) {
                console.error("Save failure:", error);
                alert("An unexpected error occurred while saving.");
            }
        }
        else {
            setShowResponse(true);
        }
    }

    async function handleClickSaveCloseAction(ev: any) {

        setActionDateError(undefined);
        const intendedStatus = ev?.currentTarget?.id || ev?.target?.id;

        if (actionDate === null || actionDate == undefined) {
            setActionDateError("Please entre an action date.");
        } else {
            console.log("prelimId", Number(id))
            dispatch(
                createApplicationAsync(
                    wrapArgument(
                        actionUid, {
                        id: Number(id),
                        statusComments: commentPreview,
                        actionDate: actionDate,
                        status: intendedStatus
                    }
                    )
                )
            );
            navigate('/home')
        }
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
        const remark = String(data?.previewComments || "");
        setCommentPreview(remark);
        // setInvestmentResponsibleAsLead({ ...teamMember, prelimApplicationId: Number(id) })
        handleClickSave({ target: { id: 'submit' } }, remark);
    };

    const handleClose = () => {
        setShowResponse(false)
    };

    const fieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF671F',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF671F',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#FF671F',
        },
    };

    return (
        <div className="formAnimation">
            <Card sx={{
                display: 'flex',
                mb: 3,
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <CardContent sx={{ p: 4, width: '100%' }}>

                    <Card sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        mb: 4,
                        border: '1px solid rgba(54, 48, 98, 0.1)'
                    }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2, backgroundColor: 'rgba(54, 48, 98, 0.04)', borderBottom: '1px solid rgba(54, 48, 98, 0.1)' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#363062' }}>
                                    Application Document Preview
                                </Typography>
                            </Box>
                            <iframe
                                src={`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${id}/preview?access_token=${localStorage.getItem('token')}`}
                                width="100%"
                                height="600"
                                style={{ border: 'none' }}
                            ></iframe>
                        </CardContent>
                    </Card>

                    {hasActionToPerform && (
                        <Card sx={{
                            mb: 4,
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            border: '1px solid rgba(54, 48, 98, 0.1)'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                            {usersState.role === 'USER' ? (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#363062', mb: 2 }}>
                                        Submission Steps:
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Card sx={{ height: '100%', borderRadius: '12px' }}>
                                                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#D586F7', mb: 1, display: 'block' }}>STEP 1</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, m: 0 }}>Download Application</Typography>
                                                    <br />
                                                    <Chip
                                                        icon={<FileDownloadIcon />}
                                                        label="Download Application"
                                                        component="a"
                                                        href={`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${id}/downloadPreview?access_token=${localStorage.getItem('token')}`}
                                                        clickable
                                                        sx={{
                                                            backgroundColor: '#0295c9',
                                                            color: '#ffffff',
                                                            '& .MuiChip-icon': { color: 'white' },
                                                            fontWeight: 600,
                                                            borderRadius: '16px',
                                                            height: '40px',
                                                            width: 'fit-content',
                                                            '&:hover': {
                                                                backgroundColor: '#808080',
                                                                color: '#ffffff'
                                                            }
                                                        }}
                                                    />
                                                    <span style={{ marginLeft: '10px' }}></span>
                                                    <Chip
                                                        icon={<FileDownloadIcon />}
                                                        label="Download All As Zip"
                                                        component="a"
                                                        href={`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${id}/downloadAsZip?access_token=${localStorage.getItem('token')}`}
                                                        clickable
                                                        sx={{
                                                            backgroundColor: '#0295c9',
                                                            color: '#ffffff',
                                                            '& .MuiChip-icon': { color: 'white' },
                                                            fontWeight: 600,
                                                            borderRadius: '16px',
                                                            height: '40px',
                                                            width: 'fit-content',
                                                            '&:hover': {
                                                                backgroundColor: '#808080',
                                                                color: '#ffffff'
                                                            }
                                                        }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card sx={{ height: '100%', borderRadius: '12px' }}>
                                                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#D586F7', mb: 1, display: 'block' }}>STEP 2</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, m: 0 }}>Upload the signed Application</Typography>
                                                    <br />

                                                    <DocumentChip label="Upload" validationTitle="Signed Application" id={`unsignedDocument${id}`} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ) : null}

                            <Box>
                                {hasActionToPerform && (
                                    <>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#363062', mb: 2 }}>
                                            Any Comments/Feedback
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="previewComments"
                                            label="Leave a comment"
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            {...register("previewComments")}
                                            error={!!errors.previewComments}
                                            helperText={errors.previewComments?.message as string}
                                            onChange={handleChange}
                                            placeholder="Provide any context or feedback before processing..."
                                            sx={{
                                                ...fieldSx, mb: 3
                                            }}
                                        />
                                    </>
                                )}

                                {usersState.role === 'ADMIN' && hasActionToPerform && (
                                    <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(213, 134, 247, 0.05)', borderRadius: '12px', border: '1px solid rgba(213, 134, 247, 0.2)' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Effective Action Date"
                                                inputFormat='DD/MM/YYYY'
                                                value={actionDate}
                                                onChange={(newValue) => newValue && setActionDate(newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!actionDateError}
                                                        helperText={actionDateError}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: 'white' } }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                )}

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {(usersState.role == 'USER' && (statusPrelims == 'CREATED' || statusPrelims == 'REVISE')) && (
                                        <Button color='success' id='submit' onClick={handleSubmit(onSubmit)} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', px: 4, fontWeight: 700, backgroundColor: '#4caf50' }}>
                                            Submit Application
                                        </Button>
                                    )}

                                    {(['ADMIN', 'USERADMIN'].includes(usersState.role || '') && statusPrelims == 'SUBMITTED') && (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button color='success' id='review' onClick={handleClickSave} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Forward for Recommendation
                                            </Button>
                                            <Button color='warning' id='revise' onClick={handleClickSave} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revise
                                            </Button>
                                            <Button color='error' id='reject' onClick={handleClickSave} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Reject
                                            </Button>
                                            {/*<Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                            <Button color='error' id='tempClose' onClick={handleClickSaveCloseAction} variant="outlined" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Temp Close
                                            </Button>
                                            <Button color='error' id='permClose' onClick={handleClickSaveCloseAction} variant="outlined" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Permanent Close
                                            </Button>*/}
                                        </Box>
                                    )}

                                    {(['ADMIN', 'USERADMIN'].includes(usersState.role || '') && statusPrelims == 'REVIEWED') && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {isCurrentUserForwarder && (
                                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
                                                    Another administrator must approve. You forwarded this application for approval.
                                                </Typography>
                                            )}
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                <Button
                                                    color='success'
                                                    id='approve'
                                                    onClick={handleClickSave}
                                                    variant="contained"
                                                    disabled={approveDisabled}
                                                    title={approveDisabled ? 'Only an administrator other than the one who forwarded may approve.' : undefined}
                                                    sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button color='warning' id='revise' onClick={handleClickSave} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                    Revise
                                                </Button>
                                                <Button color='error' id='reject' onClick={handleClickSave} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                    Reject
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}

                                    {(['ADMIN', 'USERADMIN'].includes(usersState.role || '') && statusPrelims == 'TEMP_CLOSED') && (
                                        <Button color='primary' id='reopen' onClick={handleClickSaveCloseAction} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                            Reopen Application
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                            </CardContent>
                        </Card>
                    )}

                    <Button
                        disabled={(statusPrelims == 'SUBMITTED' || statusPrelims == 'REVIEWED' || statusPrelims == 'APPROVED') || usersState.role == 'ADMIN'}
                        onClick={(e) => handleClick(e, "previous")}
                        startIcon={<ArrowLeftIcon />}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            color: '#363062',
                            borderColor: '#363062'
                        }}
                    >
                        Back to Declaration
                    </Button>

                    {showResponse && (
                        <ModalComponent
                            open={showResponse}
                            close={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            className="special_modal"
                            msg={"Please upload all Documents before submitting the Application"}
                            status={"error"}
                        />
                    )}
                </CardContent >
            </Card >

            <Dialog
                open={showSuccessDialog}
                TransitionComponent={Zoom}
                keepMounted
                onClose={handleSuccessDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        padding: '24px',
                        maxWidth: '450px',
                        textAlign: 'center'
                    }
                }}
            >
                <DialogContent>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <Box className="checkmark-wrapper">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#363062', mb: 2 }}>
                        Success!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 4, lineHeight: 1.6 }}>
                        Your application has been received successfully. Our team is working on it and will update you soon.
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSuccessDialogClose}
                        sx={{
                            backgroundColor: '#FF671F',
                            borderRadius: '12px',
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            '&:hover': {
                                border: '1px solid #FF671F',
                                color: '#FF671F',
                                backgroundColor: 'rgb(255 103 30 / 19%)'
                            }
                        }}
                    >
                        Continue to Home
                    </Button>
                </DialogContent>
            </Dialog>

            <style>
                {`
                .checkmark__circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 2;
                    stroke-miterlimit: 10;
                    stroke: #7ac142;
                    fill: none;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }

                .checkmark {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 2;
                    stroke: #fff;
                    stroke-miterlimit: 10;
                    box-shadow: inset 0px 0px 0px #7ac142;
                    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
                }

                .checkmark__check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }

                @keyframes stroke {
                    100% {
                        stroke-dashoffset: 0;
                    }
                }

                @keyframes scale {
                    0%, 100% {
                        transform: none;
                    }
                    50% {
                        transform: scale3d(1.1, 1.1, 1);
                    }
                }

                @keyframes fill {
                    100% {
                        box-shadow: inset 0px 0px 0px 50px #7ac142;
                    }
                }
                `}
            </style>
        </div>
    );
}


export default Preview;
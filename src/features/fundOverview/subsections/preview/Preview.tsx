import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, Checkbox, FormGroup, TextField, Dialog, DialogContent, Zoom, InputLabel, Select, MenuItem } from "@mui/material";
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
import FileUploadService from "../../../../components/FileUploadService";
import { postWorkflowAction } from "../fundOverviewData/fundOverviewDataApi";
import { fetchCheckerUsers, fetchManagerUsers, fetchPensionFundUsers } from "../fundOverviewData/fundOverviewDataApi";

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
    const roleParts = role
        .split(',')
        .map((r) => r.trim().toUpperCase())
        .filter(Boolean);
    const isOperationalWorkflowUser = roleParts.some((r) =>
        ['MAKER', 'CHECKER', 'MANAGER', 'ADMIN', 'USERADMIN'].includes(r)
    );
    /** Preview: only fund applicants should return to declaration; not maker/checker/manager/admin. */
    const showBackToDeclaration = roleParts.includes('USER') && !isOperationalWorkflowUser;
    const isApplicantActionable =
        role === 'USER' && (statusPrelims == 'CREATED' || statusPrelims == 'REVISE');
    const isOperationalActionable =
        ['ADMIN', 'USERADMIN'].includes(role) &&
        (statusPrelims == 'SUBMITTED' || statusPrelims == 'REVIEWED' || statusPrelims == 'TEMP_CLOSED');
    const isMakerActionable = role === 'MAKER' && (statusPrelims === 'MAKER_ASSIGNED' || statusPrelims === 'REVERTED_TO_MAKER');
    const isCheckerActionable = role === 'CHECKER' && statusPrelims === 'MEMO_SUBMITTED';
    const isManagerActionable =
        role === 'MANAGER' &&
        (statusPrelims === 'CHECKER_FORWARDED_TO_MANAGER' || statusPrelims === 'REVERTED_TO_MANAGER');
    const isPfActionable =
        role === 'USER' &&
        statusPrelims === 'MANAGER_FORWARDED_TO_PF' &&
        Number(prelimApplicationState.prelimApplication.assignedPfUserId || 0) === Number(usersState.me?.id || 0);
    const hasActionToPerform = isApplicantActionable || isOperationalActionable || isMakerActionable || isCheckerActionable || isManagerActionable || isPfActionable;

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
    const [actionFile, setActionFile] = useState<File | null>(null);
    const [checkerUsers, setCheckerUsers] = useState<any[]>([]);
    const [managerUsers, setManagerUsers] = useState<any[]>([]);
    const [pfUsers, setPfUsers] = useState<any[]>([]);
    const [selectedCheckerUserId, setSelectedCheckerUserId] = useState<string>('');
    const [selectedManagerUserId, setSelectedManagerUserId] = useState<string>('');
    const [selectedPfUserId, setSelectedPfUserId] = useState<string>('');

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

    useEffect(() => {
        const loadAssignmentUsers = async () => {
            try {
                if (usersState.role === 'MAKER') {
                    const res = await fetchCheckerUsers();
                    const list = res?.data || [];
                    setCheckerUsers(list);
                    if (prelimApplicationState.prelimApplication.assignedCheckerUserId != null) {
                        setSelectedCheckerUserId(String(prelimApplicationState.prelimApplication.assignedCheckerUserId));
                    } else if (list.length > 0) {
                        setSelectedCheckerUserId(String(list[0].id));
                    }
                }
                if (usersState.role === 'CHECKER') {
                    const res = await fetchManagerUsers();
                    const list = res?.data || [];
                    setManagerUsers(list);
                    if (prelimApplicationState.prelimApplication.assignedManagerUserId != null) {
                        setSelectedManagerUserId(String(prelimApplicationState.prelimApplication.assignedManagerUserId));
                    } else if (list.length > 0) {
                        setSelectedManagerUserId(String(list[0].id));
                    }
                }
                if (usersState.role === 'MANAGER') {
                    const res = await fetchPensionFundUsers();
                    const list = res?.data || [];
                    setPfUsers(list);
                    if (prelimApplicationState.prelimApplication.assignedPfUserId != null) {
                        setSelectedPfUserId(String(prelimApplicationState.prelimApplication.assignedPfUserId));
                    } else if (list.length > 0) {
                        setSelectedPfUserId(String(list[0].id));
                    }
                }
            } catch {
                // keep UI usable even when assignee lookups fail
            }
        };
        loadAssignmentUsers();
    }, [usersState.role, prelimApplicationState.prelimApplication.assignedCheckerUserId, prelimApplicationState.prelimApplication.assignedManagerUserId, prelimApplicationState.prelimApplication.assignedPfUserId]);

    async function checkAllDocsOk(prelimId: string | undefined, applicationName: string) {
        if (usersState.role === 'ADMIN') {
            return true;
        }
        if (!prelimId || !Number(prelimId)) {
            return false;
        }
        try {
            const res = await isAllDocsAvailable(String(prelimId), applicationName);
            return res.status >= 200 && res.status < 300;
        } catch (reason) {
            console.log(reason);
            return false;
        }
    }

    const uploadActionFile = async (applicationId: number, action: string) => {
        if (!actionFile) return {};
        const bucket = `workflow-action-${applicationId}-${action.toLowerCase()}`;
        const uploaded = await FileUploadService.upload(bucket, actionFile, false, () => { });
        const uploadedName = uploaded?.data?.name || actionFile.name;
        return { attachmentBucket: bucket, attachmentName: uploadedName };
    };

    const hasEvidence = (comment: string) => comment.length > 0 || actionFile != null;

    async function handleClickSave(ev: any, commentOverride?: string) {

        setActionDateError(undefined);

        const intendedStatus = ev?.currentTarget?.id || ev?.target?.id;

        if (await checkAllDocsOk(id, "prelims")) {
            console.log("prelimId", Number(id), "intendedStatus", intendedStatus)
            try {
                let remarkToSend = (commentOverride ?? String(commentPreview || '')).trim();
                if (String(intendedStatus) === 'submit' && !hasEvidence(remarkToSend)) {
                    // Applicant submit should not force "supporting document" upload.
                    remarkToSend = "Submitted by applicant";
                }
                if (!hasEvidence(remarkToSend)) {
                    alert("Please provide either a comment or upload a document.");
                    return;
                }
                const attachment = await uploadActionFile(Number(id), String(intendedStatus));
                await dispatch(
                    createApplicationAsync(
                        wrapArgument(
                            actionUid, {
                            id: Number(id),
                            statusComments: remarkToSend,
                            attachmentBucket: attachment.attachmentBucket,
                            attachmentName: attachment.attachmentName,
                            status: intendedStatus
                        }
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
            const trimmedComment = String(commentPreview || '').trim();
            if (!hasEvidence(trimmedComment)) {
                alert("Please provide either a comment or upload a document.");
                return;
            }
            const attachment = await uploadActionFile(Number(id), String(intendedStatus));
            console.log("prelimId", Number(id))
            dispatch(
                createApplicationAsync(
                    wrapArgument(
                        actionUid, {
                        id: Number(id),
                        statusComments: trimmedComment,
                        attachmentBucket: attachment.attachmentBucket,
                        attachmentName: attachment.attachmentName,
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
        previewComments: Yup.string().nullable()
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
                                        {!isApplicantActionable && (
                                            <Box sx={{ mb: 3 }}>
                                                <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
                                                    Upload supporting document (optional)
                                                    <input
                                                        type="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] || null;
                                                            setActionFile(file);
                                                        }}
                                                    />
                                                </Button>
                                                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b' }}>
                                                    {actionFile ? actionFile.name : 'No file selected. Provide comment or upload file.'}
                                                </Typography>
                                            </Box>
                                        )}
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
                                    {(usersState.role === 'MAKER' && (statusPrelims === 'MAKER_ASSIGNED' || statusPrelims === 'REVERTED_TO_MAKER')) && (
                                        <FormControl sx={{ minWidth: 260 }}>
                                            <InputLabel id="checker-user-label">Select Checker</InputLabel>
                                            <Select
                                                labelId="checker-user-label"
                                                value={selectedCheckerUserId}
                                                label="Select Checker"
                                                onChange={(e) => setSelectedCheckerUserId(String(e.target.value))}
                                            >
                                                {checkerUsers.map((user) => (
                                                    <MenuItem key={user.id} value={String(user.id)}>
                                                        {user.contactPerson || user.username} ({user.username})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}

                                    {(usersState.role === 'CHECKER' && statusPrelims === 'MEMO_SUBMITTED') && (
                                        <FormControl sx={{ minWidth: 260 }}>
                                            <InputLabel id="manager-user-label">Select Manager</InputLabel>
                                            <Select
                                                labelId="manager-user-label"
                                                value={selectedManagerUserId}
                                                label="Select Manager"
                                                onChange={(e) => setSelectedManagerUserId(String(e.target.value))}
                                            >
                                                {managerUsers.map((user) => (
                                                    <MenuItem key={user.id} value={String(user.id)}>
                                                        {user.contactPerson || user.username} ({user.username})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}

                                    {(usersState.role === 'MANAGER' && statusPrelims === 'CHECKER_FORWARDED_TO_MANAGER') && (
                                        <FormControl sx={{ minWidth: 260 }}>
                                            <InputLabel id="pf-user-label">Select PF User</InputLabel>
                                            <Select
                                                labelId="pf-user-label"
                                                value={selectedPfUserId}
                                                label="Select PF User"
                                                onChange={(e) => setSelectedPfUserId(String(e.target.value))}
                                            >
                                                {pfUsers.map((user) => (
                                                    <MenuItem key={user.id} value={String(user.id)}>
                                                        {user.contactPerson || user.username} ({user.username})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}

                                    {(usersState.role == 'USER' && (statusPrelims == 'CREATED' || statusPrelims == 'REVISE')) && (
                                        <Button color='success' id='submit' onClick={handleSubmit(onSubmit)} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', px: 4, fontWeight: 700, backgroundColor: '#4caf50' }}>
                                            Submit Application
                                        </Button>
                                    )}

                                    {(usersState.role === 'MAKER' && (statusPrelims === 'MAKER_ASSIGNED' || statusPrelims === 'REVERTED_TO_MAKER')) && (
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button color='primary' id='memo-submit' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                if (!selectedCheckerUserId) {
                                                    alert("Please select a checker.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'memo-submit');
                                                await postWorkflowAction(Number(id), 'memo-submit', {
                                                    remark,
                                                    checkerUserId: Number(selectedCheckerUserId),
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Submit Memo
                                            </Button>
                                            <Button color='warning' id='maker-revert-manager' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'maker-revert-manager');
                                                await postWorkflowAction(Number(id), 'maker-revert-manager', {
                                                    remark,
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revert to Manager
                                            </Button>
                                            <Button color='error' id='maker-revert-applicant' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'maker-revert-applicant');
                                                await postWorkflowAction(Number(id), 'maker-revert-applicant', {
                                                    remark,
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revert to Applicant
                                            </Button>
                                        </Box>
                                    )}

                                    {(usersState.role === 'CHECKER' && statusPrelims === 'MEMO_SUBMITTED') && (
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button color='warning' id='revert-to-maker' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'revert-to-maker');
                                                await postWorkflowAction(Number(id), 'revert-to-maker', {
                                                    remark,
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revert to Maker
                                            </Button>
                                            <Button color='success' id='checker-forward-manager' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                if (!selectedManagerUserId) {
                                                    alert("Please select a manager.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'checker-forward-manager');
                                                await postWorkflowAction(Number(id), 'checker-forward-manager', {
                                                    remark,
                                                    managerUserId: Number(selectedManagerUserId),
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Forward to Manager
                                            </Button>
                                        </Box>
                                    )}

                                    {(usersState.role === 'MANAGER' && (statusPrelims === 'CHECKER_FORWARDED_TO_MANAGER' || statusPrelims === 'REVERTED_TO_MANAGER')) && (
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button color='primary' id='manager-forward-pf' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                if (!selectedPfUserId) {
                                                    alert("Please select a PF user.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'manager-forward-pf');
                                                await postWorkflowAction(Number(id), 'manager-forward-pf', {
                                                    remark,
                                                    pfUserId: Number(selectedPfUserId),
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Forward to PF
                                            </Button>
                                            <Button color='warning' id='manager-revert-maker' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'manager-revert-maker');
                                                await postWorkflowAction(Number(id), 'manager-revert-maker', {
                                                    remark,
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revert to Analyst
                                            </Button>
                                        </Box>
                                    )}

                                    {(usersState.role === 'USER' && statusPrelims === 'MANAGER_FORWARDED_TO_PF' && Number(prelimApplicationState.prelimApplication.assignedPfUserId || 0) === Number(usersState.me?.id || 0)) && (
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button color='success' id='pf-approve' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'pf-approve');
                                                await postWorkflowAction(Number(id), 'pf-approve', {
                                                    remark,
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Approve
                                            </Button>
                                            <Button color='error' id='pf-reject' onClick={async () => {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'pf-reject');
                                                await postWorkflowAction(Number(id), 'pf-reject', {
                                                    remark,
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Reject
                                            </Button>
                                        </Box>
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

                    {showBackToDeclaration && (
                        <Button
                            disabled={
                                statusPrelims == 'SUBMITTED' ||
                                statusPrelims == 'REVIEWED' ||
                                statusPrelims == 'APPROVED'
                            }
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
                    )}

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
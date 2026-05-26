import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, Checkbox, FormGroup, TextField, Dialog, DialogContent, Zoom, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, DialogTitle, CircularProgress } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect, useMemo } from "react"
import dayjs from 'dayjs';
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
import { fetchCheckerUsers, fetchUserAdminUsers, fetchMakerUsers } from "../fundOverviewData/fundOverviewDataApi";
import { hasCheckerAndUserAdmin, normalizeWorkflowStatus } from "../../../../lib/workflowStatus";
import { getHistory } from '../../../home/historyApi';
import { IHistory } from '../../../home/IHistory';
import { getFileServerBaseUrl } from '../../../../lib/fileServerBaseUrl';
import { IFile } from "../../../../components/IFile";

/** "By" column: actor display name from API (resolved server-side); no user id → system. */
function commentHistoryByLabel(row: IHistory): string {
    const name = String(row.createdByName ?? '').trim();
    const userId = row.createdBy == null ? NaN : Number(row.createdBy);
    const hasUser = Number.isFinite(userId) && userId > 0;
    if (!hasUser) {
        return 'Auto Generated';
    }
    if (name) {
        return name;
    }
    return '—';
}

function formatStatusLabel(status: string | undefined): string {
    if (!status) return '—';
    const map: Record<string, string> = {
        CREATED: 'Created',
        SUBMITTED: 'Submitted',
        REVIEWED: 'Reviewed',
        REVISE: 'Revision Requested',
        REVERTED_TO_APPLICANT: 'Reverted to Applicant',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
        TEMP_CLOSED: 'Temporarily Closed',
        CLOSED: 'Closed',
        MAKER_ASSIGNED: 'Maker Assigned',
        MEMO_SUBMITTED: 'Memo Submitted',
        REVERTED_TO_MAKER: 'Reverted to Maker',
        REVERTED_TO_CHECKER: 'Reverted to Checker',
        REVERTED_TO_MANAGER: 'Reverted to Checker',
        CHECKER_FORWARDED_TO_USERADMIN: 'Forwarded to User Admin',
        CHECKER_FORWARDED_TO_MANAGER: 'Forwarded to User Admin',
        USERADMIN_FORWARDED_TO_PF: 'Forwarded to PF',
        MANAGER_FORWARDED_TO_PF: 'Forwarded to PF',
        APPROVED_BY_PF: 'Approved by PF',
        REJECTED_BY_PF: 'Rejected by PF',
        SANCTIONED: 'Sanctioned',
    };
    return map[status.toUpperCase()] ?? status;
}

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
    const [uploadErrorToastOpen, setUploadErrorToastOpen] = useState(false);
    const [uploadErrorToastMessage, setUploadErrorToastMessage] = useState("Failed to upload supporting document. Please try again.");
    const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
    const [documentsDialogLoading, setDocumentsDialogLoading] = useState(false);
    const [documentsDialogError, setDocumentsDialogError] = useState('');
    const [documentsDialogFiles, setDocumentsDialogFiles] = useState<IFile[]>([]);
    const [documentsDialogBucket, setDocumentsDialogBucket] = useState('');
    const role = usersState.role || '';
    const roleParts = role
        .split(',')
        .map((r) => r.trim().toUpperCase())
        .filter(Boolean);
    const hasRole = (targetRole: string) => roleParts.includes(targetRole);
    const isOperationalWorkflowUser = roleParts.some((r) =>
        ['MAKER', 'CHECKER', 'USERADMIN', 'ADMIN', 'PENSION_FUND'].includes(r)
    );
    const [commentHistory, setCommentHistory] = useState<IHistory[]>([]);
    /** Preview: only fund applicants should return to declaration; not maker/checker/useradmin/admin. */
    const showBackToDeclaration = roleParts.includes('USER') && !isOperationalWorkflowUser;
    const statusPrelimsUpper = normalizeWorkflowStatus(String(statusPrelims || '').trim());
    const applicantEditableStatuses = new Set(['CREATED', 'REVISE', 'REVERTED_TO_APPLICANT']);
    const isApplicantActionable = hasRole('USER') && applicantEditableStatuses.has(statusPrelimsUpper);
    const isOperationalActionable =
        (role === 'ADMIN' || role === 'USERADMIN') &&
        (statusPrelimsUpper === 'SUBMITTED' || statusPrelimsUpper === 'REVIEWED' || statusPrelimsUpper === 'TEMP_CLOSED');
    const isMakerActionable = hasRole('MAKER') && (statusPrelimsUpper === 'MAKER_ASSIGNED' || statusPrelimsUpper === 'REVERTED_TO_MAKER');
    const isCheckerActionable = hasRole('CHECKER') && (statusPrelimsUpper === 'MEMO_SUBMITTED' || statusPrelimsUpper === 'SUBMITTED' || statusPrelimsUpper === 'REVERTED_TO_CHECKER');
    const isScActionable =
        hasCheckerAndUserAdmin(role) &&
        statusPrelimsUpper === 'CHECKER_FORWARDED_TO_USERADMIN';
    /** PF approve/reject (and steps after screening committee) are not in this release. */
    const isPfActionable = false;
    const hasActionToPerform = isApplicantActionable || isOperationalActionable || isMakerActionable || isCheckerActionable || isScActionable || isPfActionable;

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
    const [actionFiles, setActionFiles] = useState<File[]>([]);
    const [checkerUsers, setCheckerUsers] = useState<any[]>([]);
    const [makerUsers, setMakerUsers] = useState<any[]>([]);
    const [userAdminUsers, setUserAdminUsers] = useState<any[]>([]);
    const [selectedMakerUserId, setSelectedMakerUserId] = useState<string>('');
    const [selectedCheckerUserId, setSelectedCheckerUserId] = useState<string>('');
    const [selectedUserAdminUserId, setSelectedUserAdminUserId] = useState<string>('');

    const fileIdentity = (file: File) => `${file.name}__${file.size}__${file.lastModified}`;
    const showUploadErrorToast = (message?: string) => {
        setUploadErrorToastMessage(message || "Failed to upload supporting document. Please try again.");
        setUploadErrorToastOpen(true);
    };
    const extractListedFiles = (response: any): IFile[] => {
        const rows = Array.isArray(response?.data)
            ? response.data
            : (Array.isArray(response?.data?.files) ? response.data.files : []);
        return rows as IFile[];
    };
    const openDocumentsDialog = async (bucket: string) => {
        setDocumentsDialogBucket(bucket);
        setDocumentsDialogOpen(true);
        setDocumentsDialogLoading(true);
        setDocumentsDialogError('');
        setDocumentsDialogFiles([]);
        try {
            const res = await FileUploadService.list(bucket);
            const files = extractListedFiles(res);
            setDocumentsDialogFiles(files);
            if (!files.length) {
                setDocumentsDialogError('No documents found in this upload bucket.');
            }
        } catch (error: any) {
            setDocumentsDialogError(error?.response?.data?.message || error?.message || 'Failed to load uploaded documents.');
        } finally {
            setDocumentsDialogLoading(false);
        }
    };
    const parseUploadErrorMessage = (error: any, fileName: string) => {
        const status = error?.response?.status;
        const title = String(error?.response?.data?.title || '').toLowerCase();
        const detail = String(error?.response?.data?.detail || '');
        const message = String(error?.response?.data?.message || '');
        const combined = `${title} ${detail} ${message}`.toLowerCase();
        if (status === 413 || combined.includes('payload too large') || combined.includes('maximum upload size exceeded')) {
            return `Upload failed for "${fileName}": file size exceeds the allowed limit.`;
        }
        if (combined.includes('already has a file with name')) {
            return `A file with the same name already exists for "${fileName}". Retrying with a unique name...`;
        }
        return `Failed to upload "${fileName}". Please try again.`;
    };
    const withUniqueSuffix = (file: File) => {
        const dot = file.name.lastIndexOf('.');
        const hasExt = dot > 0 && dot < file.name.length - 1;
        const base = hasExt ? file.name.slice(0, dot) : file.name;
        const ext = hasExt ? file.name.slice(dot) : '';
        const uniqueName = `${base}_${Date.now()}${ext}`;
        return new File([file], uniqueName, { type: file.type, lastModified: file.lastModified });
    };

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
        window.scrollTo(0, 0);
        const requestedPrelimId = Number(id || 0);
        // Always reload for this route id so status (and action buttons) match the server after
        // workflow changes elsewhere or revisiting the same application from Home.
        if (requestedPrelimId > 0) {
            dispatch(getPrelimApplicationData(wrapArgument(actionUid, requestedPrelimId)));
        }
    }, [id, dispatch, actionUid]);

    useEffect(() => {
        if (localStorage.getItem('token') && usersState.role === undefined && usersState.status.fetchStatus === FetchStatus.IDLE) {
            dispatch(fetchRoleAsync(wrapArgument(actionUid, undefined)));
        }
    }, [dispatch, actionUid, usersState.role, usersState.status.fetchStatus])

    useEffect(() => {
        const prelimId = Number(id || 0);
        if (!prelimId || prelimId <= 0) {
            setCommentHistory([]);
            return;
        }
        let cancelled = false;
        getHistory(String(prelimId))
            .then((res) => {
                const rows = Array.isArray(res?.data) ? res.data : [];
                if (!cancelled) setCommentHistory(rows);
            })
            .catch(() => {
                if (!cancelled) setCommentHistory([]);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {

        //setStatusPrelims(prelimApplicationState.prelimApplication.status)
    }, [prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    useEffect(() => {
        const loadAssignmentUsers = async () => {
            try {
                if (hasRole('MAKER')) {
                    const res = await fetchCheckerUsers();
                    const list = res?.data || [];
                    setCheckerUsers(list);
                    if (prelimApplicationState.prelimApplication.assignedCheckerUserId != null) {
                        setSelectedCheckerUserId(String(prelimApplicationState.prelimApplication.assignedCheckerUserId));
                    } else if (list.length > 0) {
                        setSelectedCheckerUserId(String(list[0].id));
                    }
                }
                if (hasRole('CHECKER')) {
                    const makerRes = await fetchMakerUsers();
                    const makerList = makerRes?.data || [];
                    setMakerUsers(makerList);
                    if (prelimApplicationState.prelimApplication.assignedMakerUserId != null) {
                        setSelectedMakerUserId(String(prelimApplicationState.prelimApplication.assignedMakerUserId));
                    } else if (makerList.length > 0) {
                        setSelectedMakerUserId(String(makerList[0].id));
                    }
                    const res = await fetchUserAdminUsers();
                    const list = res?.data || [];
                    setUserAdminUsers(list);
                    const assignedUserAdminId =
                        prelimApplicationState.prelimApplication.assignedUserAdminUserId
                        ?? (prelimApplicationState.prelimApplication as any).assignedManagerUserId;
                    if (assignedUserAdminId != null) {
                        setSelectedUserAdminUserId(String(assignedUserAdminId));
                    } else if (list.length > 0) {
                        setSelectedUserAdminUserId(String(list[0].id));
                    }
                }
            } catch {
                // keep UI usable even when assignee lookups fail
            }
        };
        loadAssignmentUsers();
    }, [usersState.role, prelimApplicationState.prelimApplication.assignedCheckerUserId, prelimApplicationState.prelimApplication.assignedUserAdminUserId]);

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
        if (!actionFiles.length) return {};
        const bucket = `workflow-action-${applicationId}-${action.toLowerCase()}`;
        let uploadedName = '';
        for (let i = 0; i < actionFiles.length; i++) {
            const file = actionFiles[i];
            let uploaded: any;
            try {
                uploaded = await FileUploadService.upload(bucket, file, false, () => { });
            } catch (error: any) {
                const parsedMessage = parseUploadErrorMessage(error, file.name);
                const combined = `${String(error?.response?.data?.title || '')} ${String(error?.response?.data?.detail || '')} ${String(error?.response?.data?.message || '')}`.toLowerCase();
                if (combined.includes('already has a file with name')) {
                    // Retry once with a unique filename when bucket already has same filename.
                    const uniqueFile = withUniqueSuffix(file);
                    try {
                        uploaded = await FileUploadService.upload(bucket, uniqueFile, false, () => { });
                    } catch (retryError) {
                        showUploadErrorToast(parseUploadErrorMessage(retryError, file.name));
                        throw retryError;
                    }
                } else {
                    showUploadErrorToast(parsedMessage);
                    throw error;
                }
            }
            if (i === 0) {
                uploadedName = uploaded?.data?.name || file.name;
            }
        }
        return { attachmentBucket: bucket, attachmentName: uploadedName };
    };

    const hasEvidence = (comment: string) => comment.length > 0 || actionFiles.length > 0;

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
            } catch (error: any) {
                console.error("Save failure:", error);
                showUploadErrorToast("An unexpected error occurred while saving. Please try again.");
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
            try {
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
            } catch (error: any) {
                console.error("Close action save failure:", error);
                showUploadErrorToast("An unexpected error occurred while saving. Please try again.");
            }
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

    const sortedCommentHistory = useMemo(
        () =>
            [...commentHistory].sort(
                (a, b) => (Number(a.id) || 0) - (Number(b.id) || 0)
            ),
        [commentHistory]
    );

    const showApplicantCommentHistoryHint =
        roleParts.includes('USER') && !isOperationalWorkflowUser;

    const fileServerBase = getFileServerBaseUrl();

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

                    <Card sx={{
                        mb: 4,
                        borderRadius: '12px',
                        border: '1px solid rgba(54, 48, 98, 0.1)',
                        overflow: 'hidden',
                    }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2, backgroundColor: 'rgba(54, 48, 98, 0.04)', borderBottom: '1px solid rgba(54, 48, 98, 0.1)' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#363062' }}>
                                    Comment history
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                {sortedCommentHistory.length === 0 ? (
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                        No comments recorded for this application yet.
                                    </Typography>
                                ) : (
                                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                        <Table size="small" aria-label="Comment history">
                                            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>By</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }} align="center">Document</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sortedCommentHistory.map((row) => (
                                                    <TableRow key={row.id != null ? `hist-${row.id}` : `hist-${row.createdOn}-${row.status}`}>
                                                        <TableCell sx={{ whiteSpace: 'nowrap', color: '#475569' }}>
                                                            {row.createdOn ? dayjs(String(row.createdOn)).format('DD MMM YYYY') : '—'}
                                                        </TableCell>
                                                        <TableCell sx={{ color: '#1e293b' }}>{formatStatusLabel(row.status)}</TableCell>
                                                        <TableCell sx={{ color: '#475569' }}>{commentHistoryByLabel(row)}</TableCell>
                                                        <TableCell sx={{ color: '#1e293b', maxWidth: 360 }}>{row.remarks?.trim() ? row.remarks : '—'}</TableCell>
                                                        <TableCell align="center">
                                                            {row.attachmentBucket && row.attachmentName ? (
                                                                <Button
                                                                    size="small"
                                                                    onClick={() => openDocumentsDialog(String(row.attachmentBucket))}
                                                                    sx={{ textTransform: 'none' }}
                                                                >
                                                                    View
                                                                </Button>
                                                            ) : (
                                                                '—'
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    {String(prelimApplicationState.prelimApplication.sanctionedAmountInr || '').trim() !== '' && (
                        <Card sx={{
                            mb: 4,
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            border: '1px solid rgba(54, 48, 98, 0.1)'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#363062', mb: 1 }}>
                                    PF Sanction Details
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                                    Sanctioned Amount (INR): {String(prelimApplicationState.prelimApplication.sanctionedAmountInr)}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

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
                                                            const picked = Array.from(e.target.files || []);
                                                            if (!picked.length) return;
                                                            setActionFiles((prev) => {
                                                                const seen = new Set(prev.map(fileIdentity));
                                                                const merged = [...prev];
                                                                for (const file of picked) {
                                                                    const key = fileIdentity(file);
                                                                    if (!seen.has(key)) {
                                                                        merged.push(file);
                                                                        seen.add(key);
                                                                    }
                                                                }
                                                                return merged;
                                                            });
                                                            e.currentTarget.value = '';
                                                        }}
                                                    />
                                                </Button>
                                                {actionFiles.length ? (
                                                    <Box sx={{ mt: 1 }}>
                                                        {actionFiles.map((file, idx) => (
                                                            <Box
                                                                key={fileIdentity(file)}
                                                                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                                                            >
                                                                <Typography variant="caption" sx={{ color: '#334155', wordBreak: 'break-all' }}>
                                                                    {idx + 1}. {file.name}
                                                                </Typography>
                                                                <Button
                                                                    size="small"
                                                                    color="error"
                                                                    sx={{ minWidth: 'auto', p: 0, textTransform: 'none' }}
                                                                    onClick={() => {
                                                                        setActionFiles((prev) => prev.filter((f) => fileIdentity(f) !== fileIdentity(file)));
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b' }}>
                                                        No file selected. Provide comment or upload file.
                                                    </Typography>
                                                )}
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

                                    {(hasRole('CHECKER') && (statusPrelimsUpper === 'SUBMITTED' || statusPrelimsUpper === 'REVERTED_TO_CHECKER')) && (
                                        <FormControl sx={{ minWidth: 260 }}>
                                            <InputLabel id="maker-user-label">Select Maker</InputLabel>
                                            <Select
                                                labelId="maker-user-label"
                                                value={selectedMakerUserId}
                                                label="Select Maker"
                                                onChange={(e) => setSelectedMakerUserId(String(e.target.value))}
                                            >
                                                {makerUsers.map((user) => (
                                                    <MenuItem key={user.id} value={String(user.id)}>
                                                        {user.contactPerson || user.username} ({user.username})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}

                                    {(hasRole('CHECKER') && statusPrelimsUpper === 'MEMO_SUBMITTED') && (
                                        <FormControl sx={{ minWidth: 260 }}>
                                            <InputLabel id="useradmin-user-label">Select User Admin</InputLabel>
                                            <Select
                                                labelId="useradmin-user-label"
                                                value={selectedUserAdminUserId}
                                                label="Select User Admin"
                                                onChange={(e) => setSelectedUserAdminUserId(String(e.target.value))}
                                                displayEmpty
                                            >
                                                {userAdminUsers.length === 0 ? (
                                                    <MenuItem value="" disabled>
                                                        No user admin found — assign USERADMIN role in Admin
                                                    </MenuItem>
                                                ) : (
                                                    userAdminUsers.map((user) => (
                                                        <MenuItem key={user.id} value={String(user.id)}>
                                                            {user.contactPerson || user.username} ({user.username})
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                        </FormControl>
                                    )}

                                    {(hasRole('USER') && applicantEditableStatuses.has(statusPrelimsUpper)) && (
                                        <Button color='success' id='submit' onClick={handleSubmit(onSubmit)} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', px: 4, fontWeight: 700, backgroundColor: '#4caf50' }}>
                                            Submit Application
                                        </Button>
                                    )}

                                    {(usersState.role === 'MAKER' && (statusPrelims === 'MAKER_ASSIGNED' || statusPrelims === 'REVERTED_TO_MAKER')) && (
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button color='primary' id='memo-submit' onClick={async () => {
                                                try {
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
                                                } catch (error: any) {
                                                    console.error("Workflow action failed:", error);
                                                    showUploadErrorToast();
                                                }
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Submit Memo
                                            </Button>
                                            <Button color='warning' id='maker-revert-checker' onClick={async () => {
                                                try {
                                                    const remark = String(commentPreview || '').trim();
                                                    if (!hasEvidence(remark)) {
                                                        alert("Please provide either a comment or upload a document.");
                                                        return;
                                                    }
                                                    const attachment = await uploadActionFile(Number(id), 'maker-revert-checker');
                                                    await postWorkflowAction(Number(id), 'maker-revert-checker', {
                                                        remark,
                                                        attachmentBucket: attachment.attachmentBucket,
                                                        attachmentName: attachment.attachmentName,
                                                    });
                                                    navigate('/home');
                                                } catch (error: any) {
                                                    console.error("Workflow action failed:", error);
                                                    showUploadErrorToast();
                                                }
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revert to Checker
                                            </Button>
                                            <Button color='error' id='maker-revert-applicant' onClick={async () => {
                                                try {
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
                                                } catch (error: any) {
                                                    console.error("Workflow action failed:", error);
                                                    showUploadErrorToast();
                                                }
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revert to Applicant
                                            </Button>
                                        </Box>
                                    )}

                                    {(hasRole('CHECKER') && statusPrelimsUpper === 'MEMO_SUBMITTED') && (
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button color='warning' id='revert-to-maker' onClick={async () => {
                                                try {
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
                                                } catch (error: any) {
                                                    console.error("Workflow action failed:", error);
                                                    showUploadErrorToast();
                                                }
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revert to Maker
                                            </Button>
                                            <Button color='success' id='checker-forward-useradmin' onClick={async () => {
                                                try {
                                                    const remark = String(commentPreview || '').trim();
                                                    if (!hasEvidence(remark)) {
                                                        alert("Please provide either a comment or upload a document.");
                                                        return;
                                                    }
                                                    if (!selectedUserAdminUserId) {
                                                        alert("Please select a user admin.");
                                                        return;
                                                    }
                                                    const attachment = await uploadActionFile(Number(id), 'checker-forward-useradmin');
                                                    await postWorkflowAction(Number(id), 'checker-forward-useradmin', {
                                                        remark,
                                                        userAdminUserId: Number(selectedUserAdminUserId),
                                                        attachmentBucket: attachment.attachmentBucket,
                                                        attachmentName: attachment.attachmentName,
                                                    });
                                                    navigate('/home');
                                                } catch (error: any) {
                                                    console.error("Workflow action failed:", error);
                                                    showUploadErrorToast();
                                                }
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Mark application as &apos;With Screening Committee&apos;
                                            </Button>
                                        </Box>
                                    )}

                                    {(hasRole('CHECKER') && (statusPrelimsUpper === 'SUBMITTED' || statusPrelimsUpper === 'REVERTED_TO_CHECKER')) && (
                                        <Button color='primary' id='assign-maker' onClick={async () => {
                                            try {
                                                const remark = String(commentPreview || '').trim();
                                                if (!hasEvidence(remark)) {
                                                    alert("Please provide either a comment or upload a document.");
                                                    return;
                                                }
                                                if (!selectedMakerUserId) {
                                                    alert("Please select a maker.");
                                                    return;
                                                }
                                                const attachment = await uploadActionFile(Number(id), 'assign-maker');
                                                await postWorkflowAction(Number(id), 'assign-maker', {
                                                    makerUserId: Number(selectedMakerUserId),
                                                    remark,
                                                    attachmentBucket: attachment.attachmentBucket,
                                                    attachmentName: attachment.attachmentName,
                                                });
                                                navigate('/home');
                                            } catch (error: any) {
                                                console.error("Workflow action failed:", error);
                                                showUploadErrorToast();
                                            }
                                        }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                            Assign Maker
                                        </Button>
                                    )}

                                    {isScActionable && (
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button color='warning' id='useradmin-revert-maker' onClick={async () => {
                                                try {
                                                    const remark = String(commentPreview || '').trim();
                                                    if (!hasEvidence(remark)) {
                                                        alert("Please provide either a comment or upload a document.");
                                                        return;
                                                    }
                                                    const attachment = await uploadActionFile(Number(id), 'useradmin-revert-maker');
                                                    await postWorkflowAction(Number(id), 'useradmin-revert-maker', {
                                                        remark,
                                                        attachmentBucket: attachment.attachmentBucket,
                                                        attachmentName: attachment.attachmentName,
                                                    });
                                                    navigate('/home');
                                                } catch (error: any) {
                                                    console.error("Workflow action failed:", error);
                                                    showUploadErrorToast();
                                                }
                                            }} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
                                                Revert to Analyst
                                            </Button>
                                        </Box>
                                    )}

                                    {((usersState.role === 'ADMIN' || usersState.role === 'USERADMIN') && statusPrelimsUpper === 'SUBMITTED') && (
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

                                    {((usersState.role === 'ADMIN' || usersState.role === 'USERADMIN') && statusPrelimsUpper === 'REVIEWED') && (
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

                                    {((usersState.role === 'ADMIN' || usersState.role === 'USERADMIN') && statusPrelimsUpper === 'TEMP_CLOSED') && (
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

            <Dialog
                open={documentsDialogOpen}
                onClose={() => setDocumentsDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Uploaded Documents</DialogTitle>
                <DialogContent dividers>
                    {documentsDialogLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2">Loading documents...</Typography>
                        </Box>
                    ) : documentsDialogError ? (
                        <Alert severity="warning">{documentsDialogError}</Alert>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {documentsDialogFiles.map((file, idx) => {
                                const fileName = String(file?.name || '');
                                const fileUrl = String(file?.url || '');
                                const href = fileUrl
                                    ? `${fileUrl}?access_token=${localStorage.getItem('token')}`
                                    : `${fileServerBase}/files/${encodeURIComponent(documentsDialogBucket)}/${encodeURIComponent(fileName)}?access_token=${localStorage.getItem('token')}`;
                                return (
                                    <Box key={`${fileName}-${idx}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                        <Typography variant="body2" sx={{ color: '#334155', wordBreak: 'break-all' }}>
                                            {idx + 1}. {fileName || 'Untitled file'}
                                        </Typography>
                                        <Button
                                            size="small"
                                            component="a"
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Download
                                        </Button>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar
                open={uploadErrorToastOpen}
                autoHideDuration={4500}
                onClose={() => setUploadErrorToastOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setUploadErrorToastOpen(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {uploadErrorToastMessage}
                </Alert>
            </Snackbar>

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
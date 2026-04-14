import { Modal, Box, Card, CardContent, Typography, Divider, TextField, Button, Grid, Stack, Avatar, Chip, CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import uuid from "react-uuid";
import { defaultIQueryResolution, IQueryResolution } from "./IQueryResolution";
import { fetchQuriesAsync, postQuriesAsync, selectqueryResolution } from './queryResolutionSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { selectUsers } from '../admin/adminSlice'
import FileUploadService from "../../components/FileUploadService";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const QueryResolutionModal = (props: any) => {

    const id = props?.prelimDetails?.id
    const isOpen = typeof props.open === "boolean" ? props.open : Boolean(props.isActive);
    const [formData, setFormData] = useState(defaultIQueryResolution);
    const state = useAppSelector(selectqueryResolution)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const usersState = useAppSelector(selectUsers)
    const [queryFile, setQueryFile] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryInputRef = useRef<HTMLInputElement | null>(null);
    const wasOpenRef = useRef(false);
    const portalUrl = (process.env.REACT_APP_PORTAL_URL || `${window.location.origin}${window.location.pathname}`).trim();

    const fetchQueries = () => {
        if (!id) return;
        dispatch(fetchQuriesAsync(
            wrapArgument(actionUid, id)
        ));
    };

    useEffect(() => {
        const justOpened = isOpen && !wasOpenRef.current;
        wasOpenRef.current = isOpen;
        if (justOpened) {
            fetchQueries();
        }
    }, [isOpen, id, dispatch, actionUid])

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => queryInputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    async function handleSubmit(){
        const trimmedQuery = String(formData.query || "").trim();
        if (!trimmedQuery && !queryFile) {
            setSubmitError("Please add a comment or upload a document.");
            return;
        }
        if (queryFile && queryFile.size > MAX_UPLOAD_BYTES) {
            setSubmitError("Selected file is too large. Maximum allowed size is 5 MB.");
            return;
        }
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            let attachmentBucket: string | undefined;
            let attachmentName: string | undefined;
            if (queryFile) {
                const bucket = `prelim-query-${id}`;
                const uploaded = await FileUploadService.upload(bucket, queryFile, false, () => {});
                attachmentBucket = bucket;
                attachmentName = uploaded?.data?.name || queryFile.name;
            }
            await dispatch(postQuriesAsync(
                wrapArgument(actionUid, {
                    ...formData,
                    id,
                    query: trimmedQuery,
                    attachmentBucket,
                    attachmentName,
                })
            )).unwrap();
            setFormData(defaultIQueryResolution);
            setQueryFile(null);
            setSubmitError("");
            fetchQueries();
        } catch (e: any) {
            const status = e?.response?.status;
            const backendDetail = e?.response?.data?.detail;
            const backendMessage = e?.response?.data?.message;
            if (backendDetail || backendMessage) {
                setSubmitError(backendDetail || backendMessage);
                return;
            }
            if (status === 413) {
                setSubmitError("Payload Too Large (413).");
                return;
            }
            setSubmitError(e?.message || "Could not submit query.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleChange = (ev: any) => {
        let copiedValue = { ...formData }
        copiedValue.query = ev.target.value;
        copiedValue.id = id;
        setFormData(copiedValue);
        setSubmitError("");
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '85%',
        maxWidth: '1000px',
        maxHeight: '85vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: 24,
        p: 3,
    };

    return <Modal
        open={isOpen}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className= "special_modal"
    >
        <Box sx={style}>
            <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Query & Resolution
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                {usersState.role === 'ADMIN'
                    ? `To: ${props?.prelimDetails?.createdByName || "Applicant"}`
                    : (
                        <>
                            Please login to online portal{" "}
                            <a href={portalUrl} target="_blank" rel="noopener noreferrer">{portalUrl}</a>{" "}
                            to provide resolution.
                        </>
                    )}
            </Typography>
            <Typography variant="body2" sx={{ color: '#334155', mb: 2, fontWeight: 600 }}>
                {"Subject: Query for " + (props?.prelimDetails?.registrationAifName || props?.prelimDetails?.nameOfTheFund || `Application #${id || '-'}`)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="outlined" size="small" sx={{ textTransform: 'none' }} onClick={fetchQueries} disabled={isSubmitting}>
                    Refresh
                </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
                <Card sx={{ display: 'flex', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ flex: 1, maxHeight: '45vh', overflow: 'auto' }}>
                        {state?.queries?.length ? state?.queries?.map((q: IQueryResolution) => (
                            <Box key={`${q.id}`} sx={{ p: 2, borderRadius: 2, background: '#fff', mb: 1.5, border: '1px solid #e2e8f0' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <Avatar sx={{ width: 26, height: 26, fontSize: 12 }}>
                                        {String(q.createdByName || "U").charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                        {q.createdByName || "User"}
                                    </Typography>
                                    <Chip size="small" label={q.createdOn || '-'} sx={{ ml: 'auto' }} />
                                </Stack>
                                <Typography variant="body2" sx={{ color: '#334155', whiteSpace: 'pre-wrap' }}>
                                    {q.query || '-'}
                                </Typography>
                                {q.attachmentBucket && q.attachmentName ? (
                                    <Box sx={{ mt: 1 }}>
                                        <a
                                            href={`${process.env.REACT_APP_FILE_SERVER_URL || process.env.REACT_APP_API_BASE_URL}/files/${q.attachmentBucket}/${q.attachmentName}?access_token=${localStorage.getItem('token')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View attachment
                                        </a>
                                    </Box>
                                ) : null}
                            </Box>
                        )) : (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    No previous messages yet. Start the conversation below.
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{ mt: 2, display: 'flex', background: '#fff', border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="query"
                                    multiline
                                    rows={3}
                                    label={usersState.role == 'USER' ? "Add your comment/query" : "Provide comment/resolution"}
                                    value={formData["query"] || ''}
                                    variant="outlined"
                                    onChange={handleChange}
                                    placeholder="Write details here..."
                                    inputRef={queryInputRef}
                                    autoFocus
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button variant="outlined" component="label" sx={{ textTransform: 'none' }} disabled={isSubmitting}>
                                        Upload document
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => {
                                                const selectedFile = e.target.files?.[0] || null;
                                                if (selectedFile && selectedFile.size > MAX_UPLOAD_BYTES) {
                                                    setQueryFile(null);
                                                    setSubmitError("Selected file is too large. Maximum allowed size is 5 MB.");
                                                    return;
                                                }
                                                setQueryFile(selectedFile);
                                                setSubmitError("");
                                            }}
                                        />
                                    </Button>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                        {queryFile ? queryFile.name : "Optional. Either comment or document is required. Max file size: 5 MB."}
                                    </Typography>
                                </Stack>
                            </Grid>
                            {submitError ? (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="error">{submitError}</Typography>
                                </Grid>
                            ) : null}
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    disableElevation
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
                                    sx={{ textTransform: 'none' }} >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

            </Box>
        </Box>
    </Modal>
}

export default QueryResolutionModal;
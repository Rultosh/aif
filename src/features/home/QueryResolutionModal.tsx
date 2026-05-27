import { Modal, Box, Card, CardContent, Typography, Divider, TextField, Button, Grid, Stack, Avatar, Chip, CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import uuid from "react-uuid";
import { defaultIQueryResolution, IQueryResolution } from "./IQueryResolution";
import { clearQueries, fetchQuriesAsync, postQuriesAsync, selectqueryResolution } from './queryResolutionSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { selectUsers } from '../admin/adminSlice'
import FileUploadService from "../../components/FileUploadService";
import { getFileServerBaseUrl } from "../../lib/fileServerBaseUrl";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const QueryResolutionModal = (props: any) => {

    const id = props?.prelimDetails?.id
    const isOpen = typeof props.open === "boolean" ? props.open : Boolean(props.isActive);
    const [formData, setFormData] = useState(defaultIQueryResolution);
    const state = useAppSelector(selectqueryResolution)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const usersState = useAppSelector(selectUsers)
    const [queryFiles, setQueryFiles] = useState<File[]>([]);
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
            dispatch(clearQueries());
            fetchQueries();
        }
        if (!isOpen) {
            dispatch(clearQueries());
        }
    }, [isOpen, id, dispatch, actionUid])

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => queryInputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const fileIdentity = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;

    async function handleSubmit(){
        const trimmedQuery = String(formData.query || "").trim();
        if (!trimmedQuery && !queryFiles.length) {
            setSubmitError("Please add a comment or upload a document.");
            return;
        }
        const oversized = queryFiles.find(f => f.size > MAX_UPLOAD_BYTES);
        if (oversized) {
            setSubmitError(`File "${oversized.name}" is too large. Maximum allowed size is 5 MB.`);
            return;
        }
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            let attachmentBucket: string | undefined;
            let attachmentName: string | undefined;
            if (queryFiles.length) {
                const bucket = `prelim-query-${id}`;
                const uploadedNames: string[] = [];
                for (const file of queryFiles) {
                    const uploaded = await FileUploadService.upload(bucket, file, false, () => {});
                    uploadedNames.push(uploaded?.data?.name || file.name);
                }
                attachmentBucket = bucket;
                attachmentName = uploadedNames.join(',');
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
            setQueryFiles([]);
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
                                        {q.attachmentName.split(',').map((name, idx) => (
                                            <Box key={idx}>
                                                <a
                                                    href={`${getFileServerBaseUrl()}/files/${encodeURIComponent(q.attachmentBucket!)}/${encodeURIComponent(name.trim())}?access_token=${localStorage.getItem('token')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {idx + 1}. {name.trim()}
                                                </a>
                                            </Box>
                                        ))}
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
                                    label={usersState.role == 'USER' ? "Add your query" : "Provide query response"}
                                    value={formData["query"] || ''}
                                    variant="outlined"
                                    onChange={handleChange}
                                    placeholder="Write query details here..."
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
                                                const picked = Array.from(e.target.files || []);
                                                if (!picked.length) return;
                                                setQueryFiles((prev) => {
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
                                                setSubmitError("");
                                                e.currentTarget.value = '';
                                            }}
                                        />
                                    </Button>
                                </Stack>
                                {queryFiles.length ? (
                                    <Box sx={{ mt: 1 }}>
                                        {queryFiles.map((file, idx) => (
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
                                                    disabled={isSubmitting}
                                                    onClick={() => {
                                                        setQueryFiles((prev) => prev.filter((f) => fileIdentity(f) !== fileIdentity(file)));
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b' }}>
                                        Optional. Either comment or document is required. Max file size: 5 MB each.
                                    </Typography>
                                )}
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
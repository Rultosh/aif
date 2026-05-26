import { Modal, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Button, Dialog, DialogTitle, DialogContent, Alert, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import uuid from "react-uuid";
import dayjs from "dayjs";
import { IHistory } from "./IHistory";
import { fetchHistoryAsync, selecthistory } from './historySlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { FetchStatus } from "../../lib/api-status/IStatus";
import { selectUsers } from '../admin/adminSlice'
import React, * as Rect from 'react'
import { getFileServerBaseUrl } from '../../lib/fileServerBaseUrl';
import FileUploadService from "../../components/FileUploadService";
import { IFile } from "../../components/IFile";

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

export const HistoryModal = (props: any) => {

    const id = props?.prelimDetails?.id
    const state = useAppSelector(selecthistory)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const usersState = useAppSelector(selectUsers)
    const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
    const [documentsDialogLoading, setDocumentsDialogLoading] = useState(false);
    const [documentsDialogError, setDocumentsDialogError] = useState('');
    const [documentsDialogFiles, setDocumentsDialogFiles] = useState<IFile[]>([]);
    const [documentsDialogBucket, setDocumentsDialogBucket] = useState('');


    useEffect(() => {
        if (!props.open || !id) return;
        dispatch(fetchHistoryAsync(
            wrapArgument(actionUid, String(id))
        ));
    }, [props.open, id])

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const tableHeaders = [
        // "Stage",
        "Status",
        "Created On",
        "Remarks",
        "Document"]

    let headerComponent = []

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

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    return <>
        <Modal
            open={props.open}
            onClose={props.close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="special_modal"
        >
            <Box sx={style}>
                <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                            <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                <TableRow>
                                    {headerComponent}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state?.histories ? state?.histories?.map((row: IHistory) => (
                                    <TableRow key={`${row.id}`}>
                                        {/* <TableCell align="center">{row.stage}</TableCell> */}
                                        <TableCell align="center">{row.status}</TableCell>
                                        <TableCell align="center">
                                            {row.createdOn ? dayjs(row.createdOn).format("DD MMM YYYY") : "-"}
                                        </TableCell>
                                        <TableCell align="center">{row.remarks || '-'}</TableCell>
                                        <TableCell align="center">
                                            {row.attachmentBucket && row.attachmentName ? (
                                                <Button
                                                    size="small"
                                                    onClick={() => openDocumentsDialog(String(row.attachmentBucket))}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    View
                                                </Button>
                                            ) : '-'}
                                        </TableCell>
                                    </TableRow>
                                )) : <>
                                    <TableRow>
                                        <TableCell align="center" colSpan={5}>No Rows To Display</TableCell>
                                    </TableRow> </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Modal>
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
                                : `${getFileServerBaseUrl()}/files/${encodeURIComponent(documentsDialogBucket)}/${encodeURIComponent(fileName)}?access_token=${localStorage.getItem('token')}`;
                            return (
                                <Box key={`${fileName}-${idx}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
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
    </>
}

export default HistoryModal;
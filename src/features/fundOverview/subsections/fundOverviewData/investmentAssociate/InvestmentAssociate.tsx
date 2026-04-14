import { Alert, Backdrop, Box, Button, Card, CardContent, CardHeader, Chip, CircularProgress, FormControlLabel, Grid, Modal, Paper, Snackbar, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from "react"
import { fetchInvestmentTeamsAssociateLevelAsync, selectInvestmentAssociate, createInvestmentTeamsAssociateLevelAsync, deleteInvestmentTeamsAssociateLevelAsync } from './investmentAssociateSlice'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import React, * as Rect from 'react'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentAssociate, IInvestmentAssociate } from "./IInvestmentAssociate";
import { FetchStatus } from "../../../../../lib/api-status/IStatus";
import { Delete, Edit } from '@mui/icons-material';
import { InvestmentAssociateRow } from "./InvestmentAssociateRow";
import { selectPrelimApplication } from "../prelimApplicationDataSlice";
import { InvestmentAssociateModel } from "./InvestmentAssociateModel";
import { opaqueInfoToastAlertSx } from "../../../../../lib/ui/opaqueInfoToastAlertSx";
import { fetchAssociateMandatoryDocumentsStatus } from "../fundOverviewDataApi";

export type InvestmentAssociateHandle = {
    submit: (opts?: { silent?: boolean }) => Promise<boolean>;
};

interface InvestmentAssociateProps {
    prelimApplicationId: Number | undefined
    /** Tint fund accordion section 4 when rows are invalid (missing docs or too many rows). */
    onSectionHasErrorsChange?: (hasErrors: boolean) => void
}

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


const InvestmentAssociate = forwardRef<InvestmentAssociateHandle, InvestmentAssociateProps>(function InvestmentAssociate(props, ref) {

    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid())
    const investmentAssociatesState = useAppSelector(selectInvestmentAssociate)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [validationToastOpen, setValidationToastOpen] = useState(false);
    const [validationToastMessage, setValidationToastMessage] = useState('');
    const [missingResumeRowIds, setMissingResumeRowIds] = useState<number[]>([]);
    const [associateDocCheckBusy, setAssociateDocCheckBusy] = useState(false);
    const showValidationToast = useCallback((message: string) => {
        setValidationToastMessage(message);
        setValidationToastOpen(true);
    }, []);
    const handleValidationToastClose = () => {
        setValidationToastOpen(false);
    };

    const onSectionHasErrorsChangeRef = useRef(props.onSectionHasErrorsChange);
    onSectionHasErrorsChangeRef.current = props.onSectionHasErrorsChange;

    const loadMissingResumeIds = useCallback(async (): Promise<number[]> => {
        const pid = props.prelimApplicationId;
        if (pid == null || Number(pid) <= 0) {
            setMissingResumeRowIds([]);
            return [];
        }
        try {
            const res = await fetchAssociateMandatoryDocumentsStatus(pid);
            const raw = (res as { data?: { missingResumeAssociateIds?: unknown } })?.data?.missingResumeAssociateIds;
            const ids = Array.isArray(raw)
                ? raw.map((x) => Number(x)).filter((n) => !Number.isNaN(n))
                : [];
            setMissingResumeRowIds(ids);
            return ids;
        } catch {
            setMissingResumeRowIds([]);
            return [];
        }
    }, [props.prelimApplicationId]);

    const handleCloseAddModal = useCallback(() => {
        setOpen(false);
        void loadMissingResumeIds();
    }, [loadMissingResumeIds]);

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsAssociateLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentTeamsAssociateLevelAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
    }, [investmentAssociatesState.actionStatus.fetchStatus === FetchStatus.IDLE, prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsAssociateLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentTeamsAssociateLevelAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
    }, [prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        if (
            props.prelimApplicationId &&
            investmentAssociatesState.status.fetchStatus === FetchStatus.IDLE &&
            investmentAssociatesState.actionStatus.fetchStatus === FetchStatus.IDLE
        ) {
            void loadMissingResumeIds();
        }
    }, [
        props.prelimApplicationId,
        investmentAssociatesState.investmentAssociates,
        investmentAssociatesState.status.fetchStatus,
        investmentAssociatesState.actionStatus.fetchStatus,
        loadMissingResumeIds,
    ]);

    useEffect(() => {
        const statusIdle = investmentAssociatesState.status.fetchStatus === FetchStatus.IDLE;
        const actionIdle = investmentAssociatesState.actionStatus.fetchStatus === FetchStatus.IDLE;
        const n = investmentAssociatesState.investmentAssociates?.length ?? 0;
        const tooFewRows = n < 1;
        const tooManyRows = n > 5;
        /** Same as KMP section: avoid reporting `false` during fetch so merge step after section 2 validation does not clear doc-gap errors. Still surface row-count violations from current state. */
        if (!statusIdle || !actionIdle) {
            if (tooFewRows || tooManyRows) {
                onSectionHasErrorsChangeRef.current?.(true);
            }
            return;
        }
        const docIssue = missingResumeRowIds.length > 0;
        onSectionHasErrorsChangeRef.current?.(docIssue || tooFewRows || tooManyRows);
    }, [
        missingResumeRowIds,
        investmentAssociatesState.investmentAssociates?.length,
        investmentAssociatesState.status.fetchStatus,
        investmentAssociatesState.actionStatus.fetchStatus,
    ]);

    useEffect(
        () => () => {
            onSectionHasErrorsChangeRef.current?.(false);
        },
        []
    );

    useImperativeHandle(
        ref,
        () => ({
            submit: async (opts?: { silent?: boolean }) => {
                const silent = opts?.silent === true;
                const statusIdle = investmentAssociatesState.status.fetchStatus === FetchStatus.IDLE;
                const actionIdle = investmentAssociatesState.actionStatus.fetchStatus === FetchStatus.IDLE;
                if (!silent && (!statusIdle || !actionIdle)) {
                    return false;
                }
                const n = investmentAssociatesState.investmentAssociates?.length ?? 0;
                if (n < 1) {
                    if (!silent) {
                        showValidationToast('Add at least one investment team member (other than KMP) before continuing.');
                    }
                    return false;
                }
                if (n > 5) {
                    if (!silent) {
                        showValidationToast('A maximum of 5 senior members (other than KMP) is allowed.');
                    }
                    return false;
                }
                if (!silent) {
                    setAssociateDocCheckBusy(true);
                }
                try {
                    const missing = await loadMissingResumeIds();
                    if (missing.length > 0) {
                        if (!silent) {
                            showValidationToast(
                                'Resume/CV is required for each non-KMP team member. Rows with a red indicator are missing the upload — click Edit on each to add the file.'
                            );
                        }
                        return false;
                    }
                } finally {
                    if (!silent) {
                        setAssociateDocCheckBusy(false);
                    }
                }
                return true;
            },
        }),
        [investmentAssociatesState, showValidationToast, loadMissingResumeIds]
    );

    const tableHeaders = ["Name", "Designation", "Age", "Qualification", "Experience in AIF Business", "Area Of Expertise", "Action"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="justify" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    return (
        <>
        <Box >
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                <Grid item xs={11.5}>
                    <TableContainer component={Paper} >
                        <Table sx={{ minWidth: 700, m: 0 }} aria-label="customized table">
                            <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                <TableRow>
                                    {headerComponent}
                                </TableRow>
                            </TableHead>
                            {investmentAssociatesState.status.fetchStatus == FetchStatus.IDLE && investmentAssociatesState.actionStatus.fetchStatus == FetchStatus.IDLE ?
                                <TableBody>
                                    {investmentAssociatesState.investmentAssociates && investmentAssociatesState.investmentAssociates.length > 0 ?
                                        investmentAssociatesState.investmentAssociates.map((row: IInvestmentAssociate, index: number) => (
                                            <InvestmentAssociateRow
                                                key={row.id != null ? String(Number(row.id)) : `associate-${index}`}
                                                row={row}
                                                rowDocInvalid={missingResumeRowIds.includes(Number(row.id))}
                                                onRowModalClosed={() => {
                                                    void loadMissingResumeIds();
                                                }}
                                            />
                                        )) : <TableRow><TableCell colSpan={7}>No Rows To Display</TableCell></TableRow>
                                    }
                                </TableBody> : <TableBody>
                                    <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
                                </TableBody>}
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={11.5}>
                    <Button onClick={handleOpen} variant="contained" disableElevation sx={{
                        textTransform: 'none', mt: 2, mb: 0, backgroundColor: '#000080',
                        '&:hover': {
                            border: '1px solid #000080',
                            color: '#000080',
                            backgroundColor: 'rgb(208 208 237)'
                        }
                    }}  >
                        Add
                    </Button>
                    <InvestmentAssociateModel
                        key='add-investment-partner'
                        investmentAssociateFormData={defaultInvestmentAssociate}
                        open={open}
                        handleClose={handleCloseAddModal}
                        prelimApplicationId={props.prelimApplicationId} />
                </Grid>
            </Grid>
        </Box>
        <Backdrop
            open={associateDocCheckBusy}
            sx={{
                zIndex: (theme) => theme.zIndex.modal + 8,
                color: '#fff',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    textAlign: 'center',
                    px: 3,
                }}
            >
                <CircularProgress color="inherit" size={48} thickness={4} aria-label="Verifying document uploads" />
                {/* <Typography variant="h6" component="p" sx={{ fontWeight: 600, maxWidth: 400 }}>
                    Verifying mandatory documents…
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.88, maxWidth: 440 }}>
                    Checking resume/CV uploads for each non-KMP team member.
                </Typography> */}
            </Box>
        </Backdrop>
        <Snackbar
            open={validationToastOpen}
            autoHideDuration={9000}
            onClose={handleValidationToastClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
        >
            <Alert
                onClose={handleValidationToastClose}
                severity="info"
                variant="standard"
                sx={opaqueInfoToastAlertSx}
            >
                {validationToastMessage}
            </Alert>
        </Snackbar>
        </>
    );
});

export default InvestmentAssociate;

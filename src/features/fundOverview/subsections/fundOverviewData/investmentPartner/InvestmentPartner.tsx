import { Alert, Backdrop, Box, Button, Card, CardContent, CardHeader, Chip, CircularProgress, FormControlLabel, Grid, Modal, Paper, Snackbar, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveFormData, submitResults, fetchTableData, fetchInvestmentTeamsPartnerLevelAsync, selectInvestmentPartners, createInvestmentTeamsPartnerLevelAsync, deleteInvestmentTeamPartnerLevelAsync } from './investmentPartnerSlice'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import React, * as Rect from 'react'
import { createInvestmentTeamsPartnerLevel, fetchInvestmentTeamsPartnerLevel } from "./investmentPartnerApi";
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentPartner, IInvestmentPartner } from "./IInvestmentPartner";
import { FetchStatus } from "../../../../../lib/api-status/IStatus";
import { Delete, Edit } from '@mui/icons-material';
import { InvestmentPartnerRow } from "./InvestmentPartnerRow";
import { selectPrelimApplication } from "../prelimApplicationDataSlice";
import { InvestmentPartnerModel } from "./InvestmentPartnerModel";
import { opaqueInfoToastAlertSx } from "../../../../../lib/ui/opaqueInfoToastAlertSx";
import { fetchKmpMandatoryDocumentsStatus } from "../fundOverviewDataApi";

export type InvestmentPartnerHandle = {
    submit: (opts?: { silent?: boolean }) => Promise<boolean>;
};

interface InvestmentPartnerProps {
    prelimApplicationId: Number | undefined
    /** Tint fund accordion section 3 when KMP rows or mandatory documents are incomplete. */
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


const InvestmentPartner = forwardRef<InvestmentPartnerHandle, InvestmentPartnerProps>(function InvestmentPartner(props, ref) {

    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid())
    const investmentPartnersState = useAppSelector(selectInvestmentPartners)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [validationToastOpen, setValidationToastOpen] = useState(false);
    const [validationToastMessage, setValidationToastMessage] = useState('');
    const [kmpDocValidationBusy, setKmpDocValidationBusy] = useState(false);
    const [missingPastTenYearsKmpIds, setMissingPastTenYearsKmpIds] = useState<number[]>([]);
    const [missingResumeKmpIds, setMissingResumeKmpIds] = useState<number[]>([]);
    const showValidationToast = useCallback((message: string) => {
        setValidationToastMessage(message);
        setValidationToastOpen(true);
    }, []);
    const handleValidationToastClose = () => {
        setValidationToastOpen(false);
    };

    const onSectionHasErrorsChangeRef = useRef(props.onSectionHasErrorsChange);
    onSectionHasErrorsChangeRef.current = props.onSectionHasErrorsChange;

    const investmentPartnersStateRef = useRef(investmentPartnersState);
    investmentPartnersStateRef.current = investmentPartnersState;

    const loadKmpDocGaps = useCallback(async (): Promise<
        { missingPastTenYearsKmpIds: number[]; missingResumeKmpIds: number[] } | null
    > => {
        const pid = props.prelimApplicationId;
        if (pid == null || Number(pid) <= 0) {
            setMissingPastTenYearsKmpIds([]);
            setMissingResumeKmpIds([]);
            return { missingPastTenYearsKmpIds: [] as number[], missingResumeKmpIds: [] as number[] };
        }
        try {
            const res = await fetchKmpMandatoryDocumentsStatus(pid);
            const d = (res as { data?: Record<string, unknown> })?.data;
            const asNumList = (v: unknown) =>
                Array.isArray(v) ? v.map((x) => Number(x)).filter((n) => !Number.isNaN(n)) : [];
            const past = asNumList(d?.missingPastTenYearsKmpIds);
            const resume = asNumList(d?.missingResumeKmpIds);
            setMissingPastTenYearsKmpIds(past);
            setMissingResumeKmpIds(resume);
            return { missingPastTenYearsKmpIds: past, missingResumeKmpIds: resume };
        } catch {
            return null;
        }
    }, [props.prelimApplicationId]);

    const handleCloseAddModal = useCallback(() => {
        setOpen(false);
        void loadKmpDocGaps();
    }, [loadKmpDocGaps]);

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsPartnerLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentTeamsPartnerLevelAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
    }, [investmentPartnersState.actionStatus.fetchStatus === FetchStatus.IDLE, prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsPartnerLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentTeamsPartnerLevelAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
    }, [prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        if (
            props.prelimApplicationId &&
            investmentPartnersState.status.fetchStatus === FetchStatus.IDLE &&
            investmentPartnersState.actionStatus.fetchStatus === FetchStatus.IDLE
        ) {
            void loadKmpDocGaps();
        }
    }, [
        props.prelimApplicationId,
        investmentPartnersState.investmentPartners,
        investmentPartnersState.status.fetchStatus,
        investmentPartnersState.actionStatus.fetchStatus,
        loadKmpDocGaps,
    ]);

    useEffect(() => {
        const statusIdle = investmentPartnersState.status.fetchStatus === FetchStatus.IDLE;
        const actionIdle = investmentPartnersState.actionStatus.fetchStatus === FetchStatus.IDLE;
        const n = investmentPartnersState.investmentPartners?.length ?? 0;
        /** While team list or actions are loading, do not report `false` — parent full-fund validation uses this ref and would drop real KMP/doc errors after section 2 submit triggers a brief non-IDLE fetch. */
        if (!statusIdle || !actionIdle) {
            return;
        }
        const docIssue = missingPastTenYearsKmpIds.length > 0 || missingResumeKmpIds.length > 0;
        const tooFewKmp = n < 1;
        onSectionHasErrorsChangeRef.current?.(docIssue || tooFewKmp);
    }, [
        missingPastTenYearsKmpIds,
        missingResumeKmpIds,
        investmentPartnersState.investmentPartners?.length,
        investmentPartnersState.status.fetchStatus,
        investmentPartnersState.actionStatus.fetchStatus,
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
                if (silent) {
                    /** Section 2 (or others) can dispatch and briefly move this slice off IDLE; silent `submit` must not fail KMP while only a later panel is wrong. */
                    let kmpSliceIdle = false;
                    for (let i = 0; i < 50; i++) {
                        const s = investmentPartnersStateRef.current;
                        if (
                            s.status.fetchStatus === FetchStatus.IDLE &&
                            s.actionStatus.fetchStatus === FetchStatus.IDLE
                        ) {
                            kmpSliceIdle = true;
                            break;
                        }
                        await new Promise((r) => setTimeout(r, 50));
                    }
                    if (!kmpSliceIdle) {
                        return true;
                    }
                } else {
                    const statusIdle = investmentPartnersState.status.fetchStatus === FetchStatus.IDLE;
                    const actionIdle = investmentPartnersState.actionStatus.fetchStatus === FetchStatus.IDLE;
                    if (!statusIdle || !actionIdle) {
                        return false;
                    }
                }
                const n = investmentPartnersStateRef.current.investmentPartners?.length ?? 0;
                if (n < 1) {
                    if (!silent) {
                        showValidationToast('Add at least one investment team member at KMP level before continuing.');
                    }
                    return false;
                }
                const prelimId = props.prelimApplicationId;
                if (prelimId == null || Number(prelimId) <= 0) {
                    if (!silent) {
                        showValidationToast('Preliminary application is not loaded; try again in a moment.');
                    }
                    return false;
                }
                if (!silent) {
                    setKmpDocValidationBusy(true);
                }
                try {
                    let gaps = await loadKmpDocGaps();
                    if (gaps === null && silent) {
                        for (let r = 0; r < 2 && gaps === null; r++) {
                            await new Promise((res) => setTimeout(res, 70));
                            gaps = await loadKmpDocGaps();
                        }
                    }
                    if (gaps === null) {
                        if (silent) {
                            /** Do not mark section 3 failed on transient KMP status API errors during full-fund validation. */
                            return true;
                        }
                        return false;
                    }
                    const { missingPastTenYearsKmpIds: past, missingResumeKmpIds: resume } = gaps;
                    if (past.length > 0 || resume.length > 0) {
                        if (!silent) {
                            showValidationToast(
                                'Mandatory documents are incomplete for one or more KMP rows (see red indicators). Click Edit on each row to upload the past 10 years file and resume/CV.'
                            );
                        }
                        return false;
                    }
                } finally {
                    if (!silent) {
                        setKmpDocValidationBusy(false);
                    }
                }
                return true;
            },
        }),
        [investmentPartnersState, showValidationToast, props.prelimApplicationId, loadKmpDocGaps]
    );

    const tableHeaders = ["Name", "Designation", "Age", "Qualification", "Experience in AIF Business", "Area Of Expertise", "Action"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    return (
        <>
        <Box >
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                <TableRow>
                                    {headerComponent}
                                </TableRow>
                            </TableHead>
                            {investmentPartnersState.status.fetchStatus == FetchStatus.IDLE && investmentPartnersState.actionStatus.fetchStatus == FetchStatus.IDLE ?
                                <TableBody>
                                    {investmentPartnersState.investmentPartners && investmentPartnersState.investmentPartners.length > 0 ?
                                        investmentPartnersState.investmentPartners.map((row: IInvestmentPartner, index: number) => (
                                            <InvestmentPartnerRow
                                                key={row.id !== undefined ? Number(row.id) : `kmp-${index}`}
                                                row={row}
                                                missingPastTenYearsDoc={missingPastTenYearsKmpIds.includes(Number(row.id))}
                                                missingResumeDoc={missingResumeKmpIds.includes(Number(row.id))}
                                                onRowModalClosed={() => {
                                                    void loadKmpDocGaps();
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
                <Grid item xs={12}>
                    <Button onClick={handleOpen} variant="contained" disableElevation sx={{
                        textTransform: 'none', mt: 2, mb: 0, backgroundColor: '#000080',
                        '&:hover': {
                            border: '1px solid #000080',
                            color: '#000080',
                            backgroundColor: 'rgb(208 208 237)'
                        }
                    }} >
                        Add
                    </Button>
                    <InvestmentPartnerModel
                        key='add-investment-partner'
                        investmentPartnerFormData={defaultInvestmentPartner}
                        open={open}
                        handleClose={handleCloseAddModal}
                        prelimApplicationId={props.prelimApplicationId} />
                </Grid>
            </Grid>
        </Box>
        <Backdrop
            open={kmpDocValidationBusy}
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
                <CircularProgress color="inherit" size={48} thickness={4} aria-label="Verifying KMP documents" />
                {/* <Typography variant="h6" component="p" sx={{ fontWeight: 600, maxWidth: 400 }}>
                    Verifying mandatory documents…
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.88, maxWidth: 440 }}>
                    Checking KMP uploads for each team member. This may take a few seconds.
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

export default InvestmentPartner;

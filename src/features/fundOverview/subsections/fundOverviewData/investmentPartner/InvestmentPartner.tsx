import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, FormControlLabel, Grid, Modal, Paper, Snackbar, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
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

export type InvestmentPartnerHandle = {
    submit: (opts?: { silent?: boolean }) => Promise<boolean>;
};

interface InvestmentPartnerProps {
    prelimApplicationId: Number | undefined
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
    const handleClose = () => setOpen(false);
    const [validationToastOpen, setValidationToastOpen] = useState(false);
    const [validationToastMessage, setValidationToastMessage] = useState('');
    const showValidationToast = useCallback((message: string) => {
        setValidationToastMessage(message);
        setValidationToastOpen(true);
    }, []);
    const handleValidationToastClose = () => {
        setValidationToastOpen(false);
    };

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

    useImperativeHandle(
        ref,
        () => ({
            submit: async (opts?: { silent?: boolean }) => {
                const silent = opts?.silent === true;
                const statusIdle = investmentPartnersState.status.fetchStatus === FetchStatus.IDLE;
                const actionIdle = investmentPartnersState.actionStatus.fetchStatus === FetchStatus.IDLE;
                if (!silent && (!statusIdle || !actionIdle)) {
                    return false;
                }
                const n = investmentPartnersState.investmentPartners?.length ?? 0;
                if (n < 1) {
                    if (!silent) {
                        showValidationToast('Add at least one investment team member at KMP level before continuing.');
                    }
                    return false;
                }
                return true;
            },
        }),
        [investmentPartnersState, showValidationToast]
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
                                        investmentPartnersState.investmentPartners.map((row: IInvestmentPartner) => (
                                            <InvestmentPartnerRow row={row} />
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
                        handleClose={handleClose}
                        prelimApplicationId={props.prelimApplicationId} />
                </Grid>
            </Grid>
        </Box>
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

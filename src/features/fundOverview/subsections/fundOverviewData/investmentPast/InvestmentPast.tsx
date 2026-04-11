import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, FormControlLabel, Grid, Modal, Paper, Snackbar, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
import { fetchInvestmentPastAsync, selectInvestmentPast, createInvestmentPastAsync, deleteInvestmentPastAsync } from './investmentPastSlice'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import React, * as Rect from 'react'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentPast, IInvestmentPast } from "./IInvestmentPast";
import { FetchStatus } from "../../../../../lib/api-status/IStatus";
import { Delete, Edit } from '@mui/icons-material';
import { InvestmentPastRow } from "./InvestmentPastRow";
import { selectPrelimApplication } from "../prelimApplicationDataSlice";
import { InvestmentPastModel } from "./InvestmentPastModel";
import { opaqueInfoToastAlertSx } from "../../../../../lib/ui/opaqueInfoToastAlertSx";

export type InvestmentPastHandle = {
    submit: (opts?: { silent?: boolean }) => Promise<boolean>;
};

interface InvestmentPastProps {
    prelimApplicationId: Number | undefined;
    /** When false, submit() is a no-op success (table not shown). */
    hasInvestment?: boolean;
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


const InvestmentPast = forwardRef<InvestmentPastHandle, InvestmentPastProps>(function InvestmentPast(props, ref) {

    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid())
    const investmentPastsState = useAppSelector(selectInvestmentPast)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [isModelOpen, setIsModelOpen] = useState(false);
    const handleOpen = () => setIsModelOpen(true);
    const handleClose = () => setIsModelOpen(false);
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
        console.log('calling fetchInvestmentTeamsAssociateLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentPastAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
        setIsModelOpen(false)
    }, [investmentPastsState.actionStatus.fetchStatus === FetchStatus.IDLE, prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsAssociateLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentPastAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
        setIsModelOpen(false)
    }, [prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    const hasInv = props.hasInvestment !== false;

    useImperativeHandle(
        ref,
        () => ({
            submit: async (opts?: { silent?: boolean }) => {
                const silent = opts?.silent === true;
                if (!hasInv) {
                    return true;
                }
                const statusIdle = investmentPastsState.status.fetchStatus === FetchStatus.IDLE;
                const actionIdle = investmentPastsState.actionStatus.fetchStatus === FetchStatus.IDLE;
                if (!silent && (!statusIdle || !actionIdle)) {
                    return false;
                }
                const n = investmentPastsState.investmentPasts?.length ?? 0;
                if (n < 1) {
                    if (!silent) {
                        showValidationToast(
                            'Add at least one past investment record before continuing (or set "Have any investments…" to No).'
                        );
                    }
                    return false;
                }
                return true;
            },
        }),
        [hasInv, investmentPastsState, showValidationToast]
    );

    const tableHeaders = [
        "Name Of Company",
        // "Sector",
        "Amount Invested(₹ Crore)",
        "Date Of Investment",
        "Brief Profile",
        "Action"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment key={i}>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    return (
        <>
        <Box >
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                <Grid item xs={11.5}>
                    <Box >
                        <TableContainer component={Paper}  >
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                    <TableRow>
                                        {headerComponent}
                                    </TableRow>
                                </TableHead>
                                {investmentPastsState.status.fetchStatus == FetchStatus.IDLE && investmentPastsState.actionStatus.fetchStatus == FetchStatus.IDLE ?
                                    <TableBody>
                                        {investmentPastsState.investmentPasts && investmentPastsState.investmentPasts.length > 0 ?
                                            investmentPastsState.investmentPasts.map((row: IInvestmentPast) => (
                                                <InvestmentPastRow key={row.id?.toString()} row={row} />
                                            )) : <TableRow><TableCell colSpan={7}>No Rows To Display</TableCell></TableRow>
                                        }
                                    </TableBody> : <TableBody>
                                        <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
                                    </TableBody>}
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
                <Grid item xs={11.5}>
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
                    <InvestmentPastModel
                        key='add-investment-past'
                        investmentPastFormData={defaultInvestmentPast}
                        open={isModelOpen}
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

export default InvestmentPast;

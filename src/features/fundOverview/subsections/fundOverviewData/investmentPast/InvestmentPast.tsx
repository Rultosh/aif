import { Box, Button, Card, CardContent, CardHeader, Chip, FormControlLabel, Grid, Modal, Paper, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import {  fetchInvestmentPastAsync, selectInvestmentPast, createInvestmentPastAsync, deleteInvestmentPastAsync } from './investmentPastSlice'
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

interface InvestmentPastProps {
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


export const InvestmentPast = (props: InvestmentPastProps) => {

    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid())
    const investmentPastsState = useAppSelector(selectInvestmentPast)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsAssociateLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentPastAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
        setOpen(false)
    }, [investmentPastsState.actionStatus.fetchStatus === FetchStatus.IDLE, prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsAssociateLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentPastAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
        setOpen(false)
    }, [prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    const tableHeaders = ["Name Of Company", "Sector", "Amount Invested(INR Crore)", "Date Of Investment", "Action"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    return (
        <Box >
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                <Grid item xs={11.5}>
                    <Box >
                        <TableContainer component={Paper}  >
                            <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                    <TableRow>
                                        {headerComponent}
                                    </TableRow>
                                </TableHead>
                                {investmentPastsState.status.fetchStatus == FetchStatus.IDLE && investmentPastsState.actionStatus.fetchStatus == FetchStatus.IDLE?
                                <TableBody>
                                    {investmentPastsState.investmentPasts && investmentPastsState.investmentPasts.length > 0?
                                        investmentPastsState.investmentPasts.map((row: IInvestmentPast) => (
                                            <InvestmentPastRow row={row}/>
                                    )):<TableRow><TableCell colSpan={7}>Now rows to display.</TableCell></TableRow>
                                    }
                                </TableBody>:<TableBody>
                                    <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
                                </TableBody>}
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
                <Grid item xs={11.5}>
                    <Button onClick={handleOpen} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                        Add
                    </Button>
                    <InvestmentPastModel 
                        key='add-investment-past    '
                        investmentPastFormData={defaultInvestmentPast} 
                        open={open} 
                        handleClose={handleClose} 
                        prelimApplicationId={props.prelimApplicationId}/>
                </Grid>
            </Grid>
        </Box>
    );
}



export default InvestmentPast;

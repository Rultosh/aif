import { Box, Button, Card, CardContent, CardHeader, Chip, FormControlLabel, Grid, Modal, Paper, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
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

interface InvestmentAssociateProps {
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


export const InvestmentAssociate = (props: InvestmentAssociateProps) => {

    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid())
    const investmentAssociatesState = useAppSelector(selectInvestmentAssociate)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

    const tableHeaders = ["Name", "Designation", "Age", "Qualification", "Investment Experience", "Details of the Companies Invested", "Action"]

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
                                        investmentAssociatesState.investmentAssociates.map((row: IInvestmentAssociate) => (
                                            <InvestmentAssociateRow row={row} />
                                        )) : <TableRow><TableCell colSpan={7}>No rows to display.</TableCell></TableRow>
                                    }
                                </TableBody> : <TableBody>
                                    <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
                                </TableBody>}
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={11.5}>
                    <Button onClick={handleOpen} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                        Add
                    </Button>
                    <InvestmentAssociateModel
                        key='add-investment-partner'
                        investmentAssociateFormData={defaultInvestmentAssociate}
                        open={open}
                        handleClose={handleClose}
                        prelimApplicationId={props.prelimApplicationId} />
                </Grid>
            </Grid>
        </Box>
    );
}



export default InvestmentAssociate;

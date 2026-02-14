import { Box, Button, Card, CardContent, CardHeader, Chip, FormControlLabel, Grid, Modal, Paper, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from "react"
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


export const InvestmentPartner = (props: InvestmentPartnerProps) => {

    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid())
    const investmentPartnersState = useAppSelector(selectInvestmentPartners)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsPartnerLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentTeamsPartnerLevelAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
        setOpen(false)
    }, [investmentPartnersState.actionStatus.fetchStatus === FetchStatus.IDLE, prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        console.log('calling fetchInvestmentTeamsPartnerLevelAsync', props.prelimApplicationId);
        dispatch(fetchInvestmentTeamsPartnerLevelAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
        setOpen(false)
    }, [prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    const tableHeaders = ["Name", "Designation", "Age", "Qualification", "VC/ PE Experience", "Brief Details of VC/PE Experience", "Action"]

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
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                <TableRow>
                                    {headerComponent}
                                </TableRow>
                            </TableHead>
                            {investmentPartnersState.status.fetchStatus == FetchStatus.IDLE && investmentPartnersState.actionStatus.fetchStatus == FetchStatus.IDLE?
                            <TableBody>
                                {investmentPartnersState.investmentPartners && investmentPartnersState.investmentPartners.length > 0?
                                    investmentPartnersState.investmentPartners.map((row: IInvestmentPartner) => (
                                        <InvestmentPartnerRow row={row}/>
                                )):<TableRow><TableCell colSpan={7}>No rows to display.</TableCell></TableRow>
                                }
                            </TableBody>:<TableBody>
                                <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
                            </TableBody>}
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={handleOpen} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                        Add
                    </Button>
                    <InvestmentPartnerModel 
                        key='add-investment-partner'
                        investmentPartnerFormData={defaultInvestmentPartner} 
                        open={open} 
                        handleClose={handleClose} 
                        prelimApplicationId={props.prelimApplicationId}/>
                </Grid>
            </Grid>
        </Box>
    );
}



export default InvestmentPartner;

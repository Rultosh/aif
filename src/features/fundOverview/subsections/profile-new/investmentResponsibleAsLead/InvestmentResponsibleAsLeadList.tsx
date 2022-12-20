import React, * as Rect from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper';
import { getAllInvestmentResponsibleAsLeadsAsnyc, selectInvestmentResponsibleAsLeads } from './investmentResponsibleAsLeadSlice';

import uuid from "react-uuid";
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { FetchStatus } from '../../../../../lib/api-status/IStatus';
import { defaultIIInvestmentResponsibleAsLead, IInvestmentResponsibleAsLead } from './IInvestmentResponsibleAsLead';
import { InvestmentResponsibleAsLeadModel } from './InvestmentResponsibleAsLeadModel';
import { InvestmentResponsibleAsLeadRow } from './investmentResponsibleAsLeadRow';

interface InvestmentResponsibleAsLeadListProps {
    teamMemberId: number | undefined
}

export const InvestmentResponsibleAsLeadList = (props: InvestmentResponsibleAsLeadListProps) => {
    const [actionUid] = useState(uuid());
    const investmentsAsLead = useAppSelector(selectInvestmentResponsibleAsLeads);

    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);

    function openModel() {
        setOpen(true);
    }

    useEffect(() => {
        if (Number(props.teamMemberId)) {
            dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(
                wrapArgument(actionUid, Number(props.teamMemberId))
            ))
        }
    }, [])

    useEffect(() => {
        if (investmentsAsLead
            .status[String(props.teamMemberId)] && investmentsAsLead
                .status[String(props.teamMemberId)]
                .actionStatus.fetchStatus === FetchStatus.IDLE) {
            console.log(props.teamMemberId);
            if (Number(props.teamMemberId)) {
                dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(
                    wrapArgument(actionUid, Number(props.teamMemberId))
                ))
            }
        }

    }, [investmentsAsLead.status[String(props.teamMemberId)]?.actionStatus.fetchStatus == FetchStatus.IDLE])

    console.log(investmentsAsLead.data[String(props.teamMemberId)]?.investmentsAsLead)

    return (<Box><Card>
        <CardContent>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                <Typography variant="subtitle2" color='#363062' sx={{ flex: 1, mb: 1 }}>Investments responsible for (as Lead)</Typography>
                                </Grid>
                <Grid item xs={12}>
        {investmentsAsLead.data[String(props.teamMemberId)]?
            investmentsAsLead.data[String(props.teamMemberId)]?.investmentsAsLead?.map((investment: IInvestmentResponsibleAsLead) => {
                return (<InvestmentResponsibleAsLeadRow investmentResponsibleAsLead={investment} />)
            }) : <>No row to display</>}</Grid>
            <Grid item xs={12}>
        <Button onClick={openModel} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
            Add
        </Button></Grid>
        <InvestmentResponsibleAsLeadModel
            investmentResponsibleAsLead={{ ...defaultIIInvestmentResponsibleAsLead, teamMemberId: Number(props.teamMemberId) }}
            open={open}
            onClose={setOpen} />
    </Grid></CardContent></Card></Box>)
}
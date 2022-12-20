import React, * as Rect from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper';
import { getAllInvestmentResponsibleAsNonLeadsAsnyc, selectInvestmentResponsibleAsNonLeads } from './investmentResponsibleAsNonLeadSlice';

import uuid from "react-uuid";
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { FetchStatus } from '../../../../../lib/api-status/IStatus';
import { defaultIIInvestmentResponsibleAsNonLead, IInvestmentResponsibleAsNonLead } from './IInvestmentResponsibleAsNonLead';
import { InvestmentResponsibleAsNonLeadModel } from './InvestmentResponsibleAsNonLeadModel';
import { InvestmentResponsibleAsNonLeadRow } from './investmentResponsibleAsNonLeadRow';

interface InvestmentResponsibleAsNonLeadListProps {
    teamMemberId: number | undefined
}

export const InvestmentResponsibleAsNonLeadList = (props: InvestmentResponsibleAsNonLeadListProps) => {
    const [actionUid] = useState(uuid());
    const investmentsAsNonLead = useAppSelector(selectInvestmentResponsibleAsNonLeads);

    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);

    function openModel() {
        setOpen(true);
    }

    useEffect(() => {
        if (Number(props.teamMemberId)) {
            dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(
                wrapArgument(actionUid, Number(props.teamMemberId))
            ))
        }
    }, [])

    useEffect(() => {
        if (investmentsAsNonLead
            .status[String(props.teamMemberId)] && investmentsAsNonLead
                .status[String(props.teamMemberId)]
                .actionStatus.fetchStatus === FetchStatus.IDLE) {
            console.log(props.teamMemberId);
            if (Number(props.teamMemberId)) {
                dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(
                    wrapArgument(actionUid, Number(props.teamMemberId))
                ))
            }
        }

    }, [investmentsAsNonLead.status[String(props.teamMemberId)]?.actionStatus.fetchStatus == FetchStatus.IDLE])

    console.log(investmentsAsNonLead.data[String(props.teamMemberId)]?.investmentsAsNonLead)

    return (<Box><Card>
        <CardContent>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                <Typography variant="subtitle2" color='#363062' sx={{ flex: 1, mb: 1 }}>Investments responsible for (as Non Lead)</Typography>
                </Grid>
                <Grid item xs={12}>
                {investmentsAsNonLead.data[String(props.teamMemberId)] ?
                    investmentsAsNonLead.data[String(props.teamMemberId)]?.investmentsAsNonLead?.map((investment: IInvestmentResponsibleAsNonLead) => {
                        return (<InvestmentResponsibleAsNonLeadRow investmentResponsibleAsNonLead={investment} />)
                    }) : <>No row to display</>} </Grid>
                <Grid item xs={12}>
                <Button onClick={openModel} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Add
                </Button></Grid>
                <InvestmentResponsibleAsNonLeadModel
                    investmentResponsibleAsNonLead={{ ...defaultIIInvestmentResponsibleAsNonLead, teamMemberId: Number(props.teamMemberId) }}
                    open={open}
                    onClose={setOpen} />
            </Grid></CardContent></Card></Box>)
}
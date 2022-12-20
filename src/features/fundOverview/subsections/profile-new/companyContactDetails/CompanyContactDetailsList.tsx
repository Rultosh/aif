import React, * as Rect from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper';
import { getAllCompanyContactDetailssAsnyc, selectCompanyContactDetails } from './companyContactDetailsSlice';

import uuid from "react-uuid";
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { FetchStatus } from '../../../../../lib/api-status/IStatus';
import { defaultIICompanyContactDetails, ICompanyContactDetails } from './ICompanyContactDetails';
import { CompanyContactDetailsModel } from './CompanyContactDetailsModel';
import { CompanyContactDetailsRow } from './CompanyContactDetailsRow';

interface CompanyContactDetailsListProps {
    teamMemberId: number | undefined
}

export const CompanyContactDetailsList = (props: CompanyContactDetailsListProps) => {
    const [actionUid] = useState(uuid());
    const companyDetails = useAppSelector(selectCompanyContactDetails);

    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);

    function openModel() {
        setOpen(true);
    }

    useEffect(() => {
        if (Number(props.teamMemberId)) {
            dispatch(getAllCompanyContactDetailssAsnyc(
                wrapArgument(actionUid, Number(props.teamMemberId))
            ))
        }
    }, [])

    useEffect(() => {
        if (companyDetails
            .status[String(props.teamMemberId)] && companyDetails
                .status[String(props.teamMemberId)]
                .actionStatus.fetchStatus === FetchStatus.IDLE) {
            console.log(props.teamMemberId);
            if (Number(props.teamMemberId)) {
                dispatch(getAllCompanyContactDetailssAsnyc(
                    wrapArgument(actionUid, Number(props.teamMemberId))
                ))
            }
        }

    }, [companyDetails.status[String(props.teamMemberId)]?.actionStatus.fetchStatus == FetchStatus.IDLE])

    console.log(companyDetails.data[String(props.teamMemberId)]?.companyContacts)

    return (<Box><Card>
        <CardContent>
            <Grid container spacing={2} >
            <Grid item xs={12}>
                <Typography variant="subtitle2" color='#363062' sx={{ flex: 1, mb: 1}}>Contact details of above Investee Companies</Typography>
</Grid>
<Grid item xs={12}>
                {companyDetails.data[String(props.teamMemberId)] ?
                    companyDetails.data[String(props.teamMemberId)]?.companyContacts?.map((contact: ICompanyContactDetails) => {
                        return (<CompanyContactDetailsRow companyContactDetails={contact} />)
                    }) : <>No row to display</>}</Grid>
                  <Grid item xs={12}>
                <Button onClick={openModel} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Add
                </Button></Grid>
                <CompanyContactDetailsModel
                    companyContactDetails={{ ...defaultIICompanyContactDetails, teamMemberId: Number(props.teamMemberId) }}
                    open={open}
                    onClose={setOpen} /></Grid></CardContent></Card>
    </Box>)
}
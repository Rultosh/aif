import { Box, Button, Grid, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { fetchContributorDetailsAsync, selectContributorDetails } from './contributorDetailsSlice'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import React, * as Rect from 'react'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultContributorDetails, IContributorDetails } from "./IContributorDetails";
import { FetchStatus } from "../../../../../lib/api-status/IStatus";
import { ContributorDetailsRow } from "./ContributorDetailsRow";
import { selectPrelimApplication } from "../prelimApplicationDataSlice";
import { ContributorDetailsModel } from "./ContributorDetailsModel";

interface ContributorDetailsProps {
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


export const ContributorDetails = (props: ContributorDetailsProps) => {

    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid())
    const contributorDetailsState = useAppSelector(selectContributorDetails)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [open, setOpen] = useState(false);
    let totalAmountwithstate = 0;
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        console.log('calling fetchContributorDetailsAsync', props.prelimApplicationId);
        dispatch(fetchContributorDetailsAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
    }, [contributorDetailsState.actionStatus.fetchStatus === FetchStatus.IDLE, prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        console.log('calling fetchContributorDetailsAsync', props.prelimApplicationId);
        dispatch(fetchContributorDetailsAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))
    }, [prelimApplicationState.status.fetchStatus == FetchStatus.IDLE])

    const tableHeaders = ["Name Of Contributor", "Commitment Amount (₹ Crore)", "% Of Corpus", "Type", "Action"]

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
                    <Box>
                        <TableContainer component={Paper}  >
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                    <TableRow>
                                        {headerComponent}
                                    </TableRow>
                                </TableHead>
                                {contributorDetailsState.status.fetchStatus == FetchStatus.IDLE && contributorDetailsState.actionStatus.fetchStatus == FetchStatus.IDLE ?
                                    <TableBody>
                                        <>
                                            {contributorDetailsState.contributorDetails && contributorDetailsState.contributorDetails.length > 0 ?
                                                contributorDetailsState.contributorDetails.map((row: IContributorDetails) => (
                                                    <ContributorDetailsRow row={row} />
                                                )) : <TableRow><TableCell colSpan={7}>No Rows To Display</TableCell></TableRow>
                                            }

                                            {contributorDetailsState.contributorDetails && contributorDetailsState.contributorDetails.length > 0 ?
                                                <>{
                                                    contributorDetailsState.contributorDetails.map((row: IContributorDetails) => {
                                                        if (row.amount != undefined) {
                                                            var rowAmount = String(row.amount);
                                                            totalAmountwithstate = parseInt(rowAmount) + totalAmountwithstate;
                                                        }
                                                    })
                                                }
                                                    <TableRow>
                                                        <TableCell align="center" component="th" scope="row" sx={{ fontWeight: 700 }}>
                                                            Total Amount Contributed
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 700 }}>{totalAmountwithstate}</TableCell>
                                                    </TableRow>
                                                </> : <></>
                                            }
                                        </>
                                    </TableBody> : <TableBody>
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
                    <ContributorDetailsModel
                        key='add-contributor-details'
                        contributorDetailsFormData={defaultContributorDetails}
                        open={open}
                        handleClose={handleClose}
                        prelimApplicationId={props.prelimApplicationId} />
                </Grid>
            </Grid>
        </Box>
    );
}



export default ContributorDetails;

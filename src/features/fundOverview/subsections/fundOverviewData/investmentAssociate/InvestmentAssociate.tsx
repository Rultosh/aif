import { Box, Button, Card, CardContent, CardHeader, Chip, FormControlLabel, Grid, Modal, Paper, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react"
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
import FileUploadService from "../../../../../components/FileUploadService";

async function hasUploadedFiles(bucketId: string): Promise<boolean> {
    try {
        const res = await FileUploadService.list(bucketId);
        const files = Array.isArray(res?.data)
            ? res.data
            : (Array.isArray((res as any)?.data?.files) ? (res as any).data.files : []);
        return files.length > 0;
    } catch {
        return false;
    }
}

export type InvestmentAssociateHandle = {
    submit: () => Promise<boolean>;
};

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


const InvestmentAssociate = forwardRef<InvestmentAssociateHandle, InvestmentAssociateProps>(function InvestmentAssociate(props, ref) {

    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid())
    const investmentAssociatesState = useAppSelector(selectInvestmentAssociate)
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setDocumentError('');
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const [documentError, setDocumentError] = useState('');

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

    useImperativeHandle(
        ref,
        () => ({
            submit: async () => {
                setDocumentError('');
                if (
                    investmentAssociatesState.status.fetchStatus !== FetchStatus.IDLE ||
                    investmentAssociatesState.actionStatus.fetchStatus !== FetchStatus.IDLE
                ) {
                    return false;
                }
                const associates = investmentAssociatesState.investmentAssociates ?? [];
                const n = associates.length;
                if (n < 1) {
                    setDocumentError("Add at least one investment team member (other than KMP) before continuing (section 4).");
                    return false;
                }
                if (n > 5) {
                    setDocumentError("A maximum of 5 senior members (other than KMP) is allowed.");
                    return false;
                }
                const prelimId = props.prelimApplicationId != null ? String(props.prelimApplicationId) : "";
                if (!prelimId) {
                    setDocumentError("Please save the application before continuing.");
                    return false;
                }
                const resumeBucket = `sdAssociateResumeCvExperience${prelimId}`;
                const resumeOk = await hasUploadedFiles(resumeBucket);
                if (!resumeOk) {
                    setDocumentError("Please upload Resume/CV/Experience for Investment Team (other than KMP) before continuing (section 4).");
                    return false;
                }
                return true;
            },
        }),
        [investmentAssociatesState, props.prelimApplicationId]
    );

    const tableHeaders = ["Name", "Designation", "Age", "Qualification", "Experience in AIF Business", "Area Of Expertise", "Action"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="justify" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    return (
        <Box>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                {documentError && (
                    <Grid item xs={11.5}>
                        <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                            {documentError}
                        </Typography>
                    </Grid>
                )}
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
                                        )) : <TableRow><TableCell colSpan={7}>No Rows To Display</TableCell></TableRow>
                                    }
                                </TableBody> : <TableBody>
                                    <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
                                </TableBody>}
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={11.5}>
                    <Button onClick={handleOpen} variant="contained" disableElevation sx={{
                        textTransform: 'none', mt: 2, mb: 0, backgroundColor: '#000080',
                        '&:hover': {
                            border: '1px solid #000080',
                            color: '#000080',
                            backgroundColor: 'rgb(208 208 237)'
                        }
                    }}  >
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
});

export default InvestmentAssociate;

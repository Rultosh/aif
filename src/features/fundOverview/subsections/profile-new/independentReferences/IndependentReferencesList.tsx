import { useAppSelector } from '../../../../../app/hooks';
import { independentReferencesThunk, selectIndependentReferences } from './independentReferencesSlice';

import uuid from "react-uuid";
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { defaultIIIndependentReferences, IIndependentReferences } from './IIndependentReferences';
import { IndependentReferencesModel } from './IndependentReferencesModel';
import { IndependentReferencesRow } from './IndependentReferencesRow';
import { Controller } from '../../../../../lib/api-wrappers/Controller';
import React from 'react';
import { FetchStatus } from '../../../../../lib/api-status/IStatus';

interface IndependentReferencesListProps {
    parentId: number | undefined
}

export const IndependentReferencesList = <T extends unknown>(props: IndependentReferencesListProps) => {
    const defaultListData: { [key: string]: IIndependentReferences | undefined } = {};
    const actionId = useState(uuid());
    const [controller] = useState(new Controller(actionId, independentReferencesThunk));
    const state = useAppSelector(selectIndependentReferences);

    const [listData, setListData] = useState(defaultListData);

    const [open, setOpen] = useState(false);

    function openModel() {
        setOpen(true);
    }

    const tableHeaders = [
        "Name of company",
        "Designation",
        "Organisation",
        "Tele.",
        "Mobile",
        "Email",
        "Alt. Email",
        "Action"]

    let headerComponent: any[] = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    useEffect(() => {
        if (Number(props.parentId)) {
            controller.all({ ...defaultIIIndependentReferences, parentId: props.parentId });
        }
    }, [])

    useEffect(() => {
        setListData({ ...state[getDefined(props.parentId)]?.data });
    }, [state[getDefined(props.parentId)]?.data])

    return (<Box><Card>
        <CardContent>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <Typography
                        variant="subtitle2"
                        color='#363062'
                        sx={{ flex: 1, mb: 1 }}>
                        Two Independent references in r/o Team Member
                        with regard to thier investment experience
                        (other than investee companies) </Typography>
                </Grid>
                <Grid item xs={12}>
                    {getList()}
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={openModel}
                        variant="contained"
                        disableElevation
                        sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                        Add
                    </Button></Grid>
                <IndependentReferencesModel
                    independentReference={
                        {
                            ...defaultIIIndependentReferences,
                            parentId: Number(props.parentId)
                        }}
                    sharedController={controller}
                    open={open}
                    add={true}
                    onClose={setOpen} />
            </Grid></CardContent></Card></Box>)

    function getDefined(id: number | undefined): number {
        if (id) return id;
        else throw new Error("Id cannot be null");
    }

    function getList() {
        let rows: any[] = [];

        Object.keys(listData).forEach((key) => {
            let value = listData[key];
            console.log(value);
            if (value) rows.push(<IndependentReferencesRow
                independentReferences={{ ...value }} sharedController={controller} />)
        });

        if(rows.length === 0) {
            rows.push(<div style={{margin: "10px"}}>No rows to display</div>)
        }

        return controller.isAllActionCompleted(props.parentId, state)?<Box>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <Box >
                        <TableContainer component={Paper}  >
                            <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                    <TableRow>
                                        {headerComponent}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
        </Box>:<div style={{margin: "10px"}}>Loading...</div>;
    }
}
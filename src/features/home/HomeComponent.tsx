import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { fetchGridData } from './homeSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import DownloadFileRenderer from './DownloadFileRenderer'
import { wrapArgument } from '../../lib/api-status/actionWrapper';
import { getPrelimApplicationList, IPageInfo, selectPrelimApplication } from '../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice';
import uuid from "react-uuid";
import { FetchStatus } from '../../lib/api-status/IStatus';
import { Controller } from "../../lib/api-wrappers/Controller";
import { useParams } from "react-router-dom";
import { detailedApplicationThunk, selectedDetailedApplications } from "../detailedApplication/sidbiReference/detailedApplicationSlice";
import { defaultIDetailedApplication, IDetailedApplication, listDefaultIDetailedApplication} from "../detailedApplication/sidbiReference/IDetailedApplication";

export const Home = () => {

    //const { id } = useParams()
    const id =1;
    const [formData, setFormData] = useState(defaultIDetailedApplication);
    const [detailedApplications, setDetailedApplications] = useState([] as any);
    const [actionId] = useState(uuid())
    const controller = new Controller(actionId, detailedApplicationThunk);
    //const stateDetailsApplication = useAppSelector(selectedDetailedApplications);
    // const state = useAppSelector(selectedDetailedApplications);
    const dispatch = useAppDispatch();
    const prelimApplications = useAppSelector(selectPrelimApplication);

    const [actionUid] = useState(uuid());
    const [pageInfo, setPageInfo] = useState({ pageNumber: 0, pageSize: 5 } as IPageInfo)


    useEffect(() => {
        console.log('here')
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, pageInfo
        )))
    }, [prelimApplications.prelimApplication])


    // useEffect(() => {
    //     if (id && Number(id)) {
    //       if (!state[0]?.data[id]) {
    //         controller.read({ ...formData, id: Number(id) });
    //       }
    //     }
    //   }, [])
    
    //   useEffect(() => {
    //     let newData = state[0]?.data[Number(id)];
    //     if (newData) {
    //         setFormData(newData)
    //         setDetailedApplications(newData)
    //     }
    //   }, [state[0]?.data])

   /* useEffect(() => {
        
            if (!stateDetailsApplication.applications) {
                controller.read({ ...formData });
            }
        
    }, [])

   /* useEffect(() => {
        let newData = stateDetailsApplication['applications'];
        if (newData) setFormData(newData)
    }, [stateDetailsApplication['applications']])*/

    const tableHeaders = ["Fund Name", "Contact Person", "Status", "Application Date", "Target Corpus", "Contribution Sought", "Query Resolution", "Workflow State"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    const detailedTableHeaders = ["Sidbi Reference Number", "Contact Person", "Status"]

    let detailedHeaderComponent = []

    for (let i = 0; i < detailedTableHeaders.length; i++) {
        detailedHeaderComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{detailedTableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    const nextPage = () => {
        let updatedPageInfo = { ...pageInfo, pageNumber: Number(pageInfo.pageNumber) + 1 }
        setPageInfo(updatedPageInfo)
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, updatedPageInfo
        )))
    }

    const previousPage = () => {
        let updatedPageInfo = { ...pageInfo, pageNumber: Number(pageInfo.pageNumber) - 1 }
        setPageInfo(updatedPageInfo)
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, updatedPageInfo
        )))
    }

    return (
        <div className="homeComp">
            <NavigationBar></NavigationBar>
            {prelimApplications.allStatus.fetchStatus === FetchStatus.IDLE ? <div >
                <TableContainer component={Paper}  >
                    <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                        <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                            <TableRow>
                                {headerComponent}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                prelimApplications.prelimApplications ? prelimApplications.prelimApplications.map((row) => {
                                    return <TableRow key={`${row.nameOfTheFund}`}>
                                        <TableCell align="center" component="th" scope="row">
                                            <a href={`/preliminary/${row.id}/fund`}>{row.nameOfTheFund}</a>
                                        </TableCell>
                                        <TableCell align="center">Sample Contact</TableCell>
                                        <TableCell align="center">{String(row.status)}</TableCell>
                                        <TableCell align="center">{row.createdOn}</TableCell>
                                        <TableCell align="center">{String(row.sdTotalTargetCorpus)}</TableCell>
                                        <TableCell align="center">{String(row.contributionSought || 0)}</TableCell>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                }) : <></>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ float: 'right' }}>
                    {pageInfo.pageNumber > 0 ? <Button variant='outlined' sx={{ background: "#363062", color: "white" }} onClick={previousPage}>Previous</Button> : <></>}
                    {prelimApplications.prelimApplications.length >= 5 ? <Button variant='outlined' sx={{ background: "#363062", color: 'white' }} onClick={nextPage}>Next</Button> : <></>}
                </div>
            </div> : <div style={{ padding: "20px", backgroundColor: '#f2f2f2' }}>Loading...</div> }
        </div>
    )
}

export default Home;
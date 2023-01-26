import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import NavigationBar from '../../components/NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect } from "react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { wrapArgument } from '../../lib/api-status/actionWrapper';
import { getPrelimApplicationList, IPageInfo, selectPrelimApplication } from '../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice';
import uuid from "react-uuid";
import { FetchStatus } from '../../lib/api-status/IStatus';
import { Controller } from "../../lib/api-wrappers/Controller";
import { detailedApplicationThunk, selectedDetailedApplications } from "../detailedApplication/sidbiReference/detailedApplicationSlice";
import { defaultIDetailedApplication } from "../detailedApplication/sidbiReference/IDetailedApplication";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MailIcon from '@mui/icons-material/Mail';
import QueryResolutionModal from './QueryResolutionModal'

export const Home = () => {

    //const { id } = useParams()
    const id = 1;
    const [formData, setFormData] = useState(defaultIDetailedApplication);
    // const [detailedApplications, setDetailedApplications] = useState([] as any);
    const [actionId] = useState(uuid())
    const controller = new Controller(actionId, detailedApplicationThunk);
    //const stateDetailsApplication = useAppSelector(selectedDetailedApplications);
    const state = useAppSelector(selectedDetailedApplications);
    const dispatch = useAppDispatch();
    const prelimApplications = useAppSelector(selectPrelimApplication);
    const [openQueryModal, setOpenQueryModal] = useState(false);
    const [selectedRow , setSelectedRow] = useState({} as any);

    const [actionUid] = useState(uuid());
    const [pageInfo, setPageInfo] = useState({ pageNumber: 0, pageSize: 5 } as IPageInfo)

    function openModel(row:any) {
        setSelectedRow(row)
        setOpenQueryModal(true);
    }

    function closeModel() {
        setOpenQueryModal(false);
    }
    useEffect(() => {
        console.log('here')
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, pageInfo
        )))
    }, [prelimApplications.prelimApplication])



    const tableHeaders = [
        "Fund Name",
        "Contact Person",
        "Status",
        "Preliminary Application Date",
        "Detailed Application Date",
        "Target Corpus",
        "Contribution Sought",
        "Download",
        "Query Resolution",
        "Workflow State"]

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

    


    const getStatusDescription = (stage: String | undefined, status: String | undefined) => {

        const stageDescription = stage === "PRELIM" ? "Preliminary application" : "Detailed application";

        switch (status) {
            case "CREATED":
                return "Pending submission - " + stageDescription;
            case "SUBMITTED":
                return "Pending review - " + stageDescription;
            case "REVISE":
                return "Pending revision - " + stageDescription;
            case "APPROVED":
                return "Approved - " + stageDescription;
            case "REJECTED":
                return "Rejected - " + stageDescription;
            default:
                return "Invalid Status";
        }

    }

    return (
        <div className="homeComp" style={{ height: 670 }}>
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
                                        {row.stage === "PRELIM" ? <TableCell align="center" component="th" scope="row">
                                            <a href={`/preliminary/${row.id}/fund`}>{row.nameOfTheFund}</a>
                                        </TableCell> : <TableCell align="center" component="th" scope="row">
                                            <a href={`/detailed/${row.detailedApplicationId}/SidbiReference`}>{row.nameOfTheFund}</a>
                                        </TableCell>}
                                        <TableCell align="center">{row.investmentManager}</TableCell>
                                        <TableCell align="center">{String(getStatusDescription(row.stage, row.status))}</TableCell>
                                        <TableCell align="center">{row.detailedApplicationCreatedOn}</TableCell>
                                        <TableCell align="center">{row.createdOn}</TableCell>
                                        <TableCell align="center">{String(row.sdTotalTargetCorpus)}</TableCell>
                                        <TableCell align="center">{String(row.contributionSought || 0)}</TableCell>
                                        {row.stage === "PRELIM" ? <TableCell align="center" component="th" scope="row">
                                            <Tooltip title="Download">
                                                <IconButton>
                                                    <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadPreview`)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download All">
                                                <IconButton>
                                                    <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadAsZip`)} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell> : <TableCell align="center" component="th" scope="row">
                                            <Tooltip title="Download">
                                                <IconButton>
                                                    <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadPreview`)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download All">
                                                <IconButton>
                                                    <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadAsZip`)} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>}
                                        <TableCell align="center"><MailIcon onClick={() => openModel(row)} ></MailIcon></TableCell>
                                        <TableCell align="center"></TableCell>
                                       
                                    </TableRow>
                                }) : <></>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container sx={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Grid item xs={4}>
                        <Box >
                            {pageInfo.pageNumber > 0 ? <Button variant='outlined' sx={{ background: "#363062", color: "white" }} onClick={previousPage}>Previous</Button> : <></>}
                            {prelimApplications.prelimApplications.length >= 5 ? <Button variant='outlined' sx={{ background: "#363062", color: 'white' }} onClick={nextPage}>Next</Button> : <></>}
                        </Box>
                    </Grid>
                </Grid>

                {openQueryModal ? <QueryResolutionModal
                                        isActive = {openQueryModal}
                                        open={() => openModel(selectedRow)}
                                        close={closeModel}
                                        prelimDetails = {selectedRow}
                                        ></QueryResolutionModal>
                                            //investmentAssociateFormData={row}
                                            
                                            //prelimApplicationId={props.row.prelimApplicationId} />
                                            : <></>}

            </div> : <div style={{ padding: "20px", backgroundColor: '#f2f2f2' }}>Loading...</div>}

        </div>
    )
}

export default Home;
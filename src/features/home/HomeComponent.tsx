import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Container, FormControl, InputLabel, Typography, Pagination, MenuItem } from '@mui/material';
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
import { defaultIDetailedApplication, IDetailedApplication } from "../detailedApplication/sidbiReference/IDetailedApplication";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MailIcon from '@mui/icons-material/Mail';
import HistoryIcon from '@mui/icons-material/History';
import QueryResolutionModal from './QueryResolutionModal'
import HistoryModal from './HistoryModal'
import orengeImg from '../../images/Orange.png'
import greenImg from '../../images/Green.png'
import redImg from '../../images/red.png'
import greyImg from '../../images/grey.png'
import { selectUsers } from '../admin/adminSlice'
import { IPrelimApplicationData } from '../fundOverview/subsections/fundOverviewData/IPrelimApplicationData';
import Moment from 'moment';
import {CheckAuth} from '../../app/api';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const Home = (pros:any) => {

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
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState({} as any);
    const usersState = useAppSelector(selectUsers)
    const [actionUid] = useState(uuid());
    const [pageInfo, setPageInfo] = useState({ pageNumber: 0, pageSize: 5 } as IPageInfo)
    const [selectedRowHistory, setSelectedRowHistory] = useState(0);
    const navigate = useNavigate()
    const [pageInfoSelect, setPageInfoSelect] = useState(pageInfo.pageSize)
    
    const handleChange = (event: SelectChangeEvent) => {
        let updatedPageInfo = { ...pageInfo, pageSize: parseInt(event.target.value) }
        setPageInfoSelect(parseInt(event.target.value));
        setPageInfo(updatedPageInfo)
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, updatedPageInfo
        )))
    };

    function openModel(row: any) {
        setSelectedRow(row)
        setOpenQueryModal(true);
    }

    function openModelHistory(row: any) {
        setSelectedRowHistory(row)
        setOpenHistoryModal(true);
    }

    function closeModel() {
        setOpenQueryModal(false);
    }

    function closeModelHistory() {
        setOpenHistoryModal(false);
    }

    useEffect(() => {
        console.log('here')
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, pageInfo
        )))
    }, [prelimApplications.prelimApplication])
console.log(prelimApplications.prelimApplication);
    useEffect(() => {
        console.log("checking homeunauth",CheckAuth.isUnauthorized)
        if(CheckAuth.isUnauthorized){
            navigate('/login')
        }
    })

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
        "History",
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
        setPageInfoSelect(pageInfo.pageSize);
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, updatedPageInfo
        )))
    }

    const previousPage = () => {
        let updatedPageInfo = { ...pageInfo, pageNumber: Number(pageInfo.pageNumber) - 1 }
        setPageInfo(updatedPageInfo)
        setPageInfoSelect(pageInfo.pageSize);
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, updatedPageInfo
        )))
    }

    const isGoodToShowApplication = (row: IPrelimApplicationData) => {
        let role = usersState.role;
        if (row.status === 'SUBMITTED' && role == 'ADMIN')
            return true
        if (['REVISE','CREATED'].includes(String(row.status)) && role == 'USER')
            return true
        return false
    }

    const getStatusImg = (row: IPrelimApplicationData) => {
        if (row.status == 'REJECTED') {
            return redImg
        }
        else if (row.status == 'CREATED') {
            return greyImg
        }
        else if (row.status == 'REVISE' || row.status == 'SUBMITTED') {
            return orengeImg
        }
        else if (row.status == 'APPROVED') {
            return greenImg
        }
    }
    const getPath = (status: String | undefined) => {
        if (usersState.role == 'ADMIN') {
            return 'preview'
        }
        let path = (status && ['SUBMITTED', 'APPROVED'].includes(status.toString())) ? 'preview' : 'fund'
        return path;
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
        <div className="homeComp">
            <NavigationBar></NavigationBar>
            {prelimApplications.allStatus.fetchStatus === FetchStatus.IDLE ? <>
                <Container maxWidth="xl" sx={{ py: '20px' }}>
                    <Paper elevation={0}>
                        <Grid container sx={{ flexDirection: 'row', justifyContent: 'center', py: '20px' }}>
                            <Grid item>
                            <Typography variant="subtitle1" gutterBottom sx={{ display:  'inline-block', marginTop: '15px', marginRight: '10px' }}>
                            Rows per page:
                            </Typography>
                                <FormControl sx={{ minWidth: 60 }}>
                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={String(pageInfoSelect)}
                                        // label="Age"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <TableContainer>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
                                                    {isGoodToShowApplication(row) ?<a href={`/preliminary/${row.id}/${String(getPath(row.status))}`}>{row.nameOfTheFund}</a> : <p>{row.nameOfTheFund}</p>}
                                                </TableCell> : <TableCell align="center" component="th" scope="row">
                                                    {isGoodToShowApplication(row) ? <a href={`/detailed/${row.detailedApplicationId}/SidbiReference`}>{row.nameOfTheFund}</a> : <p>{row.nameOfTheFund}</p>}
                                                </TableCell>}
                                                <TableCell align="center">{row.investmentManager}</TableCell>
                                                <TableCell align="center">{String(getStatusDescription(row.stage, row.status))}</TableCell>
                                                <TableCell align="center">{row.detailedApplicationCreatedOn}</TableCell>
                                                <TableCell align="center">{Moment(String(row.createdOn)).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell align="center">{String(row.sdTotalTargetCorpus)}</TableCell>
                                                <TableCell align="center">{String(row.contributionSought || 0)}</TableCell>
                                                {row.stage === "PRELIM" ? <TableCell align="center" component="th" scope="row">
                                                    <Tooltip title="Download">
                                                        <IconButton>
                                                            <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadPreview?access_token=${localStorage.getItem('token')}`)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Download All">
                                                        <IconButton>
                                                            <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadAsZip?access_token=${localStorage.getItem('token')}`)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell> : <TableCell align="center" component="th" scope="row">
                                                    <Tooltip title="Download">
                                                        <IconButton>
                                                            <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/detailedApplications/${row.detailedApplicationId}/downloadPreview?access_token=${localStorage.getItem('token')}`)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Download All">
                                                        <IconButton>
                                                            <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/detailedApplications/${row.detailedApplicationId}/downloadAsZip?access_token=${localStorage.getItem('token')}`)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>}
                                                <TableCell align="center"><MailIcon onClick={() => openModel(row)} ></MailIcon></TableCell>
                                                <TableCell align="center"><HistoryIcon onClick={() => openModelHistory(row)} ></HistoryIcon></TableCell>
                                                <TableCell align="center">
                                                    <Grid container xs={12} spacing={0.5}>
                                                        <Grid item >
                                                            <Tooltip title={row.stage == 'PRELIM' ? "Preliminary application - " + row.status : "Preliminary application - APPROVED"}>
                                                                <Box
                                                                    component="img"
                                                                    sx={{ width: '15px', height: '15px', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                                    alt="success"
                                                                    src={row.stage == 'PRELIM' ? getStatusImg(row) : greenImg}
                                                                />
                                                            </Tooltip>
                                                        </Grid>
                                                        {row.stage == 'DETAILED' ? 
                                                        <Grid item >
                                                            <Tooltip title={"Detailed application - " + row.status}>
                                                                <Box
                                                                    component="img"
                                                                    sx={{ width: '15px', height: '15px', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                                    alt="success"
                                                                    src={getStatusImg(row)}
                                                                />
                                                            </Tooltip>
                                                        </Grid> : <></>}

                                                    </Grid>
                                                </TableCell>

                                            </TableRow>
                                        }) : <></>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <Grid container sx={{ flexDirection: 'row', justifyContent: 'center', py: '20px' }}>
                            <Grid item>
                                <Box >
                                    {pageInfo.pageNumber > 0 ? <Button variant='contained' sx={{ backgroundImage: "linear-gradient(to bottom right, #475eab, #00b6f0)", color: 'white', fontWeight: 700, mr: '20px' }} onClick={previousPage}><KeyboardDoubleArrowLeftIcon /> Previous</Button> : <></>}
                                    {prelimApplications.prelimApplications.length >= 5 ? <Button variant='contained' sx={{ backgroundImage: "linear-gradient(to bottom right, #475eab, #00b6f0)", color: 'white', fontWeight: 700 }} onClick={nextPage}>Next <KeyboardDoubleArrowRightIcon /></Button> : <></>}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                    {openQueryModal ? <QueryResolutionModal
                        isActive={openQueryModal}
                        open={() => openModel(selectedRow)}
                        close={closeModel}
                        prelimDetails={selectedRow}
                    ></QueryResolutionModal>
                        //investmentAssociateFormData={row}

                        //prelimApplicationId={props.row.prelimApplicationId} />
                        : <></>}

                    {openHistoryModal ? <HistoryModal
                        isActive={openHistoryModal}
                        open={() => openModelHistory(selectedRowHistory)}
                        close={closeModelHistory}
                        prelimDetails={selectedRowHistory}
                    ></HistoryModal>
                        //investmentAssociateFormData={row}

                        //prelimApplicationId={props.row.prelimApplicationId} />
                        : <></>}
                </Container>
            </> : <div style={{ padding: "20px", backgroundColor: '#f2f2f2' }}>Loading...</div>}

        </div>
    )
}

export default Home;
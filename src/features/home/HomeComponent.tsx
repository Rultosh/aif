import '../../index.css';
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Container, FormControl, InputLabel, Typography, Pagination, MenuItem, Breadcrumbs, Link, Chip, Backdrop } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NavigationBar from '../../components/NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect } from "react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { wrapArgument } from '../../lib/api-status/actionWrapper';
import { getPrelimApplicationList, IPageInfo, selectPrelimApplication } from '../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice';
import logo from '../../images/logo.png';
import logoNps from '../../images/logo_nps.png';
import uuid from "react-uuid";
import { FetchStatus } from '../../lib/api-status/IStatus';
import { Controller } from "../../lib/api-wrappers/Controller";
import { detailedApplicationThunk, selectedDetailedApplications } from "../detailedApplication/sidbiReference/detailedApplicationSlice";
import { defaultIDetailedApplication, IDetailedApplication } from "../detailedApplication/sidbiReference/IDetailedApplication";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileDownloadIcon from '@mui/icons-material/DownloadForOfflineRounded';
// import MailIcon from '@mui/icons-material/Mail';
import { ReactComponent as MailIcon } from '../../images/email.svg';
// import HistoryIcon from '@mui/icons-material/History';
import { ReactComponent as HistoryIcon } from '../../images/list.svg';
import QueryResolutionModal from './QueryResolutionModal'
import HistoryModal from './HistoryModal'
// import orengeImg from '../../images/Orange.png'
// import greenImg from '../../images/Green.png'
// import redImg from '../../images/red.png'
// import greyImg from '../../images/grey.png'
import { selectUsers } from '../admin/adminSlice'
import { IPrelimApplicationData } from '../fundOverview/subsections/fundOverviewData/IPrelimApplicationData';
import Moment from 'moment';
import { CheckAuth } from '../../app/api';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const Home = (pros: any) => {

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
        console.log("checking homeunauth", CheckAuth.isUnauthorized)
        if (CheckAuth.isUnauthorized) {
            navigate('/login')
        }
    })

    const tableHeaders = [
        "Fund Name",
        "Contact Person",
        "Status",
        "Start Date",
        // "Detailed Date",
        "Target Corpus",
        "Contribution",
        "Download",
        "Query",
        "History",
        "Progress"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment key={tableHeaders[i]}>
                <TableCell align="center" sx={{ fontWeight: '700', color: '#64748b', p: '12px 10px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#cdddf1' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

    // const detailedTableHeaders = ["Sidbi Reference Number", "Contact Person", "Status"]

    // let detailedHeaderComponent = []

    // for (let i = 0; i < detailedTableHeaders.length; i++) {
    //     detailedHeaderComponent.push(
    //         <React.Fragment >
    //             <TableCell align="center" sx={{ fontWeight: 'bold' }}>{detailedTableHeaders[i]}</TableCell>
    //         </React.Fragment>)
    // }

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
        if ((row.status === 'SUBMITTED' || row.status == 'TEMP_CLOSED' || row.status == 'CLOSED') && role == 'ADMIN')
            return true
        if (['CLOSE', 'REVISE', 'CREATED'].includes(String(row.status)) && role == 'USER')
            return true
        return false
    }

    const getStatusChip = (row: IPrelimApplicationData) => {
        const status = row.status;
        let color: "success" | "error" | "warning" | "info" | "default" | "primary" | "secondary" = "default";
        let label = String(getStatusDescription(row.stage, status));

        if (status === 'APPROVED') {
            color = "success";
        } else if (status === 'REJECTED' || status === 'CLOSED') {
            color = "error";
        } else if (status === 'SUBMITTED' || status === 'REVISE') {
            color = "warning";
        } else if (status === 'CREATED' || status === 'TEMP_CLOSED') {
            color = "default";
        }

        return <Chip label={label} color={color} size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px' }} />;
    }
    const getPath = (status: String | undefined) => {
        if (usersState.role == 'ADMIN') {
            return 'preview'
        }
        let path = (status && ['SUBMITTED', 'APPROVED', 'TEMP_CLOSED', 'CLOSED'].includes(status.toString())) ? 'preview' : 'fund'
        return path;
    }

    const getStatusDescription = (stage: String | undefined, status: String | undefined) => {

        const stageDescription = stage === "PRELIM" ? "Preliminary application" : "Detailed application";

        switch (status) {
            case "CREATED":
                return "Pending submission";
            case "SUBMITTED":
                return "Pending review";
            case "REVISE":
                return "Pending revision";
            case "APPROVED":
                return "Approved";
            case "REJECTED":
                return "Rejected";
            case "TEMP_CLOSED":
                return "Temporarily Closed";
            case "CLOSED":
                return "Closed";
            default:
                return "Invalid Status";
        }

    }
    return (
        <div className="homeComp">
            <NavigationBar></NavigationBar>
            {prelimApplications.allStatus.fetchStatus === FetchStatus.IDLE ? <>
                <Container maxWidth="xl" sx={{ pt: '120px', pb: '80px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ mb: '30px' }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#013d7b' }}>Applications</Typography>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography variant="body2"
                                    sx={{ color: '#476bbc', display: 'flex', alignItems: 'center' }}
                                >
                                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                    Home
                                </Typography>
                            </Breadcrumbs>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '20px' }}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#34344b', color: 'white', fontWeight: 600, textTransform: 'capitalize' }}
                                className='btn-primary'
                                startIcon={<AddCircleIcon />}
                                href="#/Preliminary"
                            >
                                Start Application
                            </Button>
                        </Box>
                    </Box>
                    <Paper elevation={0} sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #edf2f7'
                    }}>
                        <TableContainer sx={{ p: '0px' }}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                    <TableRow>
                                        {headerComponent}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        prelimApplications.prelimApplications ? prelimApplications.prelimApplications.map((row) => {
                                            return <TableRow
                                                key={`${row.nameOfTheFund}`}
                                                sx={{
                                                    '&:hover': { backgroundColor: '#f1f5f9' },
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                            >
                                                {row.stage === "PRELIM" ? <TableCell align="center" component="th" scope="row" sx={{ py: '16px', pl: '24px' }}>
                                                    {isGoodToShowApplication(row) ? <a href={`#/preliminary/${row.id}/selfrating`} style={{ color: '#3f4bee', fontWeight: 600 }}>{row.nameOfTheFund}</a> : <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{row.nameOfTheFund}</Typography>}
                                                    {/* {isGoodToShowApplication(row) ? <a href={`#/preliminary/${row.id}/${String(getPath(row.status))}`} style={{ color: '#3f4bee', fontWeight: 600 }}>{row.nameOfTheFund}</a> : <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{row.nameOfTheFund}</Typography>} */}
                                                </TableCell> : <TableCell align="center" component="th" scope="row" sx={{ py: '16px', pl: '24px' }}>
                                                    {isGoodToShowApplication(row) ? <a href={`#/detailed/${row.detailedApplicationId}/SidbiReference`} style={{ color: '#3f4bee', fontWeight: 600 }}>{row.nameOfTheFund}</a> : <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{row.nameOfTheFund}</Typography>}
                                                </TableCell>}
                                                <TableCell align="center" sx={{ color: '#64748b' }}>{row.createdByName}</TableCell>
                                                <TableCell align="center" sx={{ minWidth: '160px' }}>{getStatusChip(row)}</TableCell>
                                                <TableCell align="center" sx={{ color: '#64748b' }}>{row.applicationSubmissionDate ? Moment(String(row.applicationSubmissionDate)).format("DD MMM YYYY") : '-'}</TableCell>
                                                {/* <TableCell align="center" sx={{ color: '#64748b' }}>{row.detailedApplicationSubmissionDate ? Moment(String(row.detailedApplicationSubmissionDate)).format("DD MMM YYYY") : '-'}</TableCell> */}
                                                <TableCell align="center" sx={{ fontWeight: 500, color: '#1e293b' }}>{String(row.sdTotalTargetCorpus)}</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 500, color: '#1e293b' }}>{String(row.contributionSought || 0)}</TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                        <Tooltip title="Download Preview">
                                                            <IconButton size="small" sx={{ color: '#3f4bee', '&:hover': { backgroundColor: '#eff6ff' } }} onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.stage === "PRELIM" ? row.id : row.detailedApplicationId}/downloadPreview?access_token=${localStorage.getItem('token')}`)}>
                                                                <FileDownloadIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Download ZIP">
                                                            <IconButton size="small" sx={{ color: '#2cc56c', '&:hover': { backgroundColor: '#f0fdf4' } }} onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.stage === "PRELIM" ? row.id : row.detailedApplicationId}/downloadAsZip?access_token=${localStorage.getItem('token')}`)}>
                                                                <FileDownloadIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" sx={{ color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }} onClick={() => openModel(row)}>
                                                        <MailIcon style={{ width: '20px', height: '20px' }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" sx={{ color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }} onClick={() => openModelHistory(row)}>
                                                        <HistoryIcon style={{ width: '20px', height: '20px', fill: 'currentColor' }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                        <Tooltip title={`${row.stage === 'PRELIM' ? row.status : 'APPROVED'}`}>
                                                            <Box sx={{
                                                                width: 10,
                                                                height: 10,
                                                                borderRadius: '50%',
                                                                backgroundColor: row.stage === 'PRELIM' ?
                                                                    (row.status === 'APPROVED' ? '#2cc56c' : (row.status === 'REJECTED' || row.status === 'CLOSED' ? '#ef4444' : (row.status === 'CREATED' || row.status === 'TEMP_CLOSED' ? '#94a3b8' : '#f59e0b'))) :
                                                                    '#2cc56c'
                                                            }} />
                                                        </Tooltip>
                                                        {row.stage === 'DETAILED' && (
                                                            <Tooltip title={`${row.status}`}>
                                                                <Box sx={{
                                                                    width: 10,
                                                                    height: 10,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: row.status === 'APPROVED' ? '#2cc56c' : (row.status === 'REJECTED' || row.status === 'CLOSED' ? '#ef4444' : (row.status === 'CREATED' || row.status === 'TEMP_CLOSED' ? '#94a3b8' : '#f59e0b'))
                                                                }} />
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        }) : <TableRow><TableCell colSpan={11} align="center">No data available</TableCell></TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: '20px 24px',
                            borderTop: '1px solid #edf2f7'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>Rows per page:</Typography>
                                <FormControl size="small" variant="outlined">
                                    <Select
                                        value={String(pageInfoSelect)}
                                        onChange={handleChange}
                                        sx={{
                                            fontSize: '0.875rem',
                                            borderRadius: '8px',
                                            '.MuiSelect-select': { py: '4px' }
                                        }}
                                    >
                                        {[5, 10, 50, 100, 500].map(val => (
                                            <MenuItem key={val} value={val}>{val}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    disabled={pageInfo.pageNumber <= 0}
                                    variant="outlined"
                                    size="small"
                                    onClick={previousPage}
                                    startIcon={<KeyboardDoubleArrowLeftIcon />}
                                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                                >
                                    Previous
                                </Button>
                                <Button
                                    disabled={prelimApplications.prelimApplications.length < pageInfo.pageSize}
                                    variant="outlined"
                                    size="small"
                                    onClick={nextPage}
                                    endIcon={<KeyboardDoubleArrowRightIcon />}
                                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Box>
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
            </> : (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgb(0 0 0 / 15%)', flexDirection: 'column' }}
                    open={true}
                >
                    <img src={logoNps} alt="Logo" className="loader-logo" />
                    <div className="dot-loader">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </Backdrop>
            )}

        </div>
    )
}

export default Home;
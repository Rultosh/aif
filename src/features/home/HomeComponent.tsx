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
import { createPrelimApplicationAsync, createShellPrelimApplicationAsync, getPrelimApplicationList, IPageInfo, PrelimApplicationState, selectPrelimApplication } from '../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice';
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
// import { ReactComponent as HistoryIcon } from '../../images/list.svg';
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ReactComponent as ViewIcon } from '../../images/view.svg';
import { ReactComponent as DownloadIcon } from '../../images/download.svg';
import { ReactComponent as EmailListIcon } from '../../images/email_list.svg';
import { ReactComponent as HistoryCustomIcon } from '../../images/history.svg';
import { ReactComponent as SettingCustomIcon } from '../../images/setting.svg';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const Home = (pros: any) => {

    //const { id } = useParams()
    const id = 1;
    const [formData, setFormData] = useState(defaultIDetailedApplication);
    const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
    const [prelimApplicationFormData, setPrelimApplicationFormData] = useState(prelimApplicationState.prelimApplication);
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
    const [jumpPage, setJumpPage] = useState("1");

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
                <TableCell align="left" sx={{ fontWeight: '600', color: '#1a1a1a', p: '12px 10px', fontSize: '13px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#e9e9f6' }}>{tableHeaders[i]}</TableCell>
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

    const goToPage = (pageNo: number) => {
        let updatedPageInfo = { ...pageInfo, pageNumber: pageNo }
        setPageInfo(updatedPageInfo)
        setPageInfoSelect(pageInfo.pageSize);
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, updatedPageInfo
        )))
    }

    const handleJumpPage = () => {
        const page = parseInt(jumpPage);
        if (!isNaN(page) && page > 0) {
            goToPage(page - 1);
        }
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

        if (stage !== "PRELIM") return "Approved";

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
                <Container maxWidth="xl" sx={{ pt: '90px', pb: '80px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '20px' }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333333' }}>Applications</Typography>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography variant="body2"
                                    sx={{ color: '#476bbc', display: 'flex', alignItems: 'center' }}
                                >
                                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                    Home
                                </Typography>
                            </Breadcrumbs>
                        </Box>
                        <Button
                            variant="outlined"
                            sx={{
                                color: '#FF671F',
                                borderColor: '#FF671F',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: '4px',
                                px: 3,
                                '&:hover': {
                                    borderColor: '#e85a15',
                                    color: '#e85a15',
                                    backgroundColor: 'rgba(255, 103, 30, 0.04)'
                                }
                            }}
                            onClick={async () => {
                                try {
                                    let application: IPrelimApplicationData = await dispatch(
                                        createShellPrelimApplicationAsync(wrapArgument(actionUid, prelimApplicationState.prelimApplication))
                                    ).unwrap();
                                    navigate(`/Preliminary/${application.id}/selfRating`)
                                } catch (error: any) {
                                    console.error("Failed to start application:", error);
                                    alert(error?.message || "An unexpected error occurred while starting the application.");
                                }
                            }}
                        >
                            Start Application
                        </Button>
                    </Box>
                    <Paper elevation={0} sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
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
                                                {row.stage === "PRELIM" ?
                                                    <TableCell align="left" component="th" scope="row" sx={{ p: '12px 10px' }}>
                                                        {isGoodToShowApplication(row) ? <a href={`#/preliminary/${row.id}/selfrating`} style={{ color: '#3f4bee', fontWeight: 600 }}>{row.nameOfTheFund}</a> : <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{row.nameOfTheFund}</Typography>}
<<<<<<< Updated upstream
                                                        {/* {isGoodToShowApplication(row) ? <a href={`#/preliminary/${row.id}/${String(getPath(row.status))}`} style={{ color: '#3f4bee', fontWeight: 600 }}>{row.nameOfTheFund}</a> : <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{row.nameOfTheFund}</Typography>} */}
                                                    </TableCell> : <TableCell align="left" component="th" scope="row" sx={{ p: '12px 10px' }}>
                                                        {<Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{row.nameOfTheFund}</Typography>}
                                                    </TableCell>}
                                                <TableCell align="left" sx={{ color: '#64748b' }}>{row.createdByName}</TableCell>
                                                <TableCell align="left" sx={{ minWidth: '160px' }}>{getStatusChip(row)}</TableCell>
                                                <TableCell align="left" sx={{ color: '#64748b' }}>{row.applicationSubmissionDate ? Moment(String(row.applicationSubmissionDate)).format("DD MMM YYYY") : '-'}</TableCell>
                                                {/* <TableCell align="left" sx={{ color: '#64748b' }}>{row.detailedApplicationSubmissionDate ? Moment(String(row.detailedApplicationSubmissionDate)).format("DD MMM YYYY") : '-'}</TableCell> */}
                                                <TableCell align="left" sx={{ fontWeight: 500, color: '#1e293b' }}>{String(row.sdTotalTargetCorpus)}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 500, color: '#1e293b' }}>{String(row.contributionSought || 0)}</TableCell>
                                                <TableCell align="left">
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1.5 }}>
                                                        <Tooltip title="View Preview">
                                                            <IconButton size="small" sx={{ p: '2px', color: '#1a1a1a', '&:hover': { backgroundColor: '#f3f4f6' } }} onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.stage === "PRELIM" ? row.id : row.detailedApplicationId}/downloadPreview?access_token=${localStorage.getItem('token')}`)}>
                                                                <ViewIcon style={{ width: '22px', height: '22px' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Download ZIP">
                                                            <IconButton size="small" sx={{ p: '2px', color: '#1a1a1a', '&:hover': { backgroundColor: '#f3f4f6' } }} onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.stage === "PRELIM" ? row.id : row.detailedApplicationId}/downloadAsZip?access_token=${localStorage.getItem('token')}`)}>
                                                                <DownloadIcon style={{ width: '22px', height: '22px' }} />
=======
                                                    {/* {isGoodToShowApplication(row) ? <a href={`#/preliminary/${row.id}/${String(getPath(row.status))}`} style={{ color: '#3f4bee', fontWeight: 600 }}>{row.nameOfTheFund}</a> : <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{row.nameOfTheFund}</Typography>} */}
                                                </TableCell> : <TableCell align="center" component="th" scope="row" sx={{ py: '16px', pl: '24px' }}>
                                                    {<Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{row.nameOfTheFund}</Typography>}
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
                                                            <IconButton size="small" sx={{ color: '#3f4bee', '&:hover': { backgroundColor: '#eff6ff' } }} onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadPreview?access_token=${localStorage.getItem('token')}`)}>
                                                                <FileDownloadIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Download ZIP">
                                                            <IconButton size="small" sx={{ color: '#2cc56c', '&:hover': { backgroundColor: '#f0fdf4' } }} onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadAsZip?access_token=${localStorage.getItem('token')}`)}>
                                                                <FileDownloadIcon fontSize="small" />
>>>>>>> Stashed changes
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <IconButton size="small" sx={{ p: '2px', color: '#476bbc', '&:hover': { backgroundColor: '#f0f4ff' } }} onClick={() => openModel(row)}>
                                                        <EmailListIcon style={{ width: '22px', height: '22px', fill: 'currentColor' }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <IconButton size="small" sx={{ p: '2px', color: '#37c5ab', '&:hover': { backgroundColor: '#f0fdf4' } }} onClick={() => openModelHistory(row)}>
                                                        <HistoryCustomIcon style={{ width: '22px', height: '20px', fill: 'currentColor' }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                        <Tooltip title={`${row.stage === 'PRELIM' ? row.status : 'APPROVED'}`}>
                                                            <IconButton size="small" sx={{ p: '2px', color: '#ffc107', '&:hover': { backgroundColor: '#fffbeb' } }}>
                                                                <SettingCustomIcon style={{ width: '22px', height: '20px', fill: 'currentColor' }} />
                                                            </IconButton>
                                                        </Tooltip>
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
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            p: '25px 24px',
                            gap: 4
                        }}>
                            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <IconButton
                                    onClick={previousPage}
                                    disabled={pageInfo.pageNumber <= 0}
                                    sx={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        p: '8px',
                                        color: '#333'
                                    }}
                                >
                                    <ChevronLeftIcon fontSize="small" />
                                </IconButton>

                                {[1, 2, 3].map((num) => (
                                    <Box
                                        key={num}
                                        onClick={() => goToPage(num - 1)}
                                        sx={{
                                            border: '1px solid',
                                            borderColor: pageInfo.pageNumber === num - 1 ? '#4466c1' : '#e2e8f0',
                                            borderRadius: '4px',
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            fontWeight: pageInfo.pageNumber === num - 1 ? 600 : 400,
                                            color: pageInfo.pageNumber === num - 1 ? '#4466c1' : '#333',
                                            cursor: 'pointer',
                                            backgroundColor: '#fff',
                                            '&:hover': { backgroundColor: '#f8fafc' }
                                        }}
                                    >
                                        {num}
                                    </Box>
                                ))}

                                <Typography sx={{ mx: 1, color: '#64748b' }}>...</Typography>

                                <Box
                                    onClick={() => goToPage(9)}
                                    sx={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        color: '#333',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    10
                                </Box>

                                <IconButton
                                    onClick={nextPage}
                                    disabled={prelimApplications.prelimApplications.length < pageInfo.pageSize}
                                    sx={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        p: '8px',
                                        color: '#333'
                                    }}
                                >
                                    <ChevronRightIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography sx={{ fontSize: '14px', color: '#333' }}>Page</Typography>
                                <Box
                                    component="input"
                                    type="text"
                                    value={jumpPage}
                                    onChange={(e: any) => setJumpPage(e.target.value)}
                                    sx={{
                                        width: '45px',
                                        height: '36px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        outline: 'none',
                                        '&:focus': { borderColor: '#4466c1' }
                                    }}
                                />
                                <Typography
                                    onClick={handleJumpPage}
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                        cursor: 'pointer',
                                        '&:hover': { color: '#FF671F' }
                                    }}
                                >
                                    Go
                                </Typography>
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
            )
            }

        </div >
    )
}

export default Home;
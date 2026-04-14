import '../../index.css';
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Container, FormControl, InputLabel, Typography, Pagination, MenuItem, Breadcrumbs, Link, Chip, Backdrop, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, CircularProgress } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NavigationBar from '../../components/NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect } from "react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { wrapArgument } from '../../lib/api-status/actionWrapper';
import { createPrelimApplicationAsync, createPrelimStarterAsync, getPrelimApplicationList, getPrelimApplicationAllList, IPageInfo, PrelimApplicationState, selectPrelimApplication } from '../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice';
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
import { IUser } from '../admin/IUser';
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
import { fetchMakerUsers, postWorkflowAction, fetchPrelimsInitialAssessmentOnly } from '../fundOverview/subsections/fundOverviewData/fundOverviewDataApi';
import FileUploadService from '../../components/FileUploadService';
import { shouldShowListPaginationFooter } from '../../lib/listPaginationVisibility';

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
    const activeRole = (useAppSelector(state => state.auth.activeRole) || localStorage.getItem('activeRole') || usersState.role || '').toUpperCase();
    const [actionUid] = useState(uuid());
    const [pageInfo, setPageInfo] = useState({ pageNumber: 0, pageSize: 100 } as IPageInfo)
    const [selectedRowHistory, setSelectedRowHistory] = useState(0);
    const [assignMakerOpen, setAssignMakerOpen] = useState(false);
    const [assignMakerRowId, setAssignMakerRowId] = useState<number | null>(null);
    const [selectedMakerUserId, setSelectedMakerUserId] = useState<string>('');
    const [assignMakerRemark, setAssignMakerRemark] = useState<string>('Assigned maker');
    const [assignMakerFile, setAssignMakerFile] = useState<File | null>(null);
    const [managerReassignOpen, setManagerReassignOpen] = useState(false);
    const [managerReassignRowId, setManagerReassignRowId] = useState<number | null>(null);
    const [managerSelectedMakerUserId, setManagerSelectedMakerUserId] = useState<string>('');
    const [managerReassignRemark, setManagerReassignRemark] = useState<string>('Reassigned by manager');
    const [managerReassignMakerOptions, setManagerReassignMakerOptions] = useState<IUser[]>([]);
    const [makerUsers, setMakerUsers] = useState<IUser[]>([]);
    const [memoSubmitOpen, setMemoSubmitOpen] = useState(false);
    const [memoSubmitRowId, setMemoSubmitRowId] = useState<number | null>(null);
    const [memoSubmitRemark, setMemoSubmitRemark] = useState<string>('Memo submitted');
    const [memoFile, setMemoFile] = useState<File | null>(null);
    const [memoError, setMemoError] = useState<string>('');
    const [memoUploading, setMemoUploading] = useState<boolean>(false);
    const [startApplicationConfirmOpen, setStartApplicationConfirmOpen] = useState(false);
    const [searchEmail, setSearchEmail] = useState<string>('');
    const [searchAifName, setSearchAifName] = useState<string>('');
    /** 0 = main workflow list, 1 = prelims with no linked self-rating yet (initial assessment only). */
    const [homeWorkflowTab, setHomeWorkflowTab] = useState(0);
    const [initialAssessmentList, setInitialAssessmentList] = useState<IPrelimApplicationData[]>([]);
    const [initialAssessmentLoading, setInitialAssessmentLoading] = useState(false);
    const navigate = useNavigate()
    const [pageInfoSelect, setPageInfoSelect] = useState(pageInfo.pageSize)
    const totalEntries = prelimApplications.totalEntries || 0;
    const hasActiveRole = (...roles: string[]) =>
        roles.some((role) =>
            activeRole.split(',').map((r) => r.trim().toUpperCase()).includes(role.toUpperCase())
        );

    const handleChange = (event: SelectChangeEvent) => {
        let updatedPageInfo = { ...pageInfo, pageSize: parseInt(event.target.value), pageNumber: 0 }
        setPageInfoSelect(parseInt(event.target.value));
        setPageInfo(updatedPageInfo)
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, updatedPageInfo
        )))
    };

    const showInitialAssessmentTab = hasActiveRole('CHECKER') || hasActiveRole('MANAGER');

    const getFilteredApplications = () => {
        const source =
            homeWorkflowTab === 0
                ? prelimApplications.prelimApplications
                : initialAssessmentList;
        return source?.filter((app) => {
            const emailMatch = (app.createdByName || '').toLowerCase().includes(searchEmail.toLowerCase());
            const aifHaystack = `${app.registrationAifName || ''} ${app.nameOfTheFund || ''}`.toLowerCase();
            const aifNameMatch = aifHaystack.includes(searchAifName.toLowerCase());
            return emailMatch && aifNameMatch;
        }) || [];
    };


    const handleSearchEmailChange = (e: any) => {
        setSearchEmail(e.target.value);
    };

    const handleSearchAifNameChange = (e: any) => {
        setSearchAifName(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchEmail('');
        setSearchAifName('');
    };

    const proceedStartApplication = async () => {
        try {
            let application: IPrelimApplicationData = await dispatch(
                createPrelimStarterAsync(wrapArgument(actionUid, prelimApplicationState.prelimApplication))
            ).unwrap();
            navigate(`/Preliminary/${application.id}/selfRating`)
        } catch (error: any) {
            console.error("Failed to start application:", error);
            alert(error?.message || "An unexpected error occurred while starting the application.");
        }
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

    useEffect(() => {
        console.log("checking homeunauth", CheckAuth.isUnauthorized)
        if (CheckAuth.isUnauthorized) {
            navigate('/login')
        }
        // Fetch total count once on mount
        dispatch(getPrelimApplicationAllList(wrapArgument(actionUid, pageInfo)))
    }, [])

    useEffect(() => {
        const loadMakers = async () => {
            if (!(hasActiveRole('CHECKER') || hasActiveRole('MANAGER'))) return;
            try {
                const response = await fetchMakerUsers();
                setMakerUsers(response.data || []);
            } catch (error) {
                setMakerUsers([]);
            }
        };
        loadMakers();
    }, [activeRole]);

    useEffect(() => {
        if (!showInitialAssessmentTab || homeWorkflowTab !== 1) {
            return;
        }
        let cancelled = false;
        const run = async () => {
            setInitialAssessmentLoading(true);
            try {
                const response = await fetchPrelimsInitialAssessmentOnly();
                if (!cancelled) {
                    setInitialAssessmentList(response.data || []);
                }
            } catch (e: any) {
                if (!cancelled) {
                    setInitialAssessmentList([]);
                    alert(e?.response?.data?.message || e?.message || 'Failed to load initial-assessment list.');
                }
            } finally {
                if (!cancelled) {
                    setInitialAssessmentLoading(false);
                }
            }
        };
        void run();
        return () => {
            cancelled = true;
        };
    }, [showInitialAssessmentTab, homeWorkflowTab]);

    useEffect(() => {
        if (!showInitialAssessmentTab) {
            setHomeWorkflowTab(0);
        }
    }, [showInitialAssessmentTab, activeRole]);

    const openAssignMakerDialog = (row: IPrelimApplicationData) => {
        const rowId = typeof row.id === 'number' ? row.id : Number(row.id);
        const assignedMakerId = row.assignedMakerUserId != null ? String(row.assignedMakerUserId) : '';
        const hasAssignedMakerInOptions = assignedMakerId
            ? makerUsers.some((user) => String(user.id) === assignedMakerId)
            : false;
        setAssignMakerRowId(rowId);
        setSelectedMakerUserId(
            hasAssignedMakerInOptions
                ? assignedMakerId
                : (makerUsers[0]?.id ? String(makerUsers[0].id) : '')
        );
        setAssignMakerRemark('Assigned maker');
        setAssignMakerOpen(true);
    };

    const closeAssignMakerDialog = () => {
        setAssignMakerOpen(false);
        setAssignMakerRowId(null);
        setAssignMakerFile(null);
    };

    const openManagerReassignDialog = (row: IPrelimApplicationData) => {
        const assignedMakerId = row.assignedMakerUserId != null ? Number(row.assignedMakerUserId) : null;
        const filteredMakers = makerUsers.filter((user) => Number(user.id) !== assignedMakerId);
        setManagerReassignMakerOptions(filteredMakers);
        const rowId = typeof row.id === 'number' ? row.id : Number(row.id);
        setManagerReassignRowId(rowId);
        setManagerSelectedMakerUserId(filteredMakers[0]?.id ? String(filteredMakers[0].id) : '');
        setManagerReassignRemark('Reassigned by manager');
        setManagerReassignOpen(true);
    };

    const closeManagerReassignDialog = () => {
        setManagerReassignOpen(false);
        setManagerReassignRowId(null);
        setManagerReassignMakerOptions([]);
    };

    const submitAssignMaker = async () => {
        if (!assignMakerRowId || !selectedMakerUserId) {
            return;
        }
        const trimmedRemark = (assignMakerRemark || '').trim();
        if (!trimmedRemark && !assignMakerFile) {
            alert('Please provide either a comment or upload a document.');
            return;
        }
        let attachmentBucket: string | undefined;
        let attachmentName: string | undefined;
        if (assignMakerFile) {
            const bucket = `workflow-action-${assignMakerRowId}-assign-maker`;
            const uploaded = await FileUploadService.upload(bucket, assignMakerFile, false, () => { });
            attachmentBucket = bucket;
            attachmentName = uploaded?.data?.name || assignMakerFile.name;
        }
        callAndRefresh(
            postWorkflowAction(assignMakerRowId, 'assign-maker', {
                makerUserId: Number(selectedMakerUserId),
                remark: trimmedRemark,
                attachmentBucket,
                attachmentName,
            })
        );
        closeAssignMakerDialog();
    };

    const submitManagerReassign = () => {
        if (!managerReassignRowId || !managerSelectedMakerUserId) {
            return;
        }
        callAndRefresh(
            postWorkflowAction(managerReassignRowId, 'manager-reassign', {
                makerUserId: Number(managerSelectedMakerUserId),
                checkerUserId: null,
                remark: managerReassignRemark || 'Reassigned by manager'
            })
        );
        closeManagerReassignDialog();
    };

    const openMemoSubmitDialog = (rowId: number) => {
        setMemoSubmitRowId(rowId);
        setMemoSubmitRemark('Memo submitted');
        setMemoFile(null);
        setMemoError('');
        setMemoSubmitOpen(true);
    };

    const closeMemoSubmitDialog = () => {
        setMemoSubmitOpen(false);
        setMemoSubmitRowId(null);
        setMemoFile(null);
        setMemoError('');
        setMemoUploading(false);
    };

    const submitMemoWithAttachment = async () => {
        if (!memoSubmitRowId) return;
        if (!memoFile) {
            setMemoError('Please select a memo file (PDF or DOCX).');
            return;
        }
        setMemoUploading(true);
        setMemoError('');
        try {
            const bucket = `memo-${memoSubmitRowId}`;
            // Keep only the latest memo per application to avoid stale downloads.
            const existing = await FileUploadService.list(bucket);
            const existingFiles = existing?.data || [];
            if (existingFiles.length) {
                await Promise.all(existingFiles.map((file: any) => FileUploadService.delete(file)));
            }
            await FileUploadService.upload(bucket, memoFile, false, () => { });
            await callAndRefresh(
                postWorkflowAction(memoSubmitRowId, 'memo-submit', { remark: memoSubmitRemark || 'Memo submitted' })
            );
            closeMemoSubmitDialog();
        } catch (e: any) {
            setMemoError(e?.response?.data?.message || e?.message || 'Failed to upload memo or submit.');
            setMemoUploading(false);
        }
    };

    const downloadMemoForApplication = async (applicationId: number) => {
        try {
            const bucket = `memo-${applicationId}`;
            const response = await FileUploadService.list(bucket);
            const files = response?.data || [];
            if (!files.length) {
                alert('No memo file found for this application.');
                return;
            }
            const sorted = [...files].sort((a: any, b: any) => Number(b.id) - Number(a.id));
            const memoFile = sorted[0];
            window.open(`${memoFile.url}?access_token=${localStorage.getItem('token')}`);
        } catch (e: any) {
            alert(e?.response?.data?.message || e?.message || 'Unable to download memo.');
        }
    };

    const tableHeadersWorkflow = [
        "Fund Name",
        "Contact Person",
        "Status",
        "Start Date",
        "Target Corpus",
        "Contribution",
        "Download",
        "Query",
        "History",
        "Progress",
    ];
    const tableHeadersInitialAssessment = [
        "Fund Name",
        "Contact Person",
        "Status",
        "Self-rating for this application",
        "Application created",
        "Target Corpus",
        "Contribution",
        "Avg score",
        "Query",
        "History",
        "Progress",
    ];
    const tableHeaders = homeWorkflowTab === 1 ? tableHeadersInitialAssessment : tableHeadersWorkflow;
    const tableColumnCount = tableHeaders.length;

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

    const goToPage = (pageNo: number) => {
        let updatedPageInfo = { ...pageInfo, pageNumber: pageNo }
        setPageInfo(updatedPageInfo)
        setPageInfoSelect(pageInfo.pageSize);
        dispatch(getPrelimApplicationList(wrapArgument(
            actionUid, updatedPageInfo
        )))
    }

    const isGoodToShowApplication = (row: IPrelimApplicationData) => {
        let role = activeRole;
        if ((row.status === 'SUBMITTED' || row.status === 'REVIEWED' || row.status === 'APPROVED' || row.status == 'TEMP_CLOSED' || row.status == 'CLOSED') && (role == 'ADMIN' || role == 'CHECKER' || role == 'MANAGER'))
            return true
        if ((row.status === 'CREATED' || row.status === 'REVISE') && role == 'USER')
            return true
        if ((row.status === 'MAKER_ASSIGNED' || row.status === 'REVERTED_TO_MAKER' || row.status === 'MEMO_SUBMITTED' || row.status === 'SANCTIONED') && (role == 'CHECKER' || role == 'MAKER' || role == 'MANAGER'))
            return true
        return false
    }

    const getStatusChip = (row: IPrelimApplicationData) => {
        const status = row.status;
        let color: "success" | "error" | "warning" | "info" | "default" | "primary" | "secondary" = "default";
        let label = String(getStatusDescription(row.stage, status));

        if (status === 'APPROVED' || label === 'Approved') {
            color = "success";
        } else if (status === 'REJECTED' || status === 'CLOSED') {
            color = "error";
        } else if (status === 'SUBMITTED' || status === 'REVIEWED' || status === 'REVISE') {
            color = "warning";
        } else if (status === 'CREATED') {
            color = "primary";
        } else if (status === 'TEMP_CLOSED') {
            color = "default";
        } else {
            color = "default";
        }

        return <Chip label={label} color={color} size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px' }} />;
    }
    const getPath = (status: String | undefined) => {
        if (activeRole == 'ADMIN' || activeRole == 'CHECKER' || activeRole == 'MANAGER') {
            return 'preview'
        }
        let path = (status && ['SUBMITTED', 'REVIEWED', 'APPROVED', 'TEMP_CLOSED', 'CLOSED'].includes(status.toString())) ? 'preview' : 'fund'
        return path;
    }

    const getStatusDescription = (stage: String | undefined, status: String | undefined) => {

        const stageDescription = stage === "PRELIM" ? "Preliminary application" : "Detailed application";

        if (stage !== "PRELIM") {
            if (status === "REVIEWED") return "Pending final approval";
            return "Approved";
        }

        const statusNorm = status == null || String(status).trim() === '' ? '' : String(status).trim().toUpperCase();
        if (statusNorm === '') {
            return "Initial assessment";
        }

        switch (status) {
            case "CREATED":
                return "Pending submission";
            case "SUBMITTED":
                return "Pending review";
            case "REVIEWED":
                return "Pending final approval";
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
            case "MAKER_ASSIGNED":
                return "Maker assigned";
            case "MEMO_SUBMITTED":
                return "Memo submitted";
            case "REVERTED_TO_MAKER":
                return "Reverted to maker";
            case "SANCTIONED":
                return "Sanctioned";
            default:
                return "Invalid Status";
        }

    }

    const callAndRefresh = async (promise: Promise<any>) => {
        try {
            await promise;
            dispatch(getPrelimApplicationList(wrapArgument(actionUid, pageInfo)));
            dispatch(getPrelimApplicationAllList(wrapArgument(actionUid, pageInfo)));
        } catch (e: any) {
            alert(e?.response?.data?.message || e?.message || 'Action failed');
        }
    };

    const workflowActionsForRow = (row: IPrelimApplicationData) => {
        const status = String(row.status || '').toUpperCase();
        if (hasActiveRole('CHECKER') && status === 'SUBMITTED') {
            return (
                <Button size="small" variant="outlined" onClick={() => {
                    if (typeof row.id !== 'number') {
                        alert('Invalid application id.');
                        return;
                    }
                    openAssignMakerDialog(row);
                }}>Assign Maker</Button>
            );
        }
        return <Typography variant="caption" sx={{ color: '#64748b' }}>-</Typography>;
    };

    const showListPaginationFooter = shouldShowListPaginationFooter({
        filteredRowCount: getFilteredApplications().length,
        logicalTotalCount: homeWorkflowTab === 0 ? totalEntries : initialAssessmentList.length,
    });

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
                        {activeRole === "USER" && <Button
                            variant="outlined"
                            sx={{
                                color: '#FF671F',
                                borderColor: '#FF671F',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: '4px',
                                px: 3,
                                '&:hover': {
                                    borderColor: '#FF671F',
                                    color: '#FF671F',
                                    backgroundColor: 'rgba(255, 103, 30, 0.04)'
                                }
                            }}
                            onClick={() => setStartApplicationConfirmOpen(true)}
                        >
                            Start Application
                        </Button>}
                    </Box>
                    {showInitialAssessmentTab && (
                        <Box sx={{ mb: 2 }}>
                            <Tabs
                                value={homeWorkflowTab}
                                onChange={(_, v) => setHomeWorkflowTab(v)}
                                sx={{ minHeight: 42, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
                            >
                                <Tab label="Workflow applications" />
                                <Tab label="Initial assessment only" />
                            </Tabs>
                            {homeWorkflowTab === 1 && (
                                <Typography variant="body2" sx={{ color: '#64748b', mt: 1, maxWidth: 900 }}>
                                    Draft preliminary applications (prelim stage). Each row is a separate application; older applications stay listed after the applicant completes initial assessment on another. Use &quot;Self-rating for this application&quot; to see whether IA is saved against that application id.
                                </Typography>
                            )}
                        </Box>
                    )}
                    {activeRole !== "USER" && (
                    <Paper elevation={0} sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #edf2f7',
                        mb: 2
                    }}>
                        <Box sx={{ p: '20px 24px', borderBottom: '1px solid #edf2f7', backgroundColor: '#f8fafc' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333333', mb: 2 }}>Search Applications</Typography>
                            <Grid container spacing={2} alignItems="flex-end">
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Search by Email ID"
                                        placeholder="Enter email or name"
                                        value={searchEmail}
                                        onChange={handleSearchEmailChange}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: '#ffffff',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Search by AIF Name"
                                        placeholder="Enter fund name"
                                        value={searchAifName}
                                        onChange={handleSearchAifNameChange}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: '#ffffff',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleClearSearch}
                                        sx={{
                                            color: '#666',
                                            borderColor: '#ddd',
                                            '&:hover': {
                                                borderColor: '#999'
                                            }
                                        }}
                                    >
                                        Clear Search
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                    )}
                    <Paper elevation={0} sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #edf2f7'
                    }}>
                        <TableContainer sx={{ p: '0px', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table" stickyHeader>
                                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                    <TableRow>
                                        {headerComponent}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        homeWorkflowTab === 1 && initialAssessmentLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={tableColumnCount} align="center" sx={{ py: 5 }}>
                                                    <CircularProgress size={32} />
                                                </TableCell>
                                            </TableRow>
                                        ) : getFilteredApplications().length > 0 ? getFilteredApplications().map((row, index) => {
                                            const isInitialTab = homeWorkflowTab === 1;
                                            const scoreRaw = row.initialSelfRatingScore;
                                            const scoreDisplay =
                                                scoreRaw != null && String(scoreRaw).trim() !== ''
                                                    ? String(scoreRaw).trim()
                                                    : '';
                                            const targetCorpusDisplay = (() => {
                                                const v = row.sdTotalTargetCorpus as unknown;
                                                if (v == null) return '';
                                                const s = String(v).trim();
                                                if (s === '' || s.toLowerCase() === 'null' || s === 'undefined') {
                                                    return '';
                                                }
                                                return s;
                                            })();
                                            // Fund name: API `registrationAifName` = vcf_users.company_name, then nameOfTheFund.
                                            const fundDisplayName = (String(row.registrationAifName || '').trim()
                                                || String(row.nameOfTheFund || '').trim()
                                                || String(row.createdByName || '').trim()
                                                || '—');
                                            return <TableRow
                                                key={row.id != null ? `prelim-${row.id}` : `prelim-row-${index}`}
                                                sx={{
                                                    '&:hover': { backgroundColor: '#f1f5f9' },
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                            >
                                                {row.stage === "PRELIM" ?
                                                    <TableCell align="left" component="th" scope="row" sx={{ p: '12px 10px' }}>
                                                        {isGoodToShowApplication(row) ?
                                                            <a href={`#/preliminary/${row.id}/${activeRole === "USER" ? 'selfrating' : 'preview'}`}
                                                                style={{ color: '#3f4bee', fontWeight: 600 }}>{fundDisplayName}</a> :
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                                {fundDisplayName}
                                                            </Typography>}
                                                    </TableCell> : <TableCell align="left" component="th" scope="row" sx={{ py: '16px', pl: '24px' }}>
                                                        {<Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{fundDisplayName}</Typography>}
                                                    </TableCell>}
                                                <TableCell align="left" sx={{ color: '#64748b' }}>
                                                    {isInitialTab ? (
                                                        <Link
                                                            href={`#/preliminary/${row.id}/preview`}
                                                            underline="hover"
                                                            sx={{ fontWeight: 600, fontSize: '14px', color: '#3f4bee' }}
                                                        >
                                                            {row.createdByName || 'View preview'}
                                                        </Link>
                                                    ) : (
                                                        row.createdByName
                                                    )}
                                                </TableCell>
                                                <TableCell align="left" sx={{ minWidth: '160px' }}>{getStatusChip(row)}</TableCell>
                                                {isInitialTab && (
                                                    <TableCell align="left" sx={{ minWidth: '140px' }}>
                                                        {row.initialAssessmentLinked === true ? (
                                                            <Chip label="Linked" color="success" size="small" sx={{ fontSize: '0.7rem', fontWeight: 600 }} />
                                                        ) : (
                                                            <Chip label="Not linked" color="warning" variant="outlined" size="small" sx={{ fontSize: '0.7rem', fontWeight: 600 }} />
                                                        )}
                                                    </TableCell>
                                                )}
                                                <TableCell align="left" sx={{ color: '#64748b', width: '20%' }}>
                                                    {isInitialTab
                                                        ? (row.createdOn
                                                            ? Moment(String(row.createdOn)).format('DD MMM YYYY')
                                                            : '-')
                                                        : (row.applicationSubmissionDate
                                                            ? Moment(String(row.applicationSubmissionDate)).format('DD MMM YYYY')
                                                            : '-')}
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 500, color: '#1e293b' }}>{targetCorpusDisplay}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 500, color: '#1e293b' }}>{String(row.contributionSought || 0)}</TableCell>
                                                {!isInitialTab ? (
                                                    <TableCell align="left">
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                            <Tooltip title="Download Preview">
                                                                <IconButton size="small" sx={{ color: '#3f4bee', '&:hover': { backgroundColor: '#eff6ff' } }} onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadPreview?access_token=${localStorage.getItem('token')}`)}>
                                                                    <FileDownloadIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Download ZIP">
                                                                <IconButton size="small" sx={{ color: '#2cc56c', '&:hover': { backgroundColor: '#f0fdf4' } }} onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadAsZip?access_token=${localStorage.getItem('token')}`)}>
                                                                    <FileDownloadIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>{scoreDisplay}</TableCell>
                                                )}
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
                                                        {workflowActionsForRow(row)}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        }) : <TableRow><TableCell colSpan={tableColumnCount} align="center" sx={{ py: 3 }}>No applications found matching your search criteria</TableCell></TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {showListPaginationFooter && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: '25px 24px',
                            gap: 4,
                            flexWrap: 'wrap'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{ fontSize: '14px', color: '#333' }}>Items per page:</Typography>
                                <Select
                                    value={pageInfoSelect.toString()}
                                    onChange={handleChange as any}
                                    size="small"
                                    sx={{ height: '36px', fontSize: '14px', minWidth: '80px' }}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                </Select>
                            </Box>

                            <Typography sx={{ fontSize: '14px', color: '#64748b' }}>
                                Showing {getFilteredApplications().length > 0 ? pageInfo.pageNumber * pageInfo.pageSize + 1 : 0} to {getFilteredApplications().length > 0 ? Math.min((pageInfo.pageNumber + 1) * pageInfo.pageSize, getFilteredApplications().length) : 0} of {getFilteredApplications().length} results
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {Math.ceil(getFilteredApplications().length / pageInfo.pageSize) > 1 && (
                                    <Pagination
                                        count={Math.ceil(getFilteredApplications().length / pageInfo.pageSize)}
                                        page={pageInfo.pageNumber + 1}
                                        onChange={(event, value) => goToPage(value - 1)}
                                        color="primary"
                                        variant="outlined"
                                        shape="rounded"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                borderColor: '#e2e8f0',
                                                color: '#333',
                                                backgroundColor: '#fff',
                                                '&.Mui-selected': {
                                                    borderColor: '#4466c1',
                                                    color: '#4466c1',
                                                    backgroundColor: 'transparent',
                                                    fontWeight: 600
                                                },
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                        )}
                    </Paper>
                    {openQueryModal ? <QueryResolutionModal
                        isActive={openQueryModal}
                        open={() => openModel(selectedRow)}
                        close={closeModel}
                        prelimDetails={selectedRow}
                    ></QueryResolutionModal>
                        : <></>}

                    {openHistoryModal ? <HistoryModal
                        isActive={openHistoryModal}
                        open={() => openModelHistory(selectedRowHistory)}
                        close={closeModelHistory}
                        prelimDetails={selectedRowHistory}
                    ></HistoryModal>
                        : <></>}
                    <Dialog open={assignMakerOpen} onClose={closeAssignMakerDialog} fullWidth maxWidth="sm">
                        <DialogTitle>Assign Maker</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mt: 1 }}>
                                <InputLabel id="assign-maker-user-label">Maker User</InputLabel>
                                <Select
                                    labelId="assign-maker-user-label"
                                    value={selectedMakerUserId}
                                    label="Maker User"
                                    onChange={(e) => setSelectedMakerUserId(e.target.value)}
                                >
                                    {makerUsers.map((user) => (
                                        <MenuItem key={user.id} value={String(user.id)}>
                                            {user.contactPerson || user.username} ({user.username})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                sx={{ mt: 2 }}
                                label="Remark"
                                value={assignMakerRemark}
                                onChange={(e) => setAssignMakerRemark(e.target.value)}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" component="label">
                                    Upload supporting document
                                    <input
                                        type="file"
                                        hidden
                                        onChange={(e) => setAssignMakerFile(e.target.files?.[0] || null)}
                                    />
                                </Button>
                                <Typography sx={{ mt: 1, fontSize: '13px', color: '#64748b' }}>
                                    {assignMakerFile ? assignMakerFile.name : 'Optional. Either remark or document is mandatory.'}
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeAssignMakerDialog}>Cancel</Button>
                            <Button onClick={submitAssignMaker} variant="contained" disabled={!selectedMakerUserId}>
                                Assign
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={memoSubmitOpen} onClose={closeMemoSubmitDialog} fullWidth maxWidth="sm">
                        <DialogTitle>Submit Memo</DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                sx={{ mt: 1 }}
                                label="Remark"
                                value={memoSubmitRemark}
                                onChange={(e) => setMemoSubmitRemark(e.target.value)}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" component="label">
                                    Choose Memo File (PDF/DOCX)
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setMemoFile(file);
                                            setMemoError('');
                                        }}
                                    />
                                </Button>
                                <Typography sx={{ mt: 1, fontSize: '13px', color: '#64748b' }}>
                                    {memoFile ? memoFile.name : 'No file selected'}
                                </Typography>
                                {memoError && (
                                    <Typography sx={{ mt: 1, fontSize: '12px', color: '#d32f2f' }}>
                                        {memoError}
                                    </Typography>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeMemoSubmitDialog} disabled={memoUploading}>Cancel</Button>
                            <Button
                                onClick={submitMemoWithAttachment}
                                variant="contained"
                                disabled={memoUploading || !memoFile}
                            >
                                {memoUploading ? 'Submitting...' : 'Submit Memo'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={managerReassignOpen} onClose={closeManagerReassignDialog} fullWidth maxWidth="sm">
                        <DialogTitle>Reassign Maker</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mt: 1 }}>
                                <InputLabel id="manager-reassign-maker-user-label">Maker User</InputLabel>
                                <Select
                                    labelId="manager-reassign-maker-user-label"
                                    value={managerSelectedMakerUserId}
                                    label="Maker User"
                                    onChange={(e) => setManagerSelectedMakerUserId(e.target.value)}
                                >
                                    {managerReassignMakerOptions.map((user) => (
                                        <MenuItem key={user.id} value={String(user.id)}>
                                            {user.contactPerson || user.username} ({user.username})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                sx={{ mt: 2 }}
                                label="Remark"
                                value={managerReassignRemark}
                                onChange={(e) => setManagerReassignRemark(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeManagerReassignDialog}>Cancel</Button>
                            <Button onClick={submitManagerReassign} variant="contained" disabled={!managerSelectedMakerUserId}>
                                Reassign
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={startApplicationConfirmOpen} onClose={() => setStartApplicationConfirmOpen(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Confirm Start Application</DialogTitle>
                        <DialogContent>
                            <Typography sx={{ mt: 1 }}>
                            Kindly check the FAQs and review the eligibility criteria provided on the website prior to initiating the application.
                            </Typography>
                            <Link
                                href={
                                    process.env.REACT_APP_ELIGIBILITY_CRITERIA_URL?.trim() ||
                                    `${window.location.origin}${window.location.pathname}${window.location.search}#/eligibilityQuestioner`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setStartApplicationConfirmOpen(false)}
                                sx={{
                                    mt: 1.5,
                                    display: 'inline-block',
                                    fontWeight: 600,
                                    color: '#FF671F',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Review eligibility criteria
                            </Link>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setStartApplicationConfirmOpen(false)}>Cancel</Button>
                            <Button
                                variant="contained"
                                onClick={async () => {
                                    setStartApplicationConfirmOpen(false);
                                    await proceedStartApplication();
                                }}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                    backgroundColor: '#FF671F',
                                    '&:hover': {
                                        border: '1px solid #FF671F',
                                        color: '#FF671F',
                                        backgroundColor: 'rgb(255 103 30 / 19%)'
                                    }
                                }}
                            >
                                Continue
                            </Button>
                        </DialogActions>
                    </Dialog>
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
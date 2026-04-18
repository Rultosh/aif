import '../../index.css';
import { Alert, Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, Container, FormControl, InputLabel, Typography, Pagination, MenuItem, Breadcrumbs, Link, Chip, Backdrop, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Card, CardContent, Snackbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NavigationBar from '../../components/NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect, useMemo } from "react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { wrapArgument } from '../../lib/api-status/actionWrapper';
import { createPrelimApplicationAsync, createPrelimStarterAsync, getPrelimApplicationList, IPageInfo, PrelimApplicationState, selectPrelimApplication } from '../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice';
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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { fetchMakerUsers, fetchCheckerUsers, fetchManagerUsers, fetchPensionFundUsers, postWorkflowAction } from '../fundOverview/subsections/fundOverviewData/fundOverviewDataApi';
import FileUploadService from '../../components/FileUploadService';
import { shouldShowListPaginationFooter } from '../../lib/listPaginationVisibility';
import { computeCompositeQueueScore, experiencedImAmcTableLabel } from '../../lib/queueCompositeScore';
import { opaqueInfoToastAlertSx } from '../../lib/ui/opaqueInfoToastAlertSx';

/** Checker workflow list: exactly these five sections (no "All"). */
const CHECKER_WORKFLOW_TAB_IDS = [
    'pendingAssignment',
    'assignedToMaker',
    'withChecker',
    'withScreeningCommittee',
    'failedApplication',
] as const;

type CheckerWorkflowTabId = (typeof CHECKER_WORKFLOW_TAB_IDS)[number];

const CHECKER_TAB_LABELS: Record<CheckerWorkflowTabId, string> = {
    pendingAssignment: 'Application Pending Assignment',
    assignedToMaker: 'Assigned to Maker',
    withChecker: 'With Checker',
    withScreeningCommittee: 'With Screening Committee',
    failedApplication: 'Failed Application',
};

const MAKER_WORKFLOW_TAB_IDS = ['withMaker', 'withApplicant'] as const;
type MakerWorkflowTabId = (typeof MAKER_WORKFLOW_TAB_IDS)[number];

const MAKER_TAB_LABELS: Record<MakerWorkflowTabId, string> = {
    withMaker: 'With Maker',
    withApplicant: 'With Applicant',
};

/** PRELIM draft with IA completed: enriched average below 5 (aligned with self-rating submit rule). */
function isCheckerFailedIaOnlyDraft(row: IPrelimApplicationData | undefined, statusUpper: string): boolean {
    if (!row) return false;
    const draftLike = !statusUpper || statusUpper === 'CREATED' || statusUpper === 'REVISE';
    if (!draftLike) return false;
    const st = String(row.stage || '').trim().toUpperCase();
    if (st && st !== 'PRELIM') return false;
    const raw = row.initialSelfRatingScore;
    if (raw == null || String(raw).trim() === '') return false;
    const avg = parseFloat(String(raw).replace(/,/g, ''));
    return Number.isFinite(avg) && avg < 5;
}

/** Maps prelim status (and draft IA outcome) to exactly one checker list tab. */
function checkerWorkflowTabForStatus(statusRaw: string | undefined, row?: IPrelimApplicationData): CheckerWorkflowTabId {
    const status = String(statusRaw || '').trim().toUpperCase();
    if (status === 'SUBMITTED') return 'pendingAssignment';
    if (status === 'MAKER_ASSIGNED' || status === 'REVERTED_TO_MAKER') return 'assignedToMaker';
    if (status === 'MEMO_SUBMITTED') return 'withChecker';
    if (
        [
            'CHECKER_FORWARDED_TO_MANAGER',
            'MANAGER_FORWARDED_TO_PF',
            'APPROVED_BY_PF',
            'SANCTIONED',
            'REVIEWED',
            'APPROVED',
        ].includes(status)
    ) {
        return 'withScreeningCommittee';
    }
    if (['REJECTED_BY_PF', 'REJECTED', 'CLOSED', 'TEMP_CLOSED'].includes(status)) {
        return 'failedApplication';
    }
    if (isCheckerFailedIaOnlyDraft(row, status)) {
        return 'failedApplication';
    }
    return 'pendingAssignment';
}

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
    const [assigneeEmailsById, setAssigneeEmailsById] = useState<Record<number, string>>({});
    const [memoSubmitOpen, setMemoSubmitOpen] = useState(false);
    const [memoSubmitRowId, setMemoSubmitRowId] = useState<number | null>(null);
    const [memoSubmitRemark, setMemoSubmitRemark] = useState<string>('Memo submitted');
    const [memoFile, setMemoFile] = useState<File | null>(null);
    const [memoError, setMemoError] = useState<string>('');
    const [memoUploading, setMemoUploading] = useState<boolean>(false);
    const [contactDetailsRow, setContactDetailsRow] = useState<IPrelimApplicationData | null>(null);
    const [startApplicationConfirmOpen, setStartApplicationConfirmOpen] = useState(false);
    const [searchAifName, setSearchAifName] = useState<string>('');
    const [searchFundType, setSearchFundType] = useState<string>('');
    const [startApplicationToast, setStartApplicationToast] = useState<string | null>(null);
    const [workflowSectionTab, setWorkflowSectionTab] = useState<string>('all');
    const navigate = useNavigate()
    const [pageInfoSelect, setPageInfoSelect] = useState(pageInfo.pageSize)
    const totalEntries = prelimApplications.totalEntries || 0;
    const listQuery = useMemo((): IPageInfo => ({
        ...pageInfo,
        searchAifName: searchAifName.trim() || undefined,
        fundType: searchFundType.trim() || undefined,
    }), [pageInfo, searchAifName, searchFundType]);
    const hasActiveRole = (...roles: string[]) =>
        roles.some((role) =>
            activeRole.split(',').map((r) => r.trim().toUpperCase()).includes(role.toUpperCase())
        );

    const handleChange = (event: SelectChangeEvent) => {
        let updatedPageInfo = { ...pageInfo, pageSize: parseInt(event.target.value), pageNumber: 0 }
        setPageInfoSelect(parseInt(event.target.value));
        setPageInfo(updatedPageInfo);
    };

    const isApplicantUser = activeRole === 'USER';

    /** Maps AIF Category Type (fund form) to table Fund Type: Equity / Debt. */
    const getFundTypeTableLabel = (row: IPrelimApplicationData) => {
        const raw = String(row.aifCategoryType || '').trim();
        if (!raw) return '—';
        const equityTypes = ['Equity Oriented AIF', 'Equity Oriented Fund'];
        const debtTypes = ['Debt Oriented AIF', 'Debt Oriented Fund'];
        if (equityTypes.includes(raw)) return 'Equity';
        if (debtTypes.includes(raw)) return 'Debt';
        const lower = raw.toLowerCase();
        if (lower.includes('equity')) return 'Equity';
        if (lower.includes('debt')) return 'Debt';
        return '—';
    };

    const getFilteredApplications = () => {
        const source = prelimApplications.prelimApplications;
        const normalizedRole = String(activeRole || '').toUpperCase();
        const isPfUser = normalizedRole === 'PENSION_FUND'
            && (prelimApplications.prelimApplications || []).some(
                (r) => Number(r.assignedPfUserId || 0) === Number(usersState.me?.id || 0)
            );
        const filtered = source?.filter((app) => {
            const status = String(app.status || '').toUpperCase();
            let sectionMatch = true;
            if (normalizedRole === 'CHECKER') {
                const checkerTab = (CHECKER_WORKFLOW_TAB_IDS as readonly string[]).includes(workflowSectionTab)
                    ? workflowSectionTab
                    : 'pendingAssignment';
                sectionMatch = checkerWorkflowTabForStatus(status, app) === checkerTab;
            } else if (normalizedRole === 'MAKER') {
                const makerTab: MakerWorkflowTabId = (MAKER_WORKFLOW_TAB_IDS as readonly string[]).includes(workflowSectionTab)
                    ? workflowSectionTab as MakerWorkflowTabId
                    : 'withMaker';
                if (makerTab === 'withMaker') {
                    sectionMatch = status === 'MAKER_ASSIGNED' || status === 'REVERTED_TO_MAKER';
                } else {
                    sectionMatch = status === 'REVISE';
                }
            } else if (workflowSectionTab !== 'all') {
                if (normalizedRole === 'MANAGER') {
                    if (workflowSectionTab === 'forwardedSc') sectionMatch = (status === 'CHECKER_FORWARDED_TO_MANAGER' || status === 'REVERTED_TO_MANAGER');
                    else if (workflowSectionTab === 'approvedPf') sectionMatch = status === 'APPROVED_BY_PF';
                    else if (workflowSectionTab === 'rejectedPf') sectionMatch = status === 'REJECTED_BY_PF';
                    else if (workflowSectionTab === 'sanctioned') sectionMatch = status === 'SANCTIONED';
                } else if (isPfUser) {
                    if (workflowSectionTab === 'forwardedPf') sectionMatch = status === 'MANAGER_FORWARDED_TO_PF';
                    else if (workflowSectionTab === 'approvedPf') sectionMatch = status === 'APPROVED_BY_PF';
                    else if (workflowSectionTab === 'rejectedPf') sectionMatch = status === 'REJECTED_BY_PF';
                    sectionMatch = sectionMatch && Number(app.assignedPfUserId || 0) === Number(usersState.me?.id || 0);
                } else if (normalizedRole === 'USER') {
                    if (workflowSectionTab === 'created') sectionMatch = status === 'CREATED';
                    else if (workflowSectionTab === 'submitted') sectionMatch = status === 'SUBMITTED';
                    else if (workflowSectionTab === 'reverted') sectionMatch = status === 'REVISE';
                    else if (workflowSectionTab === 'sanctioned') sectionMatch = status === 'SANCTIONED';
                }
            }
            return sectionMatch;
        }) || [];
        return filtered;
    };

    const getWorkflowSections = () => {
        const rows = prelimApplications.prelimApplications || [];
        const normalizedRole = String(activeRole || '').toUpperCase();
        const pfRows = rows.filter((r) => Number(r.assignedPfUserId || 0) === Number(usersState.me?.id || 0));
        const isPfUser = normalizedRole === 'PENSION_FUND' && pfRows.length > 0;
        const base = [{ id: 'all', label: 'All', count: rows.length }];
        if (normalizedRole === 'MAKER') {
            const withMaker = rows.filter((r) => ['MAKER_ASSIGNED', 'REVERTED_TO_MAKER'].includes(String(r.status || '').toUpperCase())).length;
            const withApplicant = rows.filter((r) => String(r.status || '').toUpperCase() === 'REVISE').length;
            return MAKER_WORKFLOW_TAB_IDS.map((id) => ({
                id,
                label: MAKER_TAB_LABELS[id],
                count: id === 'withMaker' ? withMaker : withApplicant,
            }));
        }
        if (normalizedRole === 'CHECKER') {
            return CHECKER_WORKFLOW_TAB_IDS.map((id) => ({
                id,
                label: CHECKER_TAB_LABELS[id],
                count: rows.filter((r) => checkerWorkflowTabForStatus(String(r.status), r) === id).length,
            }));
        }
        if (normalizedRole === 'MANAGER') {
            const forwardedSc = rows.filter((r) => ['CHECKER_FORWARDED_TO_MANAGER', 'REVERTED_TO_MANAGER'].includes(String(r.status || '').toUpperCase())).length;
            const approvedPf = rows.filter((r) => String(r.status || '').toUpperCase() === 'APPROVED_BY_PF').length;
            const rejectedPf = rows.filter((r) => String(r.status || '').toUpperCase() === 'REJECTED_BY_PF').length;
            const sanctioned = rows.filter((r) => String(r.status || '').toUpperCase() === 'SANCTIONED').length;
            const sections: any[] = [...base];
            if (forwardedSc > 0) sections.push({ id: 'forwardedSc', label: 'With Screening Committee', count: forwardedSc });
            if (approvedPf > 0) sections.push({ id: 'approvedPf', label: 'Approved by PF', count: approvedPf });
            if (rejectedPf > 0) sections.push({ id: 'rejectedPf', label: 'Rejected by PF', count: rejectedPf });
            if (sanctioned > 0) sections.push({ id: 'sanctioned', label: 'Sanctioned', count: sanctioned });
            return sections;
        }
        if (isPfUser) {
            const forwardedPf = pfRows.filter((r) => String(r.status || '').toUpperCase() === 'MANAGER_FORWARDED_TO_PF').length;
            const approvedPf = pfRows.filter((r) => String(r.status || '').toUpperCase() === 'APPROVED_BY_PF').length;
            const rejectedPf = pfRows.filter((r) => String(r.status || '').toUpperCase() === 'REJECTED_BY_PF').length;
            const sections: any[] = [{ id: 'all', label: 'All', count: pfRows.length }];
            if (forwardedPf > 0) sections.push({ id: 'forwardedPf', label: 'Forwarded to PF', count: forwardedPf });
            if (approvedPf > 0) sections.push({ id: 'approvedPf', label: 'Approved by PF', count: approvedPf });
            if (rejectedPf > 0) sections.push({ id: 'rejectedPf', label: 'Rejected by PF', count: rejectedPf });
            return sections;
        }
        if (normalizedRole === 'USER') {
            const created = rows.filter((r) => String(r.status || '').toUpperCase() === 'CREATED').length;
            const submitted = rows.filter((r) => String(r.status || '').toUpperCase() === 'SUBMITTED').length;
            const reverted = rows.filter((r) => String(r.status || '').toUpperCase() === 'REVISE').length;
            const sanctioned = rows.filter((r) => String(r.status || '').toUpperCase() === 'SANCTIONED').length;
            const sections: any[] = [...base];
            if (created > 0) sections.push({ id: 'created', label: 'Created', count: created });
            if (submitted > 0) sections.push({ id: 'submitted', label: 'Submitted (Read only)', count: submitted });
            if (reverted > 0) sections.push({ id: 'reverted', label: 'Reverted', count: reverted });
            if (sanctioned > 0) sections.push({ id: 'sanctioned', label: 'Sanctioned (Read only)', count: sanctioned });
            return sections;
        }
        return base;
    };


    const handleSearchAifNameChange = (e: any) => {
        setSearchAifName(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchAifName('');
        setSearchFundType('');
        setPageInfo((prev) => ({ ...prev, pageNumber: 0, sortBy: undefined, sortDir: 'asc' }));
    };

    const getStartApplicationErrorText = (error: unknown): string => {
        if (typeof error === 'string') {
            return error;
        }
        const e = error as { message?: string; response?: { data?: { message?: string } | string } };
        if (e?.message && typeof e.message === 'string') {
            return e.message;
        }
        const data = e?.response?.data;
        if (typeof data === 'string') {
            return data;
        }
        if (data && typeof data === 'object' && typeof (data as { message?: string }).message === 'string') {
            return (data as { message: string }).message;
        }
        return 'An unexpected error occurred while starting the application.';
    };

    const proceedStartApplication = async () => {
        try {
            let application: IPrelimApplicationData = await dispatch(
                createPrelimStarterAsync(wrapArgument(actionUid, prelimApplicationState.prelimApplication))
            ).unwrap();
            navigate(`/Preliminary/${application.id}/selfRating`)
        } catch (error: unknown) {
            console.error("Failed to start application:", error);
            setStartApplicationToast(getStartApplicationErrorText(error));
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
        dispatch(getPrelimApplicationList(wrapArgument(actionUid, listQuery)));
    }, [dispatch, actionUid, listQuery, prelimApplications.prelimApplication]);

    useEffect(() => {
        if (CheckAuth.isUnauthorized) {
            navigate('/login');
        }
    }, [navigate])

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
        const loadAssigneeEmails = async () => {
            try {
                const [makersRes, checkersRes, managersRes, pfUsersRes] = await Promise.all([
                    fetchMakerUsers(),
                    fetchCheckerUsers(),
                    fetchManagerUsers(),
                    fetchPensionFundUsers(),
                ]);
                const allUsers: IUser[] = [
                    ...(makersRes?.data || []),
                    ...(checkersRes?.data || []),
                    ...(managersRes?.data || []),
                    ...(pfUsersRes?.data || []),
                ];
                const mergedMap = allUsers.reduce((acc, user) => {
                    const id = Number(user.id || 0);
                    const username = String(user.username || '').trim();
                    if (id > 0 && username) {
                        acc[id] = username;
                    }
                    return acc;
                }, {} as Record<number, string>);
                setAssigneeEmailsById(mergedMap);
            } catch {
                setAssigneeEmailsById({});
            }
        };
        void loadAssigneeEmails();
    }, []);

    useEffect(() => {
        const isChecker = activeRole.split(',').map((r) => r.trim().toUpperCase()).includes('CHECKER');
        if (isChecker) {
            setWorkflowSectionTab('pendingAssignment');
        } else {
            setWorkflowSectionTab('all');
        }
    }, [activeRole]);

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
        "AIF Name",
        "Contact Person",
        "Status",
        "Pending With",
        "Start Date",
        "Target Corpus",
        "Fund Type",
        "Fund Manager Experience",
        "IA Score",
        "Total Score",
        "Download",
        "Query",
        "History",
    ];
    const tableHeadersWorkflowApplicant = [
        "AIF Name",
        "Contact Person",
        "Status",
        "Start Date",
        "Target Corpus",
        "Fund Type",
        "Fund Manager Experience",
        "Download",
        "Query",
    ];
    const tableHeaders = isApplicantUser ? tableHeadersWorkflowApplicant : tableHeadersWorkflow;
    const tableColumnCount = tableHeaders.length;

    const SORTABLE_HEADER_KEYS: Record<string, string> = isApplicantUser
        ? { 'Target Corpus': 'TARGET_CORPUS' }
        : { 'Target Corpus': 'TARGET_CORPUS', 'IA Score': 'IA_SCORE', 'Total Score': 'TOTAL_SCORE' };

    const requestListSort = (apiSortKey: string) => {
        const nextDir: 'asc' | 'desc' =
            pageInfo.sortBy === apiSortKey && pageInfo.sortDir === 'asc' ? 'desc' : 'asc';
        setPageInfo((prev) => ({
            ...prev,
            pageNumber: 0,
            sortBy: apiSortKey,
            sortDir: nextDir,
        }));
    };

    const headerComponent = tableHeaders.map((label, i) => {
        const sortKey = SORTABLE_HEADER_KEYS[label];
        const isDownloadCol = label === 'Download';
        return (
            <TableCell
                key={`${label}-${i}`}
                align={isDownloadCol ? 'center' : 'left'}
                sx={{ fontWeight: '600', color: '#1a1a1a', p: '12px 10px', fontSize: '13px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#e9e9f6' }}
            >
                {sortKey ? (
                    <TableSortLabel
                        active={pageInfo.sortBy === sortKey}
                        direction={pageInfo.sortBy === sortKey ? (pageInfo.sortDir || 'asc') : 'asc'}
                        onClick={() => requestListSort(sortKey)}
                        hideSortIcon={pageInfo.sortBy !== sortKey}
                        sx={{ '&.MuiTableSortLabel-root': { fontWeight: 600, color: '#1a1a1a' } }}
                    >
                        {label}
                    </TableSortLabel>
                ) : (
                    label
                )}
            </TableCell>
        );
    });

    const goToPage = (pageNo: number) => {
        const updatedPageInfo = { ...pageInfo, pageNumber: pageNo };
        setPageInfo(updatedPageInfo);
        setPageInfoSelect(updatedPageInfo.pageSize);
    }

    const isGoodToShowApplication = (row: IPrelimApplicationData) => {
        const statusUpper = String(row.status ?? '').trim().toUpperCase();
        if (hasActiveRole('CHECKER')) {
            if (isCheckerFailedIaOnlyDraft(row, statusUpper)) return true;
            if (['REJECTED', 'REJECTED_BY_PF', 'CLOSED', 'TEMP_CLOSED'].includes(statusUpper)) return true;
        }
        if ((row.status === 'SUBMITTED' || row.status === 'REVIEWED' || row.status === 'APPROVED' || row.status == 'TEMP_CLOSED' || row.status == 'CLOSED') && hasActiveRole('ADMIN', 'USERADMIN', 'CHECKER', 'MANAGER'))
            return true
        if ((row.status === 'CREATED' || row.status === 'REVISE') && hasActiveRole('USER'))
            return true
        if (row.status === 'SANCTIONED' && hasActiveRole('USER'))
            return true
        if ((row.status === 'MAKER_ASSIGNED'
            || row.status === 'REVERTED_TO_MAKER'
            || row.status === 'REVERTED_TO_MANAGER'
            || row.status === 'MEMO_SUBMITTED'
            || row.status === 'CHECKER_FORWARDED_TO_MANAGER'
            || row.status === 'MANAGER_FORWARDED_TO_PF'
            || row.status === 'APPROVED_BY_PF'
            || row.status === 'REJECTED_BY_PF'
            || row.status === 'SANCTIONED')
            && hasActiveRole('CHECKER', 'MAKER', 'MANAGER'))
            return true
        if ((row.status === 'MANAGER_FORWARDED_TO_PF' || row.status === 'APPROVED_BY_PF' || row.status === 'REJECTED_BY_PF')
            && hasActiveRole('PENSION_FUND')
            && Number(row.assignedPfUserId || 0) === Number(usersState.me?.id || 0))
            return true
        return false
    }

    /** High-level labels only; hides maker/checker/manager/PF workflow detail. */
    const getApplicantFacingStatusLabel = (stage: String | undefined, status: String | undefined): string => {
        if (stage !== 'PRELIM') {
            if (status === 'REVIEWED') return 'Pending final approval';
            return 'Approved';
        }
        const statusNorm = status == null || String(status).trim() === '' ? '' : String(status).trim().toUpperCase();
        if (statusNorm === '') return 'Initial assessment';
        if (statusNorm === 'CREATED') return 'Pending submission';
        if (statusNorm === 'REVISE' || statusNorm === 'REVERTED_TO_APPLICANT') return 'Pending revision';
        if (statusNorm === 'SANCTIONED') return 'Sanctioned';
        if (statusNorm === 'REJECTED_BY_PF') return 'Not approved';
        if (statusNorm === 'APPROVED') return 'Approved';
        if (statusNorm === 'REJECTED') return 'Rejected';
        if (statusNorm === 'TEMP_CLOSED') return 'Temporarily closed';
        if (statusNorm === 'CLOSED') return 'Closed';
        const underReview = new Set([
            'SUBMITTED', 'MAKER_ASSIGNED', 'REVERTED_TO_MAKER', 'MEMO_SUBMITTED', 'REVIEWED',
            'CHECKER_FORWARDED_TO_MANAGER', 'REVERTED_TO_MANAGER', 'MANAGER_FORWARDED_TO_PF', 'APPROVED_BY_PF',
        ]);
        if (underReview.has(statusNorm)) return 'Under review';
        return 'Under review';
    };

    const getStatusChip = (row: IPrelimApplicationData) => {
        const status = row.status;
        const statusUpper = String(status ?? '').toUpperCase();
        let color: "success" | "error" | "warning" | "info" | "default" | "primary" | "secondary" = "default";
        const label = isApplicantUser
            ? getApplicantFacingStatusLabel(row.stage, status)
            : String(getStatusDescription(row.stage, status));

        if (isApplicantUser) {
            if (statusUpper === 'APPROVED' || label === 'Approved') color = 'success';
            else if (statusUpper === 'SANCTIONED') color = 'success';
            else if (['REJECTED', 'CLOSED', 'REJECTED_BY_PF'].includes(statusUpper)) color = 'error';
            else if (statusUpper === 'REVISE' || statusUpper === 'REVERTED_TO_APPLICANT') color = 'warning';
            else if (statusUpper === 'CREATED') color = 'primary';
            else if (label === 'Under review' || statusUpper === 'TEMP_CLOSED') color = 'warning';
            else color = 'default';
        } else if (status === 'APPROVED' || label === 'Approved') {
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
        if (hasActiveRole('ADMIN', 'USERADMIN', 'CHECKER', 'MANAGER')) {
            return 'preview'
        }
        let path = (status && ['SUBMITTED', 'REVIEWED', 'APPROVED', 'TEMP_CLOSED', 'CLOSED', 'MANAGER_FORWARDED_TO_PF', 'APPROVED_BY_PF', 'REJECTED_BY_PF', 'SANCTIONED'].includes(status.toString())) ? 'preview' : 'fund'
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
            case "REVERTED_TO_MANAGER":
                return "Reverted to assignee";
            case "CHECKER_FORWARDED_TO_MANAGER":
                return "With Screening Committee";
            case "MANAGER_FORWARDED_TO_PF":
                return "Forwarded to PF";
            case "APPROVED_BY_PF":
                return "Approved by PF";
            case "REJECTED_BY_PF":
                return "Rejected by PF";
            default:
                return "Invalid Status";
        }

    }

    const callAndRefresh = async (promise: Promise<any>) => {
        try {
            await promise;
            dispatch(getPrelimApplicationList(wrapArgument(actionUid, listQuery)));
        } catch (e: any) {
            alert(e?.response?.data?.message || e?.message || 'Action failed');
        }
    };

    const getUserEmailById = (userId?: Number) => {
        if (userId == null) return '';
        const fromAssigneeMap = assigneeEmailsById[Number(userId || 0)];
        if (fromAssigneeMap) {
            return fromAssigneeMap;
        }
        const matchedUser = (usersState.users || []).find((user) => Number(user.id || 0) === Number(userId || 0));
        return String(matchedUser?.username || '').trim();
    };

    const getPendingWithEmail = (row: IPrelimApplicationData) => {
        const backendPendingWith = String(row.pendingWithEmail || '').trim();
        if (backendPendingWith) {
            return backendPendingWith;
        }
        const status = String(row.status || '').toUpperCase();
        const applicantEmail = getUserEmailById(row.createdBy) || String(row.createdByName || '').trim();
        const makerEmail = getUserEmailById(row.assignedMakerUserId);
        const checkerEmail = getUserEmailById(row.assignedCheckerUserId);
        const managerEmail = getUserEmailById(row.assignedManagerUserId);
        const pfEmail = getUserEmailById(row.assignedPfUserId);

        if (status === 'CREATED' || status === 'REVISE' || status === 'REVERTED_TO_APPLICANT') {
            return applicantEmail || '-';
        }
        if (status === 'SUBMITTED' || status === 'MEMO_SUBMITTED') {
            return checkerEmail || '-';
        }
        if (status === 'MAKER_ASSIGNED' || status === 'REVERTED_TO_MAKER') {
            return makerEmail || '-';
        }
        if (status === 'CHECKER_FORWARDED_TO_MANAGER' || status === 'REVERTED_TO_MANAGER') {
            return managerEmail || '-';
        }
        if (status === 'MANAGER_FORWARDED_TO_PF') {
            return pfEmail || '-';
        }
        if (status === 'APPROVED_BY_PF' || status === 'REJECTED_BY_PF') {
            return managerEmail || '-';
        }
        if (status === 'SANCTIONED') {
            return applicantEmail || '-';
        }
        return '-';
    };

    const getAifDisplayNameForContactCard = (row: IPrelimApplicationData) =>
        String(row.registrationAifName || '').trim()
        || String(row.nameOfTheFund || '').trim()
        || String(row.createdByName || '').trim()
        || '—';

    const showListPaginationFooter = shouldShowListPaginationFooter({
        filteredRowCount: getFilteredApplications().length,
        logicalTotalCount: totalEntries,
    });

    const workflowTabsSelection =
        hasActiveRole('CHECKER')
            ? (CHECKER_WORKFLOW_TAB_IDS as readonly string[]).includes(workflowSectionTab)
                ? workflowSectionTab
                : 'pendingAssignment'
            : hasActiveRole('MAKER')
                ? (MAKER_WORKFLOW_TAB_IDS as readonly string[]).includes(workflowSectionTab)
                    ? workflowSectionTab
                    : 'withMaker'
                : workflowSectionTab;

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
                    {!isApplicantUser && (
                        <Box sx={{ mb: 2 }}>
                            <Tabs
                                value={workflowTabsSelection}
                                onChange={(_, v) => setWorkflowSectionTab(v)}
                                variant="scrollable"
                                allowScrollButtonsMobile
                                sx={{ minHeight: 36, '& .MuiTab-root': { textTransform: 'none', minHeight: 36, fontWeight: 600 } }}
                            >
                                {getWorkflowSections().map((section: any) => (
                                    <Tab key={section.id} value={section.id} label={`${section.label} (${section.count})`} />
                                ))}
                            </Tabs>
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
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="search-fund-type-label">Fund Type</InputLabel>
                                        <Select
                                            labelId="search-fund-type-label"
                                            label="Fund Type"
                                            value={searchFundType}
                                            onChange={(e) => setSearchFundType(String(e.target.value))}
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="Equity">Equity</MenuItem>
                                            <MenuItem value="Debt">Debt</MenuItem>
                                        </Select>
                                    </FormControl>
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
                                        getFilteredApplications().length > 0 ? getFilteredApplications().map((row, index) => {
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
                                                            <a href={`#/preliminary/${row.id}/${getPath(row.status)}`}
                                                                style={{ color: '#3f4bee', fontWeight: 600 }}>{fundDisplayName}</a> :
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                                {fundDisplayName}
                                                            </Typography>}
                                                    </TableCell> : <TableCell align="left" component="th" scope="row" sx={{ py: '16px', pl: '24px' }}>
                                                        {<Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{fundDisplayName}</Typography>}
                                                    </TableCell>}
                                                <TableCell align="center" sx={{ color: '#64748b' }}>
                                                    <Tooltip title="AIF & contact details">
                                                        <IconButton
                                                            size="small"
                                                            aria-label="Show AIF and contact person details"
                                                            onClick={() => setContactDetailsRow(row)}
                                                            sx={{
                                                                color: '#64748b',
                                                                '&:hover': { backgroundColor: '#f1f5f9', color: '#3f4bee' },
                                                            }}
                                                        >
                                                            <PersonOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="left" sx={{ minWidth: '160px' }}>{getStatusChip(row)}</TableCell>
                                                {!isApplicantUser && (
                                                <TableCell align="left" sx={{ color: '#1e293b' }}>
                                                    {getPendingWithEmail(row)}
                                                </TableCell>
                                                )}
                                                <TableCell align="left" sx={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                                                    {row.applicationSubmissionDate
                                                        ? Moment(String(row.applicationSubmissionDate)).format('DD MMM YYYY')
                                                        : '-'}
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 500, color: '#1e293b' }}>{targetCorpusDisplay}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                    {getFundTypeTableLabel(row)}
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    sx={{ fontWeight: 500, color: '#1e293b' }}
                                                    title="Experienced IM/AMC? (Yes = experienced, No = first-time)"
                                                >
                                                    {experiencedImAmcTableLabel(row)}
                                                </TableCell>
                                                {!isApplicantUser && (
                                                <TableCell align="left" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                    {(() => {
                                                        const scoreRaw = row.initialSelfRatingScore;
                                                        if (scoreRaw != null && String(scoreRaw).trim() !== '') {
                                                            return String(scoreRaw).trim();
                                                        }
                                                        return '—';
                                                    })()}
                                                </TableCell>
                                                )}
                                                {!isApplicantUser && (
                                                <TableCell
                                                    align="left"
                                                    sx={{ fontWeight: 500, color: '#1e293b' }}
                                                    title="Composite queue score (0–10): 70% Initial Assessment + 15% Investment Experience + 15% Target Corpus"
                                                >
                                                    {(() => {
                                                        const total = computeCompositeQueueScore(row);
                                                        return total != null ? String(total) : '—';
                                                    })()}
                                                </TableCell>
                                                )}
                                                <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, width: '100%' }}>
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
                                                <TableCell align="left">
                                                    <IconButton size="small" sx={{ p: '2px', color: '#476bbc', '&:hover': { backgroundColor: '#f0f4ff' } }} onClick={() => openModel(row)}>
                                                        <EmailListIcon style={{ width: '22px', height: '22px', fill: 'currentColor' }} />
                                                    </IconButton>
                                                </TableCell>
                                                {!isApplicantUser && (
                                                <TableCell align="left">
                                                    <IconButton size="small" sx={{ p: '2px', color: '#37c5ab', '&:hover': { backgroundColor: '#f0fdf4' } }} onClick={() => openModelHistory(row)}>
                                                        <HistoryCustomIcon style={{ width: '22px', height: '20px', fill: 'currentColor' }} />
                                                    </IconButton>
                                                </TableCell>
                                                )}
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
                                Showing {totalEntries > 0 ? pageInfo.pageNumber * pageInfo.pageSize + 1 : 0} to {totalEntries > 0 ? Math.min((pageInfo.pageNumber + 1) * pageInfo.pageSize, totalEntries) : 0} of {totalEntries} results
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {Math.ceil(totalEntries / pageInfo.pageSize) > 1 && (
                                    <Pagination
                                        count={Math.ceil(totalEntries / pageInfo.pageSize)}
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
                        open={openQueryModal}
                        close={closeModel}
                        prelimDetails={selectedRow}
                    ></QueryResolutionModal>
                        : <></>}

                    {openHistoryModal ? <HistoryModal
                        isActive={openHistoryModal}
                        open={openHistoryModal}
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
                    <Dialog
                        open={contactDetailsRow != null}
                        onClose={() => setContactDetailsRow(null)}
                        fullWidth
                        maxWidth="sm"
                    >
                        <DialogTitle>{'AIF & contact'}</DialogTitle>
                        <DialogContent>
                            {contactDetailsRow && (
                                <Card variant="outlined" sx={{ mt: 1 }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                AIF name
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.25 }}>
                                                {getAifDisplayNameForContactCard(contactDetailsRow)}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Contact person
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.25 }}>
                                                {String(
                                                    contactDetailsRow.applicantContactPerson
                                                    || contactDetailsRow.createdByName
                                                    || '',
                                                ).trim() || '—'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.25, wordBreak: 'break-word' }}>
                                                {String(contactDetailsRow.applicantContactEmail || '').trim()
                                                    || getUserEmailById(contactDetailsRow.createdBy)
                                                    || '—'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.25 }}>
                                                {String(contactDetailsRow.applicantContactPhone || '').trim() || '—'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.25, whiteSpace: 'pre-wrap' }}>
                                                {String(contactDetailsRow.applicantContactAddress || '').trim() || '—'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setContactDetailsRow(null)}>Close</Button>
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
                    <Snackbar
                        open={startApplicationToast !== null}
                        autoHideDuration={12000}
                        onClose={(_, reason) => {
                            if (reason === 'clickaway') return;
                            setStartApplicationToast(null);
                        }}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        sx={{ zIndex: (theme) => theme.zIndex.modal + 12 }}
                    >
                        <Alert
                            onClose={() => setStartApplicationToast(null)}
                            severity="info"
                            variant="standard"
                            sx={opaqueInfoToastAlertSx}
                        >
                            {startApplicationToast}
                        </Alert>
                    </Snackbar>
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
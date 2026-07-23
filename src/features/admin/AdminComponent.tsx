import {
    Container,
    Box,
    Button,
    Typography,
    TableCell,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
    Chip,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    TextField,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import React, * as Rect from 'react'
import uuid from "react-uuid";
import NavigationBar from '../../components/NavigationBar'
import { deleteUserAsync, fetchUsersAsync, selectUsers, updateUserOtpRequiredAsync, updateUserRolesAsync } from './adminSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { FetchStatus } from "../../lib/api-status/IStatus";
import { Delete, Edit, InfoOutlined, Close as CloseDialogIcon } from '@mui/icons-material'
import RoleComponent from './RoleComponent'
import { IUser } from "./IUser";
import dayjs from "dayjs";
import { assignUserAdminRole, sendSetPasswordEmail, getUserApplicationCount, fetchRegistrationConfig, updateRegistrationConfig, fetchIaPassThresholdsConfig, updateIaPassThresholdsConfig } from "./adminApi";
import AddOperationalUserModal from "./AddOperationalUserModal";
import {
    DEFAULT_IA_PASS_THRESHOLDS,
    IaPassThresholds,
    normalizeIaPassThresholds,
} from "../../lib/iaPassThresholds";

const REGISTRATION_CLOSED_PREVIEW =
    "The application window for the first phase of the NPS Bharat Fund of Funds platform has now closed, as all applications for this phase have been received.\n\n"
    + "The portal will reopen shortly for the second phase of applications. Please keep visiting the website for updates and announcements.\n\n"
    + "Thank you for your patience and understanding";

const Admin = (props: any) => {

    const { id } = useParams()
    const usersState = useAppSelector(selectUsers)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const [open, setOpen] = Rect.useState(false);
    const handleClose = () => setOpen(false);
    const [selectedRow, setSelectedRow] = useState({} as IUser);
    const [openAddOperational, setOpenAddOperational] = useState(false);
    const [detailUser, setDetailUser] = useState<IUser | null>(null);
    const navigate = useNavigate();
    const [adminTab, setAdminTab] = useState(0);
    const [registrationEnabled, setRegistrationEnabled] = useState(true);
    const [registrationConfigLoading, setRegistrationConfigLoading] = useState(false);
    const [registrationConfigSaving, setRegistrationConfigSaving] = useState(false);
    const [registrationConfigError, setRegistrationConfigError] = useState('');
    const [registrationConfigSaved, setRegistrationConfigSaved] = useState(false);
    const [iaThresholds, setIaThresholds] = useState<IaPassThresholds>(DEFAULT_IA_PASS_THRESHOLDS);
    /** String drafts so users can clear/retype freely; clamped to 1–10 on blur/save. */
    const [iaThresholdDrafts, setIaThresholdDrafts] = useState<Record<keyof IaPassThresholds, string>>({
        firstTimeEquity: String(DEFAULT_IA_PASS_THRESHOLDS.firstTimeEquity),
        firstTimeDebt: String(DEFAULT_IA_PASS_THRESHOLDS.firstTimeDebt),
        experiencedEquity: String(DEFAULT_IA_PASS_THRESHOLDS.experiencedEquity),
        experiencedDebt: String(DEFAULT_IA_PASS_THRESHOLDS.experiencedDebt),
    });
    const [iaThresholdsSaving, setIaThresholdsSaving] = useState(false);
    const [iaThresholdsError, setIaThresholdsError] = useState('');
    const [iaThresholdsSaved, setIaThresholdsSaved] = useState(false);

    const formatVal = (v: unknown) => {
        if (v == null || String(v).trim() === '') return '—';
        return String(v);
    };

    function handleOpen(row: IUser) {
        setSelectedRow(row)
        setOpen(true);
    }

    useEffect(() => {
        if (props.checkUnAuth) {
            navigate('/login')
        }
    })

    useEffect(() => {
        dispatch(fetchUsersAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))

    }, [usersState.actionStatus.fetchStatus === FetchStatus.IDLE, usersState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        dispatch(fetchUsersAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))

    }, [open])

    useEffect(() => {
        if (adminTab !== 1) return;
        let cancelled = false;
        const loadConfig = async () => {
            setRegistrationConfigLoading(true);
            setRegistrationConfigError('');
            setRegistrationConfigSaved(false);
            setIaThresholdsError('');
            setIaThresholdsSaved(false);
            try {
                const [regRes, iaRes] = await Promise.all([
                    fetchRegistrationConfig(),
                    fetchIaPassThresholdsConfig(),
                ]);
                if (!cancelled) {
                    setRegistrationEnabled(Boolean(regRes?.data?.registrationEnabled));
                    const normalized = normalizeIaPassThresholds(iaRes?.data);
                    setIaThresholds(normalized);
                    setIaThresholdDrafts({
                        firstTimeEquity: formatThresholdDisplay(normalized.firstTimeEquity),
                        firstTimeDebt: formatThresholdDisplay(normalized.firstTimeDebt),
                        experiencedEquity: formatThresholdDisplay(normalized.experiencedEquity),
                        experiencedDebt: formatThresholdDisplay(normalized.experiencedDebt),
                    });
                }
            } catch (e: any) {
                if (!cancelled) {
                    setRegistrationConfigError(e?.response?.data?.message || e?.message || 'Failed to load configuration.');
                }
            } finally {
                if (!cancelled) setRegistrationConfigLoading(false);
            }
        };
        void loadConfig();
        return () => { cancelled = true; };
    }, [adminTab]);

    const handleRegistrationToggle = async (enabled: boolean) => {
        setRegistrationConfigSaving(true);
        setRegistrationConfigError('');
        setRegistrationConfigSaved(false);
        try {
            const res = await updateRegistrationConfig(enabled);
            setRegistrationEnabled(Boolean(res?.data?.registrationEnabled));
            setRegistrationConfigSaved(true);
        } catch (e: any) {
            setRegistrationConfigError(e?.response?.data?.message || e?.message || 'Failed to save configuration.');
        } finally {
            setRegistrationConfigSaving(false);
        }
    };

    const clampIaThreshold = (n: number) => Math.min(10, Math.max(1, n));

    const formatThresholdDisplay = (n: number) => {
        const rounded = Math.round(n * 100) / 100;
        return String(rounded);
    };

    const syncDraftsFromThresholds = (next: IaPassThresholds) => {
        setIaThresholdDrafts({
            firstTimeEquity: formatThresholdDisplay(next.firstTimeEquity),
            firstTimeDebt: formatThresholdDisplay(next.firstTimeDebt),
            experiencedEquity: formatThresholdDisplay(next.experiencedEquity),
            experiencedDebt: formatThresholdDisplay(next.experiencedDebt),
        });
    };

    const handleIaThresholdFieldChange = (key: keyof IaPassThresholds, raw: string) => {
        // Allow empty / partial decimals while typing (e.g. "6." then "6.5"); do not clamp here.
        if (raw !== '' && !/^\d{0,2}(\.\d{0,2})?$/.test(raw)) {
            return;
        }
        setIaThresholdDrafts((prev) => ({ ...prev, [key]: raw }));
        setIaThresholdsSaved(false);
        setIaThresholdsError('');
    };

    const handleIaThresholdFieldBlur = (key: keyof IaPassThresholds) => {
        const raw = iaThresholdDrafts[key];
        const n = parseFloat(raw);
        const nextVal = Number.isFinite(n) ? clampIaThreshold(n) : iaThresholds[key];
        setIaThresholds((prev) => ({ ...prev, [key]: nextVal }));
        setIaThresholdDrafts((prev) => ({ ...prev, [key]: formatThresholdDisplay(nextVal) }));
    };

    const handleSaveIaThresholds = async () => {
        const parsed: IaPassThresholds = {
            firstTimeEquity: parseFloat(iaThresholdDrafts.firstTimeEquity),
            firstTimeDebt: parseFloat(iaThresholdDrafts.firstTimeDebt),
            experiencedEquity: parseFloat(iaThresholdDrafts.experiencedEquity),
            experiencedDebt: parseFloat(iaThresholdDrafts.experiencedDebt),
        };
        const values = Object.values(parsed);
        if (values.some((v) => !Number.isFinite(v) || v < 1 || v > 10)) {
            setIaThresholdsError('Each threshold must be a number from 1 to 10 (decimals allowed, e.g. 6.5).');
            return;
        }
        setIaThresholdsSaving(true);
        setIaThresholdsError('');
        setIaThresholdsSaved(false);
        try {
            const clamped: IaPassThresholds = {
                firstTimeEquity: clampIaThreshold(parsed.firstTimeEquity),
                firstTimeDebt: clampIaThreshold(parsed.firstTimeDebt),
                experiencedEquity: clampIaThreshold(parsed.experiencedEquity),
                experiencedDebt: clampIaThreshold(parsed.experiencedDebt),
            };
            const res = await updateIaPassThresholdsConfig(clamped);
            const normalized = normalizeIaPassThresholds(res?.data);
            setIaThresholds(normalized);
            syncDraftsFromThresholds(normalized);
            setIaThresholdsSaved(true);
        } catch (e: any) {
            setIaThresholdsError(e?.response?.data?.message || e?.message || 'Failed to save IA pass thresholds.');
        } finally {
            setIaThresholdsSaving(false);
        }
    };

    function handleSubmitForm() {
        //controller.save(formData);
    }
    /* const handleChange = (ev: any) => {
         ev.preventDefault();
         let copiedValue = { ...formData }
         let key = ev.target.id ? ev.target.id : ev.target.name;
         copiedValue[key as keyof typeof formData] = ev.target.value;
         setFormData(copiedValue);
       };*/

    const handleReset = () => {

    };

    /** Compact table: profile fields open in the details dialog (icon next to username). */
    const tableHeaders = [
        "Id",
        "Username",
        "Role",
        "Registered",
        "Email OTP",
        "Approve",
        "Set password email",
    ] as const;

    const headerCellSx = {
        fontWeight: 700,
        fontSize: '0.7rem',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.06em',
        color: '#3730a3',
        backgroundColor: '#eef2ff',
        borderBottom: '2px solid #c7d2fe',
        py: 1.25,
        px: 1.5,
        whiteSpace: 'nowrap' as const,
        lineHeight: 1.2,
    };

    const bodyCellSx = {
        fontSize: '0.8125rem',
        py: 1.25,
        px: 1.5,
        borderColor: '#e2e8f0',
        color: '#1e293b',
        verticalAlign: 'middle' as const,
    };
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
    const [userApplicationCount, setUserApplicationCount] = useState(0);

    const handleDeleteUser = async (row: IUser) => {
        if (row.id == null) {
            return;
        }
        // Check if user has applications
        try {
            const response = await getUserApplicationCount(Number(row.id));
            const count = response.data;
            setUserToDelete(row);
            setUserApplicationCount(count || 0);
            setDeleteDialogOpen(true);
        } catch (error: any) {
            console.error('Error fetching application count:', error);
            // Fallback: show dialog with 0 count if API call fails
            setUserToDelete(row);
            setUserApplicationCount(0);
            setDeleteDialogOpen(true);
        }
    }

    const confirmDeleteUser = () => {
        if (userToDelete?.id) {
            dispatch(deleteUserAsync(wrapArgument(actionUid, Number(userToDelete.id))));
            setDeleteDialogOpen(false);
            setUserToDelete(null);
            setUserApplicationCount(0);
        }
    }

    const cancelDeleteUser = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        setUserApplicationCount(0);
    }


    const formatRoleLabel = (role: string | undefined) => {
        const normalized = String(role || '').toUpperCase();
        if (normalized === 'CHECKER,MANAGER' || normalized === 'CHECKER,USERADMIN') {
            return 'CHECKER + USERADMIN';
        }
        return role || '—';
    };

    const sortByRegisteredOnAsc = (users: IUser[]) => [...users].sort((a, b) => {
        const aTime = a.registeredOn ? dayjs(a.registeredOn).valueOf() : 0;
        const bTime = b.registeredOn ? dayjs(b.registeredOn).valueOf() : 0;
        return aTime - bTime;
    });

    const pendingUsers = sortByRegisteredOnAsc(
        usersState.users.filter((user) => String(user.role || "").toUpperCase() === "REGISTERED")
    );
    // Operational users: CHECKER, MAKER, USERADMIN, ADMIN, CHECKER+USERADMIN, DISABLED
    const operationalUsers = [...usersState.users]
        .filter((user) => {
            const role = String(user.role || "").toUpperCase();
            return role !== "REGISTERED" && role !== "USER";
        })
        .sort((a, b) => {
            const roleA = String(a.role || "").toUpperCase();
            const roleB = String(b.role || "").toUpperCase();
            const isAActive = roleA !== "DISABLED";
            const isBActive = roleB !== "DISABLED";

            if (isAActive && !isBActive) return -1;
            if (!isAActive && isBActive) return 1;

            const aTime = a.registeredOn ? dayjs(a.registeredOn).valueOf() : 0;
            const bTime = b.registeredOn ? dayjs(b.registeredOn).valueOf() : 0;
            return aTime - bTime;
        });
    // Applicant/registered users who have been approved (role = USER)
    const applicantUsers = sortByRegisteredOnAsc(
        usersState.users.filter((user) => String(user.role || "").toUpperCase() === "USER")
    );
    // Keep for backward compat (used in table count)
    const approvedUsers = [...operationalUsers, ...applicantUsers];

    const headerAlign = (h: string): 'left' | 'center' | 'right' => {
        if (['Approve', 'Assign User Admin', 'Set password email', 'Delete', 'Email OTP', 'Status'].includes(h)) return 'center';
        if (['Id', 'Role', 'Registered'].includes(h)) return 'center';
        return 'left';
    };

    const detailRow = (label: string, value: unknown) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '160px 1fr' }, gap: { xs: 0.25, sm: 1 }, py: 1, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#0f172a', wordBreak: 'break-word' }}>
                {formatVal(value)}
            </Typography>
        </Box>
    );

    const renderHeaderRow = (userType: 'operational' | 'applicant') => {
        const dynamicColumn = userType === 'operational' ? 'Status' : 'Delete';
        return (
            <TableRow>
                {tableHeaders.map((h) => (
                    <TableCell key={h} align={headerAlign(h)} sx={headerCellSx}>
                        {h}
                    </TableCell>
                ))}
                <TableCell key={dynamicColumn} align={headerAlign(dynamicColumn)} sx={headerCellSx}>
                    {dynamicColumn}
                </TableCell>
            </TableRow>
        );
    };

    const handleToggleUserStatus = (row: IUser) => {
        if (row.id == null) return;

        const currentRole = String(row.role || '').toUpperCase();
        const isDisabled = currentRole === 'DISABLED';

        // Toggle: if DISABLED → restore to last active role (default to CHECKER if unknown)
        // if active → set to DISABLED
        const newRole = isDisabled ? 'CHECKER' : 'DISABLED';

        const confirmMessage = isDisabled
            ? `Are you sure you want to enable ${row.username}?`
            : `Are you sure you want to disable ${row.username}?`;

        if (!window.confirm(confirmMessage)) return;

        dispatch(updateUserRolesAsync(
            wrapArgument(actionUid, { id: Number(row.id), role: newRole })
        ));
    };

    const renderActionCells = (row: IUser, userType: 'operational' | 'applicant') => {
        const roleUpper = String(row.role || '').toUpperCase();
        const isApplicant = roleUpper === 'USER';
        const isDisabled = roleUpper === 'DISABLED';
        return (
            <>
                {/* Email OTP Column */}
                <TableCell align="center" sx={bodyCellSx}>
                    <Tooltip title="Require email OTP at login (only when MFA is enabled on the server)">
                        <FormControlLabel
                            sx={{ m: 0, justifyContent: 'center' }}
                            control={
                                <Switch
                                    size="small"
                                    checked={!!row.otpRequired}
                                    onChange={(_, checked) => {
                                        if (row.id != null) {
                                            dispatch(updateUserOtpRequiredAsync(
                                                wrapArgument(actionUid, { id: Number(row.id), otpRequired: checked })
                                            ));
                                        }
                                    }}
                                    color="primary"
                                />
                            }
                            label=""
                            labelPlacement="end"
                        />
                    </Tooltip>
                </TableCell>
                {/* Approve Column - Edit pencil icon */}
                <TableCell align="center" sx={bodyCellSx}>
                    {/* Pencil only for operational users, not for applicants (USER role) */}
                    {!isApplicant ? (
                        <Tooltip title="Assign or change role">
                            <Edit sx={{ cursor: 'pointer', color: '#4338ca', fontSize: 22 }} onClick={() => handleOpen(row)} />
                        </Tooltip>
                    ) : (
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>—</Typography>
                    )}
                </TableCell>

                {/* Set Password Email Column */}
                <TableCell align="center" sx={bodyCellSx}>
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                        onClick={async () => {
                            if (row.id == null) return;
                            try {
                                await sendSetPasswordEmail(Number(row.id));
                                alert(`Set password email sent to ${row.username}`);
                            } catch (e: any) {
                                alert(e?.response?.data || e?.message || 'Failed to send set password email');
                            }
                        }}
                    >
                        Send
                    </Button>
                </TableCell>

                {/* Status Column - Only for operational users (Active/Disabled button) */}
                {userType === 'operational' && (
                    <TableCell align="center" sx={bodyCellSx}>
                        <Button
                            size="small"
                            variant="contained"
                            color={isDisabled ? "error" : "success"}
                            onClick={() => handleToggleUserStatus(row)}
                            sx={{
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                minWidth: '90px',
                            }}
                        >
                            {isDisabled ? "Disabled" : "Active"}
                        </Button>
                    </TableCell>
                )}

                {/* Delete Column - Only for pending/applicant users */}
                {userType === 'applicant' && (
                    <TableCell align="center" sx={bodyCellSx}>
                        <Tooltip title="Delete user">
                            <Delete sx={{ cursor: 'pointer', color: '#d32f2f', fontSize: 22 }} onClick={() => handleDeleteUser(row)} />
                        </Tooltip>
                    </TableCell>
                )}
            </>
        );
    };

    const renderUserRows = (users: IUser[], userType: 'operational' | 'applicant') =>
        users.map((row, idx) => (
            <TableRow
                key={`${row.id}`}
                hover
                sx={{
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                    '&:last-child td': { borderBottom: 0 },
                }}
            >
                <TableCell align="center" sx={{ ...bodyCellSx, color: '#64748b', fontWeight: 600 }}>{row.id}</TableCell>
                <TableCell align="left" sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            title={row.username}
                        >
                            {row.username}
                        </Typography>
                        <Tooltip title="View company & contact details">
                            <IconButton
                                size="small"
                                aria-label="View user details"
                                onClick={() => setDetailUser(row)}
                                sx={{ color: '#4338ca', flexShrink: 0 }}
                            >
                                <InfoOutlined fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
                <TableCell align="center" sx={bodyCellSx}>
                    <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: '#4338ca', letterSpacing: '0.02em' }}>
                        {formatRoleLabel(row.role)}
                    </Typography>
                </TableCell>
                <TableCell align="center" sx={bodyCellSx}>{row.registeredOn && dayjs(row.registeredOn).format("DD/MM/YYYY")}</TableCell>
                {renderActionCells(row, userType)}
            </TableRow>
        ));

    const renderUsersTable = (users: IUser[], ariaLabel: string, userType: 'operational' | 'applicant') => {
        return (
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    maxHeight: { xs: 360, sm: 480 },
                    overflow: 'auto',
                    mb: 4,
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
                }}
            >
                <Table size="small" stickyHeader sx={{ minWidth: 720 }} aria-label={ariaLabel}>
                    <TableHead>
                        {renderHeaderRow(userType)}
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={tableHeaders.length + 1} align="center" sx={{ ...bodyCellSx, py: 5, color: '#64748b' }}>
                                    No users in this list.
                                </TableCell>
                            </TableRow>
                        ) : (
                            renderUserRows(users, userType)
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <div className="homeComp" style={{ height: 670 }}>
            <NavigationBar></NavigationBar>
            {true ?
                <Container maxWidth="xl" sx={{ pt: '120px' }}>
                    <Paper elevation={0} sx={{ backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Box sx={{ px: 2.5, pt: 1, backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
                            <Tabs
                                value={adminTab}
                                onChange={(_e, v) => setAdminTab(v)}
                                textColor="primary"
                                indicatorColor="primary"
                                sx={{ minHeight: 48 }}
                            >
                                <Tab label="Users" sx={{ textTransform: 'none', fontWeight: 700 }} />
                                <Tab label="Configurations" sx={{ textTransform: 'none', fontWeight: 700 }} />
                            </Tabs>
                        </Box>

                        {adminTab === 0 && (
                            <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2.5, borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                            <Button variant="contained" onClick={() => setOpenAddOperational(true)} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 2.5, boxShadow: '0 2px 8px rgba(67, 56, 163, 0.25)' }}>
                                Add operational user
                            </Button>
                        </Box>
                        <Box sx={{ px: 2.5, pt: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                Pending approval
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, mt: 0.5 }}>
                                {pendingUsers.length} user{pendingUsers.length === 1 ? '' : 's'} awaiting role assignment
                            </Typography>
                            {renderUsersTable(pendingUsers, 'Users pending approval', 'applicant')}

                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mt: 1 }}>
                                Operational users
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, mt: 0.5 }}>
                                {operationalUsers.length} active operational user{operationalUsers.length === 1 ? '' : 's'} (Checker, Maker, Admin, UserAdmin)
                            </Typography>
                            {renderUsersTable(operationalUsers, 'Operational users', 'operational')}

                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mt: 1 }}>
                                Registered applicants
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, mt: 0.5 }}>
                                {applicantUsers.length} approved applicant{applicantUsers.length === 1 ? '' : 's'} (fund applicants)
                            </Typography>
                            {renderUsersTable(applicantUsers, 'Registered applicants', 'applicant')}
                        </Box>
                            </>
                        )}

                        {adminTab === 1 && (
                            <Box sx={{ p: 3, backgroundColor: '#fff' }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                                    Portal configurations
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                                    Control registration and Initial Assessment pass thresholds.
                                </Typography>
                                {registrationConfigLoading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                                        <CircularProgress size={22} />
                                        <Typography variant="body2">Loading configuration...</Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 720 }}>
                                        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={registrationEnabled}
                                                        disabled={registrationConfigSaving}
                                                        onChange={(e) => handleRegistrationToggle(e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                                                            Enable user registration
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                            {registrationEnabled
                                                                ? 'Registration is open. “Register here” opens the signup form.'
                                                                : 'Registration is closed. “Register here” shows the phase-closed message.'}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ alignItems: 'flex-start', m: 0 }}
                                            />
                                            {!registrationEnabled && (
                                                <Alert severity="info" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                                                    {REGISTRATION_CLOSED_PREVIEW}
                                                </Alert>
                                            )}
                                            {registrationConfigSaved && (
                                                <Alert severity="success" sx={{ mt: 2 }}>
                                                    Registration configuration saved.
                                                </Alert>
                                            )}
                                            {registrationConfigError && (
                                                <Alert severity="error" sx={{ mt: 2 }}>
                                                    {registrationConfigError}
                                                </Alert>
                                            )}
                                        </Paper>

                                        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                            <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                                                Initial Assessment pass thresholds
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                                Average score required to pass (1–10). Decimals allowed (e.g. 6.5).
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                                <TextField
                                                    label="First Time · Equity"
                                                    type="text"
                                                    size="small"
                                                    value={iaThresholdDrafts.firstTimeEquity}
                                                    onChange={(e) => handleIaThresholdFieldChange('firstTimeEquity', e.target.value)}
                                                    onBlur={() => handleIaThresholdFieldBlur('firstTimeEquity')}
                                                    inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*', min: 1, max: 10 }}
                                                />
                                                <TextField
                                                    label="First Time · Debt"
                                                    type="text"
                                                    size="small"
                                                    value={iaThresholdDrafts.firstTimeDebt}
                                                    onChange={(e) => handleIaThresholdFieldChange('firstTimeDebt', e.target.value)}
                                                    onBlur={() => handleIaThresholdFieldBlur('firstTimeDebt')}
                                                    inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*', min: 1, max: 10 }}
                                                />
                                                <TextField
                                                    label="Experienced · Equity"
                                                    type="text"
                                                    size="small"
                                                    value={iaThresholdDrafts.experiencedEquity}
                                                    onChange={(e) => handleIaThresholdFieldChange('experiencedEquity', e.target.value)}
                                                    onBlur={() => handleIaThresholdFieldBlur('experiencedEquity')}
                                                    inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*', min: 1, max: 10 }}
                                                />
                                                <TextField
                                                    label="Experienced · Debt"
                                                    type="text"
                                                    size="small"
                                                    value={iaThresholdDrafts.experiencedDebt}
                                                    onChange={(e) => handleIaThresholdFieldChange('experiencedDebt', e.target.value)}
                                                    onBlur={() => handleIaThresholdFieldBlur('experiencedDebt')}
                                                    inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*', min: 1, max: 10 }}
                                                />
                                            </Box>
                                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Button
                                                    variant="contained"
                                                    disabled={iaThresholdsSaving}
                                                    onClick={() => void handleSaveIaThresholds()}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    {iaThresholdsSaving ? 'Saving...' : 'Save thresholds'}
                                                </Button>
                                            </Box>
                                            {iaThresholdsSaved && (
                                                <Alert severity="success" sx={{ mt: 2 }}>
                                                    IA pass thresholds saved.
                                                </Alert>
                                            )}
                                            {iaThresholdsError && (
                                                <Alert severity="error" sx={{ mt: 2 }}>
                                                    {iaThresholdsError}
                                                </Alert>
                                            )}
                                        </Paper>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {open ? <RoleComponent open={open} userDetails={selectedRow} handleClose={handleClose}></RoleComponent> : <></>}
                        <AddOperationalUserModal
                            open={openAddOperational}
                            onClose={() => setOpenAddOperational(false)}
                            onCreated={() => {
                                dispatch(fetchUsersAsync(wrapArgument(actionUid, props.prelimApplicationId)));
                            }}
                        />
                        <Dialog open={detailUser != null} onClose={() => setDetailUser(null)} maxWidth="sm" fullWidth scroll="paper">
                            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
                                <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                    User details
                                </Typography>
                                <IconButton aria-label="Close" onClick={() => setDetailUser(null)} size="small">
                                    <CloseDialogIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent dividers sx={{ pt: 0 }}>
                                {detailUser && (
                                    <>
                                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, mt: 0.5 }}>
                                            Account #{detailUser.id ?? '—'}
                                        </Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        {detailRow('Username', detailUser.username)}
                                        {detailRow('Company name', detailUser.companyName)}
                                        {detailRow('Contact person', detailUser.contactPerson)}
                                        {detailRow('Phone', detailUser.phoneNumber)}
                                        {detailRow('Title', detailUser.title)}
                                        {detailRow('State', detailUser.state)}
                                        {detailRow('City', detailUser.city)}
                                        {detailRow('Address', detailUser.address)}
                                        {detailRow('SEBI registration', detailUser.sebiRegistration)}
                                        {detailRow(
                                            'SEBI registration date',
                                            detailUser.sebiRegistrationDate && dayjs(detailUser.sebiRegistrationDate).format('DD/MM/YYYY')
                                        )}
                                        {detailRow('Role', detailUser.role)}
                                        {detailRow(
                                            'Registered on',
                                            detailUser.registeredOn && dayjs(detailUser.registeredOn).format('DD/MM/YYYY HH:mm:ss')
                                        )}
                                    </>
                                )}
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 2 }}>
                                <Button variant="contained" onClick={() => setDetailUser(null)} sx={{ textTransform: 'none' }}>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Paper>
                </Container>
                : <div style={{ padding: "20px", backgroundColor: '#f2f2f2' }}>Loading...</div>}

            {/* Delete User Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={cancelDeleteUser}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ backgroundColor: '#f44336', color: 'white', fontWeight: 600 }}>
                    Confirm User Deletion
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to delete user <strong>{userToDelete?.username}</strong>?
                    </Typography>
                    {userApplicationCount > 0 && (
                        <Box sx={{
                            backgroundColor: '#fff3e0',
                            border: '1px solid #ff9800',
                            borderRadius: '8px',
                            p: 2,
                            mb: 2
                        }}>
                            <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 600, mb: 1 }}>
                                ⚠️ Warning
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#000' }}>
                                This user has <strong>{userApplicationCount}</strong> application(s) associated with their account.
                                Deleting this user will also mark all their applications as deleted.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={cancelDeleteUser}
                        variant="outlined"
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeleteUser}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                        Delete User{userApplicationCount > 0 ? ` & ${userApplicationCount} Application(s)` : ''}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Admin;
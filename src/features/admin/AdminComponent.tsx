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
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import React, * as Rect from 'react'
import uuid from "react-uuid";
import NavigationBar from '../../components/NavigationBar'
import { deleteUserAsync, fetchUsersAsync, selectUsers, updateUserOtpRequiredAsync } from './adminSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { FetchStatus } from "../../lib/api-status/IStatus";
import { Delete, Edit, InfoOutlined, Close as CloseDialogIcon } from '@mui/icons-material'
import RoleComponent from './RoleComponent'
import { IUser } from "./IUser";
import dayjs from "dayjs";
import { assignManagerRole, sendSetPasswordEmail } from "./adminApi";
import AddOperationalUserModal from "./AddOperationalUserModal";

const Admin = (props: any) => {

    const { id } = useParams()
    const usersState = useAppSelector(selectUsers)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const [open, setOpen] = Rect.useState(false);
    const handleClose = () => setOpen(false);
    const [selectedRow , setSelectedRow] = useState({} as IUser);
    const [openAddOperational, setOpenAddOperational] = useState(false);
    const [detailUser, setDetailUser] = useState<IUser | null>(null);
    const navigate = useNavigate();

    const formatVal = (v: unknown) => {
        if (v == null || String(v).trim() === '') return '—';
        return String(v);
    };

    function handleOpen(row:IUser)
    {
        setSelectedRow(row)
        setOpen(true);
    }

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })

    useEffect(() => {
        console.log('calling fetchUsersAsync');
        dispatch(fetchUsersAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))

    }, [usersState.actionStatus.fetchStatus === FetchStatus.IDLE, usersState.status.fetchStatus == FetchStatus.IDLE])

    useEffect(() => {
        console.log('calling fetchUsersAsync');
        dispatch(fetchUsersAsync(
            wrapArgument(actionUid, props.prelimApplicationId)
        ))

    }, [open])


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
        "Assign manager",
        "Set password email",
        "Delete",
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
    const handleDeleteUser = (row: IUser) => {
        if (row.id == null) {
            return;
        }
        const confirmed = window.confirm(`Delete user ${row.username}? This action cannot be undone.`);
        if (!confirmed) {
            return;
        }
        dispatch(deleteUserAsync(
            wrapArgument(actionUid, Number(row.id))
        ));
    }


    const sortByRegisteredOnAsc = (users: IUser[]) => [...users].sort((a, b) => {
        const aTime = a.registeredOn ? dayjs(a.registeredOn).valueOf() : 0;
        const bTime = b.registeredOn ? dayjs(b.registeredOn).valueOf() : 0;
        return aTime - bTime;
    });

    const pendingUsers = sortByRegisteredOnAsc(
        usersState.users.filter((user) => String(user.role || "").toUpperCase() === "REGISTERED")
    );
    const approvedUsers = sortByRegisteredOnAsc(
        usersState.users.filter((user) => String(user.role || "").toUpperCase() !== "REGISTERED")
    );

    const headerAlign = (h: (typeof tableHeaders)[number]): 'left' | 'center' | 'right' => {
        if (['Approve', 'Assign manager', 'Set password email', 'Delete', 'Email OTP'].includes(h)) return 'center';
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

    const renderHeaderRow = () => (
        <TableRow>
            {tableHeaders.map((h) => (
                <TableCell key={h} align={headerAlign(h)} sx={headerCellSx}>
                    {h}
                </TableCell>
            ))}
        </TableRow>
    );

    const renderActionCells = (row: IUser) => (
        <>
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
            <TableCell align="center" sx={bodyCellSx}>
                <Tooltip title="Assign or change role">
                    <Edit sx={{ cursor: 'pointer', color: '#4338ca', fontSize: 22 }} onClick={() => handleOpen(row)} />
                </Tooltip>
            </TableCell>
            <TableCell align="center" sx={bodyCellSx}>
                {row.role === 'CHECKER' ? (
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                        onClick={async () => {
                            if (row.id == null) return;
                            try {
                                await assignManagerRole(Number(row.id));
                                dispatch(fetchUsersAsync(wrapArgument(actionUid, props.prelimApplicationId)));
                            } catch (e: any) {
                                alert(e?.response?.data || e?.message || 'Failed to assign manager role');
                            }
                        }}
                    >
                        Promote
                    </Button>
                ) : (
                    '—'
                )}
            </TableCell>
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
            <TableCell align="center" sx={bodyCellSx}>
                <Tooltip title="Delete user">
                    <Delete sx={{ cursor: 'pointer', color: '#d32f2f', fontSize: 22 }} onClick={() => handleDeleteUser(row)} />
                </Tooltip>
            </TableCell>
        </>
    );

    const renderUserRows = (users: IUser[]) =>
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
                        {row.role}
                    </Typography>
                </TableCell>
                <TableCell align="center" sx={bodyCellSx}>{row.registeredOn && dayjs(row.registeredOn).format("DD/MM/YYYY")}</TableCell>
                {renderActionCells(row)}
            </TableRow>
        ));

    const renderUsersTable = (users: IUser[], ariaLabel: string) => (
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
                    {renderHeaderRow()}
                </TableHead>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length} align="center" sx={{ ...bodyCellSx, py: 5, color: '#64748b' }}>
                                No users in this list.
                            </TableCell>
                        </TableRow>
                    ) : (
                        renderUserRows(users)
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <div className="homeComp" style={{ height: 670 }}>
            <NavigationBar></NavigationBar>
            {true ?
                <Container maxWidth="xl" sx={{ pt: '120px' }}>
                    <Paper elevation={0} sx={{ backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
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
                            {renderUsersTable(pendingUsers, 'Users pending approval')}
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mt: 1 }}>
                                Approved users
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, mt: 0.5 }}>
                                {approvedUsers.length} active operational user{approvedUsers.length === 1 ? '' : 's'}
                            </Typography>
                            {renderUsersTable(approvedUsers, 'Approved users')}
                        </Box>
                        {open ? <RoleComponent open={open} userDetails = {selectedRow} handleClose={handleClose}></RoleComponent> : <></>}
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


        </div>

    )
}

export default Admin;
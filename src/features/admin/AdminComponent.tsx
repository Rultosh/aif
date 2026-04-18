import { Container, Box, Button, Typography, TableCell, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip, Switch, FormControlLabel, Stack } from "@mui/material";
import logo from '../../images/logo.png'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import CloseIcon from '@mui/icons-material/Close';
import React, * as Rect from 'react'
import uuid from "react-uuid";
import NavigationBar from '../../components/NavigationBar'
import { defaultISignup } from "../signUp/ISignup";
import { deleteUserAsync, fetchUsersAsync, selectUsers, updateUserOtpRequiredAsync } from './adminSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { FetchStatus } from "../../lib/api-status/IStatus";
import { Delete, Edit, MailOutline } from '@mui/icons-material'
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
    const navigate = useNavigate();

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

    const coreHeaders = [
        "Id",
        "Username",
        "Company",
        "SEBI reg.",
        "SEBI reg. date",
        "Contact",
        "Phone",
        "Title",
        "State",
        "City",
        "Address",
        "Role",
        "Registered",
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

    const renderCoreCells = (row: IUser) => (
        <>
            <TableCell align="center" sx={{ ...bodyCellSx, color: '#64748b', fontWeight: 600 }}>{row.id}</TableCell>
            <TableCell align="left" sx={{ ...bodyCellSx, maxWidth: 200, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={row.username}>{row.username}</TableCell>
            <TableCell align="left" sx={{ ...bodyCellSx, maxWidth: 160, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={row.companyName}>{row.companyName}</TableCell>
            <TableCell align="left" sx={bodyCellSx}>{row.sebiRegistration}</TableCell>
            <TableCell align="center" sx={bodyCellSx}>{row.sebiRegistrationDate && dayjs(row.sebiRegistrationDate).format("DD/MM/YYYY")}</TableCell>
            <TableCell align="left" sx={bodyCellSx}>{row.contactPerson}</TableCell>
            <TableCell align="center" sx={bodyCellSx}>{row.phoneNumber}</TableCell>
            <TableCell align="left" sx={bodyCellSx}>{row.title}</TableCell>
            <TableCell align="left" sx={bodyCellSx}>{row.state}</TableCell>
            <TableCell align="left" sx={bodyCellSx}>{row.city}</TableCell>
            <TableCell align="left" sx={{ ...bodyCellSx, maxWidth: 200, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={row.address}>{row.address}</TableCell>
            <TableCell align="center" sx={bodyCellSx}>
                <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: '#4338ca', letterSpacing: '0.02em' }}>
                    {row.role}
                </Typography>
            </TableCell>
            <TableCell align="center" sx={bodyCellSx}>{row.registeredOn && dayjs(row.registeredOn).format("DD/MM/YYYY")}</TableCell>
        </>
    );

    const renderUserRows = (users: IUser[], variant: 'pending' | 'approved') => (
        users.map((row, idx) => {
            return (
                <TableRow
                    key={`${row.id}-${variant}`}
                    hover
                    sx={{
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        '&:last-child td': { borderBottom: 0 },
                    }}
                >
                    {renderCoreCells(row)}
                    {variant === 'pending' && (
                        <>
                            <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>
                                {row.registeredOn && dayjs(row.registeredOn).format("DD/MM/YYYY HH:mm")}
                            </TableCell>
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
                            <TableCell align="right" sx={{ ...bodyCellSx, minWidth: 200 }}>
                                <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center" flexWrap="wrap" sx={{ gap: 0.5 }}>
                                    <Tooltip title="Approve / assign role">
                                        <Button size="small" variant="outlined" color="primary" sx={{ minWidth: 0, px: 1 }} onClick={() => handleOpen(row)}>
                                            <Edit sx={{ fontSize: 18 }} />
                                        </Button>
                                    </Tooltip>
                                    {row.role === 'CHECKER' && (
                                        <Tooltip title="Promote to manager">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                sx={{ textTransform: 'none', fontSize: '0.7rem' }}
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
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Send set-password email">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{ minWidth: 0, px: 1 }}
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
                                            <MailOutline sx={{ fontSize: 18 }} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Delete user">
                                        <Button size="small" color="error" variant="outlined" sx={{ minWidth: 0, px: 1 }} onClick={() => handleDeleteUser(row)}>
                                            <Delete sx={{ fontSize: 18 }} />
                                        </Button>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </>
                    )}
                </TableRow>
            );
        })
    );

    const renderHeaderRow = (variant: 'pending' | 'approved') => (
        <TableRow>
            {coreHeaders.map((h) => (
                <TableCell key={h} align={h === 'Id' || h === 'SEBI reg. date' || h === 'Phone' || h === 'Role' || h === 'Registered' ? 'center' : 'left'} sx={headerCellSx}>
                    {h}
                </TableCell>
            ))}
            {variant === 'pending' && (
                <>
                    <TableCell align="center" sx={headerCellSx}>Registered at</TableCell>
                    <TableCell align="center" sx={headerCellSx}>Email OTP</TableCell>
                    <TableCell align="right" sx={headerCellSx}>Actions</TableCell>
                </>
            )}
        </TableRow>
    );

    const renderUsersTable = (users: IUser[], variant: 'pending' | 'approved') => (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                maxHeight: { xs: 360, sm: 440 },
                overflow: 'auto',
                mb: 4,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
            }}
        >
            <Table size="small" stickyHeader sx={{ minWidth: variant === 'pending' ? 1180 : 980 }} aria-label={variant === 'pending' ? 'Users pending approval' : 'Approved users'}>
                <TableHead>
                    {renderHeaderRow(variant)}
                </TableHead>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={variant === 'pending' ? coreHeaders.length + 3 : coreHeaders.length} align="center" sx={{ ...bodyCellSx, py: 5, color: '#64748b' }}>
                                No users in this list.
                            </TableCell>
                        </TableRow>
                    ) : (
                        renderUserRows(users, variant)
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
                            {renderUsersTable(pendingUsers, 'pending')}
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mt: 1 }}>
                                Approved users
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, mt: 0.5 }}>
                                {approvedUsers.length} active operational user{approvedUsers.length === 1 ? '' : 's'}
                            </Typography>
                            {renderUsersTable(approvedUsers, 'approved')}
                        </Box>
                        {open ? <RoleComponent open={open} userDetails = {selectedRow} handleClose={handleClose}></RoleComponent> : <></>}
                        <AddOperationalUserModal
                            open={openAddOperational}
                            onClose={() => setOpenAddOperational(false)}
                            onCreated={() => {
                                dispatch(fetchUsersAsync(wrapArgument(actionUid, props.prelimApplicationId)));
                            }}
                        />
                    </Paper>
                </Container>                        
             : <div style={{ padding: "20px", backgroundColor: '#f2f2f2' }}>Loading...</div>}


        </div>

    )
}

export default Admin;
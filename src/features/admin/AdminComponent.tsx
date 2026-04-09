import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField, TableCell, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip, Switch, FormControlLabel } from "@mui/material";
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
import { Delete, Edit } from '@mui/icons-material'
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

    const adminHeaders = ["Id", "UserName", "Company Name", "Sebi Registration", "Sebi Registration Date", "Contact Person", "Phone Number", "Title", "State", "City", "Address", "Role", "Date of Registration", "Email OTP", "Approve", "Assign Manager", "Set Password Email", "Delete"]
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


    let adminHeaderComponent = []

    for (let i = 0; i < adminHeaders.length; i++) {
        adminHeaderComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffffff', p: '10px 5px' }}>{adminHeaders[i]}</TableCell>
            </React.Fragment>)
    }


    return (
        <div className="homeComp" style={{ height: 670 }}>
            <NavigationBar></NavigationBar>
            {true ?
                <Container maxWidth="xl" sx={{ pt: '120px' }}>
                    <Paper elevation={0} sx={{ backgroundColor: '#f6f6fb', borderRadius: '10px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                            <Button variant="contained" onClick={() => setOpenAddOperational(true)}>
                                Add Operational User
                            </Button>
                        </Box>
                        <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
                            <Table sx={{ minWidth: 700, mb: 1 }} aria-label="customized table">
                                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                                    <TableRow sx={{ backgroundColor: '#34344b' }}>
                                        {adminHeaderComponent}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        usersState.users.map((row) => {
                                            return <TableRow key={`${row.id}`}>
                                                <TableCell align="center">{row.id}</TableCell>
                                                <TableCell align="center">{row.username}</TableCell>
                                                <TableCell align="center">{row.companyName}</TableCell>
                                                <TableCell align="center">{row.sebiRegistration}</TableCell>
                                                <TableCell align="center">{row.sebiRegistrationDate && dayjs(row.sebiRegistrationDate).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell align="center">{row.contactPerson}</TableCell>
                                                <TableCell align="center">{row.phoneNumber}</TableCell>
                                                <TableCell align="center">{row.title}</TableCell>
                                                <TableCell align="center">{row.state}</TableCell>
                                                <TableCell align="center">{row.city}</TableCell>
                                                <TableCell align="center">{row.address}</TableCell>
                                                <TableCell align="center">{row.role}</TableCell>
                                                <TableCell align="center">{row.registeredOn && dayjs(row.registeredOn).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell align="center">
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
                                                <TableCell align="center">
                                                    <Edit sx={{ cursor: 'pointer' }} onClick={() => handleOpen(row)} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.role === 'CHECKER' ? (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
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
                                                    ) : <></>}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
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
                                                <TableCell align="center">
                                                    <Delete sx={{ cursor: 'pointer', color: '#d32f2f' }} onClick={() => handleDeleteUser(row)} />
                                                </TableCell>
                                                
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
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
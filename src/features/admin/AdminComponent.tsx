import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField, TableCell, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
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
import { fetchUsersAsync, selectUsers } from './adminSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { FetchStatus } from "../../lib/api-status/IStatus";
import { Delete, Edit } from '@mui/icons-material'
import RoleComponent from './RoleComponent'
import { IUser } from "./IUser";

const Admin = (props: any) => {

    const { id } = useParams()
    const usersState = useAppSelector(selectUsers)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const [open, setOpen] = Rect.useState(false);
    const handleClose = () => setOpen(false);
    const [selectedRow , setSelectedRow] = useState({} as IUser);
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

    const adminHeaders = ["Id", "UserName", "Company Name", "Contact Person", "Phone Number", "Title", "State", "City", "Address", "Role", "Approve"]

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
            {true ? <div >
                <TableContainer component={Paper}  >
                    <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                        <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                            <TableRow>
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
                                        <TableCell align="center">{row.contactPerson}</TableCell>
                                        <TableCell align="center">{row.phoneNumber}</TableCell>
                                        <TableCell align="center">{row.title}</TableCell>
                                        <TableCell align="center">{row.state}</TableCell>
                                        <TableCell align="center">{row.city}</TableCell>
                                        <TableCell align="center">{row.address}</TableCell>
                                        <TableCell align="center">{row.role}</TableCell>
                                        <TableCell align="center">
                                            {row.role == 'REGISTERED' ? <Edit sx={{ cursor: 'pointer' }} onClick={() => handleOpen(row)} /> : <></>}
                                        </TableCell>
                                        
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                {open ? <RoleComponent
                                            open={open}
                                            userDetails = {selectedRow}
                                            handleClose={handleClose}></RoleComponent>
                                            : <></>}

            </div> : <div style={{ padding: "20px", backgroundColor: '#f2f2f2' }}>Loading...</div>}


        </div>

    )
}

export default Admin;
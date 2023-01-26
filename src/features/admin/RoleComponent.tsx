import { Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Modal, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { IUser } from './IUser'
import { approveUsersAsync, selectUsers } from './adminSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import uuid from "react-uuid";
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { useNavigate } from 'react-router-dom';


const RoleComponent = (props: any) => {

    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const usersState = useAppSelector(selectUsers)
    const navigate = useNavigate()
    const { userDetails } = props
    const [data, setData] = useState(userDetails || {} as IUser)

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleSelectChange = (e: any) => {
        setData({ ...data, role: roles[e.target.value] })
    }

    const handleClose = () =>{
        props.handleClose();
        
    }

    function handleSubmitForm() {
        dispatch(
            approveUsersAsync(
                wrapArgument(actionUid, data)
            )
        )
    }

    let roles = ['USER', 'ADMIN']

    return <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className= "special_modal2"
    >

        <Box sx={style}>
            <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
                <Card sx={{ display: 'flex',  background: '#f2f2f2'}}>

                    <CardContent sx={{ flex: 1 }}>
                        <Grid container spacing={2} >
                            <Grid item xs={3}>
                                <FormControl sx={{ m: 1, width: 200 }} size="medium">

                                    <InputLabel id="demo-select-small">Assign Role</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        //value={scheme}
                                        label="scheme"
                                        onChange={handleSelectChange}
                                    >

                                        <MenuItem key={"USER"} value={0}>USER</MenuItem>
                                        <MenuItem key={"USERADMIN"} value={1}>USERADMIN</MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <Box sx={{ mt: 2 }}>
                                    <Button onClick={handleSubmitForm} color='success' variant="contained" disableElevation sx={{ textTransform: 'none' }} >
                                        Submit
                                    </Button>
                                </Box>
                                
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ mt: 2 }}>
                                    {usersState.response != undefined ? <>{usersState.response}</> : <></>}
                                </Box>
                            </Grid>
                        </Grid>

                    </CardContent>
                </Card>
            </Box>
        </Box>
    </Modal >

}

export default RoleComponent;
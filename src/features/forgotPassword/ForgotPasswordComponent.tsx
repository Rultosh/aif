import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField } from "@mui/material";
import logo from '../../images/logo.png';
import ffsLogo from '../../images/ffs_final_logo.png';
import { useNavigate } from 'react-router-dom';
//import {  updateFormData } from '../signUp/signUpSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import CloseIcon from '@mui/icons-material/Close';
import loginIconImg from '../../images/aif_login_icon.png'
import { useSearchParams } from "react-router-dom";
import uuid from "react-uuid";
import { useEffect, useState } from "react";
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { setUserPasswordAsync, selectedforgotPassword } from './forgotPasswordSlice'
import { defaultIForgotPassword } from './IForgotPassword'
import {ModalComponent} from '../../components/ModalComponent'



const ForgotPassword = () => {

    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    let token = searchParams.get("token")
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState(defaultIForgotPassword);
    const state = useAppSelector(selectedforgotPassword)
    let emailSent = false;
    const [showResponse, setShowResponse] = useState(false);


    useEffect(() => {
        if (token != undefined) {
            setFormData({ ...formData, token: token })
        }
    }, [token])

    function handleSubmitForm() {
        emailSent = true
        setShowResponse(true)
        dispatch(
            setUserPasswordAsync(
                wrapArgument(actionUid, formData)
            )
        )
    }


    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...formData }
        let key = ev.target.id ? ev.target.id : ev.target.name;
        copiedValue[key as keyof typeof formData] = ev.target.value;
        setFormData(copiedValue);
    };

    const handleClose= () => {
        setShowResponse(false)
        //setFormData(defaultISignup)
    };

    return (
        <div >
            <Container sx={{ mt: '60px', }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container >
                        <Grid item xs={5}>
                            <Card className="login_card_left" sx={{ height: '545px', display: 'flex', border: 1, borderColor: "#363062", borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', backgroundColor: "#363062" }}>
                                <CardContent sx={{ flex: 1, position: "relative", backgroundColor: "transparent" }}>

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 4 }}>

                                        <Toolbar disableGutters sx={{ borderRadius: '18px', justifyContent: "center", backgroundColor: '#ffffff' }}>
                                            <Box
                                                component="img"
                                                sx={{ width: '175px', aspectRatio: '16/9', objectFit: 'contain', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                alt="ffsLogo"
                                                src={ffsLogo}
                                            />
                                        </Toolbar>
                                    </Box>


                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 4 }}>

                                        <Toolbar disableGutters sx={{ borderRadius: '18px', justifyContent: "center", backgroundColor: '#ffffff' }}>
                                            <Box
                                                component="img"
                                                sx={{width: '175px', aspectRatio: '16/9', objectFit: 'contain', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                alt="success"
                                                src={logo}
                                            />
                                        </Toolbar>
                                    </Box>

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 4, mb: 2 }}>

                                        <Toolbar disableGutters sx={{ width: '80px', height: '80px', justifyContent: "center", backgroundColor: '#ffffff', borderRadius: '50px' }}>
                                            <Box
                                                component="img"
                                                sx={{ position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                alt="success"
                                                src={loginIconImg}
                                            />

                                        </Toolbar>

                                    </Box>

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center">

                                        <Toolbar disableGutters sx={{ justifyContent: "center", color: "#ffffff" }}>
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Typography variant="h5" sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Alternate Investment Fund</Typography>

                                            </Box>

                                        </Toolbar>

                                    </Box>
                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center">

                                        <Toolbar disableGutters sx={{ justifyContent: "center", color: "#ffffff" }}>
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Typography variant="h6" sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Application Portal</Typography>

                                            </Box>

                                        </Toolbar>

                                    </Box>
                                </CardContent>

                            </Card>
                        </Grid>
                        <Grid item xs={7}>
                            <Card sx={{ display: 'flex', height: '545px', borderColor: "#363062", border: 1 }}>
                                <CardContent sx={{ flex: 1 }}>


                                    <Toolbar disableGutters sx={{ opacity: '0.8', mt: -2, ml: -2, mr: -2, color: 'white', backgroundColor: '#363062', textAlign: "center", justifyContent: "space-around" }}>
                                        <Grid container xs={12}>
                                            <Grid item xs={11}>
                                                <Box display="flex"
                                                    justifyContent="center"
                                                    alignItems="center">
                                                    <Typography sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Set Password</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Box onClick={() => navigate('/')} sx={{ color: 'white', cursor: 'pointer' }} >
                                                    <CloseIcon ></CloseIcon>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Toolbar>

                                    <Box
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 3 }}>

                                        <Typography variant="h6" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>Set your password here</Typography> <br></br>

                                        {!emailSent ?
                                            <Grid container spacing={2} >

                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        type='password'
                                                        id="password"
                                                        label="Password"
                                                        value={formData["password"] || ''}
                                                        onChange={handleChange}
                                                        sx={{ display: 'flex' }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        type='password'
                                                        id="matchingPassword"
                                                        label="Confirm Password"
                                                        value={formData["matchingPassword"] || ''}
                                                        onChange={handleChange}
                                                        sx={{ display: 'flex' }}
                                                    />
                                                </Grid>


                                                <Grid item xs={12} >
                                                    <Box display="flex"
                                                        justifyContent="center"
                                                        alignItems="center">
                                                        <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200, backgroundColor: '#c27a1b' }} onClick={handleSubmitForm}>
                                                            Set Password
                                                        </Button>
                                                    </Box>
                                                </Grid  >

                                                <Grid item xs={12}>
                                                    <Box sx={{ mt: 2 }}>
                                                        {showResponse && state.response != undefined ? <>{state.response}</> : <></>}
                                                        <ModalComponent
                                                            open={showResponse}
                                                            close={handleClose}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                            className="special_modal"
                                                            msg={state.response}
                                                            status={state.status.fetchStatus}
                                                        >
                                                        </ModalComponent>
                                                    </Box>
                                                </Grid>

                                            </Grid> : <Typography sx={{ flex: 1, mt: '10px', textAlign: "center" }}>Passwor reset email has been sent to your email id!</Typography>
                                        }
                                    </Box>

                                    <Typography sx={{ flex: 1, mt: '10px', textAlign: "center" }}>For any help, email us at vcfapplication@sidbi.in</Typography>
                                </CardContent>

                            </Card>
                        </Grid>

                    </Grid>
                </Box></Container>

        </div>

    )
}

export default ForgotPassword;
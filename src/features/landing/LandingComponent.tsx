import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField, Modal, Divider } from "@mui/material";
import logo from '../../images/logo.png'
import azadiLogo from '../../images/Azadi.png'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { validateUser } from './landingSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import '../../index.css'
import loginIconImg from '../../images/aif_login_icon.png'
import { authenticateThunk, defaultLoginRequest, selectAuthenticatedUser } from "../../components/auth/authenticationSlice";
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { fetchRoleAsync, selectUsers } from '../admin/adminSlice'
import { ModalComponent } from '../../components/ModalComponent'

const Landing = () => {

    const [open, setOpen] = useState(true);
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const state = useAppSelector(selectAuthenticatedUser)
    const [showResponse, setShowResponse] = useState(false);
    const initialState = defaultLoginRequest
    const [value, setValue] = useState(initialState);
    const errorMsg = useAppSelector(state => state.landing.error);
    const isValidUser = useAppSelector(state => state.landing.validUser);
    const [actionId] = useState(uuid());

    useEffect(() => {
        // console.log(auth.token);
        // if(auth.token) navigate('/home')
        if (localStorage.getItem('token')) navigate('/home')
    })

    useEffect(() => {
        if (state.response !== undefined) {
            setShowResponse(true)
        } else {
            setShowResponse(false)
        }
    }, [state.response])

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...value };
        copiedValue[ev.target.id as keyof typeof initialState] = ev.target.value;
        setValue(copiedValue);
    };

    const handleClose = () => {
        setShowResponse(false)
        //setFormData(defaultISignup)
    };


    function submitOnCheckEligibility() {
        navigate('/eligibilityQuestioner')
    }

    function handleKeyPress(ev: any) {
        if (ev.charCode === 13 && ev.key.toLowerCase() == 'enter') {
            isUserValid()
        }
    }
    function isUserValid() {
        // dispatch(validateUser(value))
        dispatch(authenticateThunk(wrapArgument(
            actionId, value
        )));
        // navigate('/home')
        dispatch(fetchRoleAsync(
            wrapArgument(actionId, 1)
        ))
    }
    return (
        <div className="landingComp">
            <Container sx={{ mt: '90px', }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container xs={12}>
                        <Grid item xs={3}>
                            <Card className="login_card_left" sx={{ display: 'flex', height: '500px', border: 1, borderColor: "#363062", borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', backgroundColor: "#363062" }}>

                                <CardContent sx={{ flex: 1 }}>

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 8 }}>

                                        <Toolbar disableGutters sx={{ borderRadius: '18px', justifyContent: "center", backgroundColor: '#ffffff' }}>
                                            <Box
                                                component="img"
                                                sx={{ width: '200px', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
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
                                                <Typography variant="h5" sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Alternative Investment Fund</Typography>

                                            </Box>

                                        </Toolbar>

                                    </Box>
                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center">

                                        <Toolbar disableGutters sx={{ justifyContent: "center", color: "#ffffff" }}>
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Typography variant="h6" sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Application Portal</Typography>

                                            </Box>

                                        </Toolbar>

                                    </Box>
                                </CardContent>

                            </Card>
                        </Grid>
                        <Grid item xs={4.5}>
                            <Card sx={{ display: 'flex', height: '500px', borderRight: 1, borderTop: 1, borderBottom: 1, borderColor: "#363062", borderRightColor: "#f2f2f2" }}>
                                <CardContent sx={{ flex: 1 }}>


                                    <Toolbar disableGutters sx={{ color: 'white', backgroundColor: '#363062', textAlign: "center", justifyContent: "space-around", ml: -2, mr: -2, mt: -2, opacity: '0.8' }}>
                                        <Box display="flex"
                                            justifyContent="center"
                                            alignItems="center">
                                            <Typography sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>If you already have an account</Typography>

                                        </Box>

                                    </Toolbar>

                                    <Box
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 3, display: 'flex', flexWrap: 'wrap' }}>

                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                id="username"
                                                label="Email Id"
                                                defaultValue={value.username === undefined ? "" : value.username}
                                                value={value.username}
                                                onChange={handleChange}
                                                sx={{ display: 'flex', mb: 4 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <TextField
                                                required
                                                id="password"
                                                label="Password"
                                                type="password"
                                                defaultValue={value["password"] === undefined ? "" : value["password"]}
                                                value={value["password"]}
                                                onChange={handleChange}
                                                sx={{ display: 'flex', }}
                                                onKeyPress={(e) => handleKeyPress(e)}
                                            />
                                        </Grid>
                                        {!isValidUser && errorMsg ?
                                            <Grid item xs={12} >
                                                <Typography variant="subtitle2" sx={{ flex: 1, ml: '10px', textAlign: "left", color: 'red' }}>{errorMsg}</Typography>

                                                {/* <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>{errorMsg}</Typography>
                                                </Modal>  */}
                                            </Grid>
                                            : null}
                                        {/*} <Grid item xs={12} >
                                            <TextField
                                                required
                                                id="outlined-required"
                                                label="Enter the Captcha text"
                                                //defaultValue="Capcha"
                                                sx={{ display: 'flex', mb: 2,mt: 2 }}
                                            />
                                            </Grid> */}
                                        <Grid item xs={12} >
                                            <Box display="flex">
                                                <Button type="submit" variant="contained" disableElevation sx={{ mt: 4, textTransform: 'none', width: 200, backgroundImage: 'linear-gradient(#878ADD, #505282)', borderRadius: '10px', fontWeight: 600 }} onClick={isUserValid}>
                                                    Sign In
                                                </Button>
                                            </Box>
                                        </Grid  >

                                    </Box>
                                    <Typography sx={{ flex: 1, mt: 2, mb: "2px" }}>To reset your password, please click <a href="/resetPassword" style={{ color: 'blue' }}>here</a></Typography>

                                </CardContent>

                            </Card>

                        </Grid>

                        <Grid item xs={4.5}>
                            <Card sx={{ display: 'flex', height: '500px', borderRight: 1, borderTop: 1, borderBottom: 1, borderColor: "#363062", borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                                <CardContent sx={{ flex: 1 }}>


                                    <Toolbar disableGutters sx={{ color: 'white', backgroundColor: '#363062', textAlign: "center", justifyContent: "space-around", ml: -2, mr: -2, mt: -2, opacity: '0.8' }}>
                                        <Box display="flex"
                                            justifyContent="center"
                                            alignItems="center">
                                            <Typography sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Do not have an account</Typography>

                                        </Box>

                                    </Toolbar>

                                    <Grid item xs={12} >
                                        <Box display="flex"
                                            justifyContent="center"
                                            alignItems="center">
                                            <Typography variant='subtitle2' sx={{ flex: 1, mt: 2, ml: '10px', textAlign: "center" }}>Create a new account by clicking <a href="/signUp" style={{ color: 'blue' }}>here</a></Typography>

                                        </Box>
                                    </Grid  >

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 2 }}>

                                        <Toolbar disableGutters sx={{ justifyContent: "center" }}>
                                            <Box
                                                component="img"
                                                sx={{ width: '220px', height: '120px', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                alt="success"
                                                src={azadiLogo}
                                            />

                                        </Toolbar>

                                    </Box>

                                    <Box
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 3, display: 'flex', flexWrap: 'wrap' }}>

                                        <Grid item xs={12} >
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200, backgroundImage: 'linear-gradient(#EC8D1C, #844F10)', borderRadius: '10px', fontWeight: 600 }} onClick={submitOnCheckEligibility} >
                                                    Check Eligibility
                                                </Button>
                                            </Box>
                                        </Grid  >

                                    </Box>
                                </CardContent>

                            </Card>
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
                        </Grid>
                    </Grid>
                </Box></Container>
        </div>

    )
}

export default Landing;
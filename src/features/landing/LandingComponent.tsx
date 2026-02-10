import React, { useRef } from 'react';
import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField, Modal, Divider } from "@mui/material";
import logo from '../../images/logo_nps.png';
import ffsLogo from '../../images/ffs_final_logo.png';
import azadiLogo from '../../images/Azadi.png'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { validateUser } from './landingSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import '../../index.css'
import loginIconImg from '../../images/aif_login_icon.png'
import { authenticateThunk, clearErrorMessage, defaultLoginRequest, selectAuthenticatedUser, setErrorMessage } from "../../components/auth/authenticationSlice";
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { fetchRoleAsync, selectUsers } from '../admin/adminSlice'
import { ModalComponent } from '../../components/ModalComponent'
import { CheckAuth } from '../../app/api';

import ReCAPTCHA from "react-google-recaptcha";
import { env } from 'yargs';
import ReactDOM from 'react-dom';
import { FetchStatus } from '../../lib/api-status/IStatus';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const Landing = () => {

    const [open, setOpen] = useState(true);
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const state = useAppSelector(selectAuthenticatedUser)
    const [showResponse, setShowResponse] = useState(false);
    const initialState = defaultLoginRequest
    const [value, setStateValue] = useState(initialState);
    const errorMsg = useAppSelector(state => state.landing.error);
    const isValidUser = useAppSelector(state => state.landing.validUser);
    const [actionId] = useState(uuid());
    const usersState = useAppSelector(selectUsers)

    const captchaRef = React.createRef<ReCAPTCHA>();

    useEffect(() => {
        // console.log(auth.token);
        // if(auth.token) navigate('/home')
        if (localStorage.getItem('token')) {
            if (usersState.status.fetchStatus === FetchStatus.IDLE && ['USERADMIN'].includes(usersState.role != undefined ? usersState.role : '')) {
                navigate('/Admin')
            } else {
                navigate('/home')
            }
        }
    })

    useEffect(() => {
        CheckAuth.resetToAuthorized();
    })

    useEffect(() => {
        if (state.status.fetchStatus === FetchStatus.FAILED) {
            setShowResponse(true)
        } else {
            setShowResponse(false)
        }
    }, [state.status])

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...value };
        copiedValue[ev.target.id as keyof typeof initialState] = ev.target.value;
        setStateValue(copiedValue);
    };

    const handleClose = () => {
        setShowResponse(false)
        dispatch(clearErrorMessage());
        //setFormData(defaultISignup)
    };


    function submitOnCheckEligibility() {
        navigate('/eligibilityQuestioner')
    }

    function handleKeyPress(ev: any) {
        if (ev.charCode === 13 && ev.key.toLowerCase() == 'enter') {
            isUserValid();
        }
    }
    async function isUserValid() {
        var captchaResponse: string | undefined | null;

        if (captchaRef && captchaRef.current) {
            var captchaTimeout = setTimeout(() => {
                dispatch(setErrorMessage("Captcha not available. Please refresh the screen and try again."));
            }, 1000)
            captchaResponse = await captchaRef.current.executeAsync();
            clearTimeout(captchaTimeout);
            console.log("Captcha: " + captchaResponse);
        }

        if (captchaResponse === null || captchaResponse === undefined) {
            captchaResponse = "BLANK";
        }

        console.log(captchaResponse);

        dispatch(authenticateThunk(wrapArgument(
            actionId, { ...value, captchaResponse }
        )));

        captchaRef.current?.reset();

    }

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .trim()
            .test("email-regex", "Enter a valid Email", function (value: any) {
                const EmailRegex =
                    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                const IsValidEmail = EmailRegex.test(value);

                if (!IsValidEmail) {
                    return false;
                } else {
                    return true;
                }
            })
            .required("Username is required"),
        password: Yup.string().required("Password is required"),
    });

    const {
        setValue,
        getValues,
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        isUserValid();
    };

    return (
        <>
            {/* <ReCAPTCHA
                ref={captchaRef}
                size={'invisible'}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
            /> */}
            <div className="landingComp" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="lg">
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                            <Grid item xs={12} sm={12} md={12} xl={12}>
                                <Card sx={{ display: 'flex', border: 0, backgroundColor: 'transparent', boxShadow: 'none !important' }}>
                                    <CardContent sx={{ flex: 1, p: 0, pb: '0 !important' }}>
                                        <Grid container justifyContent="flex-end">
                                            {/* <Grid item xs={3} className="login_card_left">
                                                <Box display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    sx={{ height: '100%' }}>
                                                    <Toolbar disableGutters sx={{ borderRadius: '18px', justifyContent: "center" }}>
                                                        <Box
                                                            component="img"
                                                            sx={{ width: '155px', aspectRatio: '16/9', objectFit: 'contain', position: 'relative', justifyContent: "center", display: { xs: 'block', padding: '10px' } }}
                                                            alt="success"
                                                            src={"https://npstrust.org.in/sites/default/files/logo.png"}
                                                        />

                                                    </Toolbar>

                                                </Box>
                                            </Grid> */}

                                            <Grid item xs={9} style={{ backgroundColor: '#ffffff', border: 1, borderColor: "#363062", borderRadius: '8px' }}>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        {/* <Card sx={{ display: 'flex', height: '500px', borderRight: 1, borderTop: 1, borderBottom: 1, borderColor: "#363062", borderRightColor: "#f2f2f2" }}>
                                                        <CardContent sx={{ flex: 1 }}> */}


                                                        <Toolbar className="tooltipHeadLogin" disableGutters sx={{ color: 'white', backgroundColor: '#233DA2', textAlign: "center", justifyContent: "space-around", opacity: '0.8', minHeight: '40px !important', borderTopLeftRadius: '8px' }}>
                                                            <Box display="flex"
                                                                justifyContent="center"
                                                                alignItems="center">
                                                                <Typography sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>If you already have an account</Typography>

                                                            </Box>

                                                        </Toolbar>

                                                        <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ borderRight: '1px solid #9596A9', py: 4 }}>
                                                            <Grid item xs={12}>
                                                                <Box
                                                                    justifyContent="center"
                                                                    alignItems="center"
                                                                    sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', mx: 4 }}>

                                                                    <Grid item xs={12}>
                                                                        <TextField
                                                                            required
                                                                            id="username"
                                                                            label="Email Id"
                                                                            defaultValue={""}
                                                                            value={value.username}
                                                                            {...register("username")}
                                                                            error={(errors.username) ? true : false}
                                                                            onChange={handleChange}
                                                                            sx={{ display: 'flex' }}
                                                                        />
                                                                        <Typography variant="caption" color="error">
                                                                            <>{(errors.username) ? errors.username.message : ''}</>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} >
                                                                        <TextField
                                                                            required
                                                                            id="password"
                                                                            label="Password"
                                                                            type="password"
                                                                            defaultValue={value["password"] === undefined ? "" : value["password"]}
                                                                            value={value["password"]}
                                                                            {...register("password")}
                                                                            error={(errors.password) ? true : false}
                                                                            onChange={handleChange}
                                                                            sx={{ display: 'flex', mt: 2 }}
                                                                            onKeyPress={(e) => handleKeyPress(e)}
                                                                        />
                                                                        <Typography variant="caption" color="error">
                                                                            <>{(errors.password) ? errors.password.message : ''}</>
                                                                        </Typography>
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
                                                                        <div className="signInButton" style={{ width: 'fit-content' }}>
                                                                            <Button type="submit" variant="contained" disableElevation
                                                                                sx={{
                                                                                    textTransform: 'none',
                                                                                    marginTop: "20px",
                                                                                    backgroundColor: "#D01E06",
                                                                                    borderRadius: "100px",
                                                                                    color: "#fff",
                                                                                    fontWeight: "bold"
                                                                                    // height: "50px"
                                                                                }}
                                                                                // sx={{ mt: -4, textTransform: 'none', width: 200, backgroundImage: 'linear-gradient(to right, #435fa4, #7754a0, #904598, #b62d8f)', borderRadius: '10px', fontWeight: 600 }}
                                                                                //onClick={isUserValid}
                                                                                onClick={handleSubmit(onSubmit)}
                                                                            >
                                                                                Sign In
                                                                            </Button>
                                                                            {/* <span className="signInButtonArrow"></span> */}
                                                                        </div>
                                                                    </Grid>

                                                                </Box>
                                                                <Typography sx={{ flex: 1, mt: 2, mb: "2px", mx: 4 }}>To reset your password, please click <a href="/resetPassword" style={{ color: 'blue' }}>here</a></Typography>
                                                            </Grid>
                                                        </Grid>

                                                        {/* </CardContent>

                                                        </Card> */}

                                                    </Grid>

                                                    <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Toolbar className="tooltipHeadLogin" disableGutters sx={{ color: 'white', backgroundColor: '#233DA2', textAlign: "center", justifyContent: "space-around", opacity: '0.8', minHeight: '40px!important', borderTopRightRadius: '8px' }}>
                                                            <Box display="flex"
                                                                justifyContent="center"
                                                                alignItems="center">
                                                                <Typography sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Do not have an account</Typography>

                                                            </Box>

                                                        </Toolbar>

                                                        <Grid container direction="column" justifyContent="space-between" alignItems="center" sx={{ pb: 4, flex: 1 }}>
                                                            <Grid item>
                                                                <Typography sx={{ flex: 1, mt: 5, ml: '10px', textAlign: "center" }}>Create a new account by clicking <a href="/signUp" style={{ color: 'blue' }}>here</a></Typography>
                                                            </Grid>

                                                            {/* <Grid item>
                                                                <Toolbar disableGutters sx={{ justifyContent: "center" }}>
                                                                    <Box
                                                                        component="img"
                                                                        sx={{ height: '122px', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                                        alt="success"
                                                                        src={azadiLogo}
                                                                    />
                                                                </Toolbar>
                                                            </Grid> */}

                                                            <Grid item>
                                                                <Grid container direction="column" justifyContent="space-between" alignItems="center" sx={{ flex: 1 }}>
                                                                    <Grid item>
                                                                        <div className="checkEligibilityButton" style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                                                                            <Button variant="contained" disableElevation
                                                                                sx={{
                                                                                    textTransform: 'none',
                                                                                    marginTop: "10px",
                                                                                    backgroundColor: "#2E4AB8",
                                                                                    borderRadius: "100px",
                                                                                    color: "#fff",
                                                                                }}
                                                                                onClick={submitOnCheckEligibility} >
                                                                                Check Eligibility
                                                                            </Button>
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography sx={{ flex: 1, mt: 2, ml: '10px', textAlign: "center" }}>Check your eligibility without Sign up</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>

                                                            {showResponse && state.response ? (
                                                                <Grid item xs={12}>
                                                                    <Box sx={{ mt: 2 }}>
                                                                        {state.response}
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
                                                            ) : null}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box></Container>
            </div>
        </>
    )
}

export default Landing;
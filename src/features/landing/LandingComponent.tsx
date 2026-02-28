import React, { useRef } from 'react';
import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField, Modal, Divider, CircularProgress, Snackbar, Alert } from "@mui/material";
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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButtonIcon from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckIcon from '@mui/icons-material/Check';
// Image imports removed as they have been replaced by video

import ReCAPTCHA from "react-google-recaptcha";
import { env } from 'yargs';
import ReactDOM from 'react-dom';
import { FetchStatus } from '../../lib/api-status/IStatus';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import loginVideo from '../../videos/login_videos.mp4';
import viewIcon from '../../images/view.svg';
import hideIcon from '../../images/hide.svg';

const Landing = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const state = useAppSelector(selectAuthenticatedUser)
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const initialState = defaultLoginRequest
    const [value, setStateValue] = useState(initialState);
    const errorMsg = useAppSelector(state => state.landing.error);
    const isValidUser = useAppSelector(state => state.landing.validUser);
    const [actionId] = useState(uuid());
    const [showPassword, setShowPassword] = useState(false);
    const usersState = useAppSelector(selectUsers)
    // console.log(usersState)

    const captchaRef = React.createRef<ReCAPTCHA>();

    useEffect(() => {
        const token = state.token || localStorage.getItem('token');
        if (token && usersState.role === undefined && usersState.status.fetchStatus === FetchStatus.IDLE) {
            dispatch(fetchRoleAsync(wrapArgument(actionId, undefined)));
        }
    }, [dispatch, state.token, usersState.role, usersState.status.fetchStatus, actionId]);

    useEffect(() => {
        const token = state.token || localStorage.getItem('token');
        if (token && usersState.role !== undefined) {
            if (['USERADMIN'].includes(usersState.role)) {
                navigate('/admin');
            } else if (['ADMIN'].includes(usersState.role)) {
                navigate('/home');
            } else {
                navigate('/home');
            }
        }
    }, [state.token, usersState.role, navigate]);

    useEffect(() => {
        CheckAuth.resetToAuthorized();
    })

    useEffect(() => {
        if (state.status.fetchStatus === FetchStatus.FAILED && state.response) {
            setToastMessage(state.response);
            setToastOpen(true);
        }
    }, [state.status, state.response])

    const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setToastOpen(false);
        dispatch(clearErrorMessage());
    };

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...value };
        copiedValue[ev.target.id as keyof typeof initialState] = ev.target.value;
        setStateValue(copiedValue);
    };



    function submitOnCheckEligibility() {
        navigate('/eligibilityQuestioner')
    }

    function handleKeyPress(ev: any) {
        if (ev.charCode === 13 && ev.key.toLowerCase() == 'enter') {
            isUserValid(getValues());
        }
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
        isUserValid(data);
    };

    async function isUserValid(formData: any) {
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
            actionId, { ...formData, captchaResponse }
        )));

        captchaRef.current?.reset();

    }

    return (
        <>
            <ReCAPTCHA
                ref={captchaRef}
                size={'invisible'}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
            />
            <Box sx={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
                {/* Left Section - Video Background on White */}
                <Box sx={{
                    flex: 1.6,
                    position: 'relative',
                    display: { xs: 'none', md: 'flex' },
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff'
                }}>
                    {/* Main Video Content Centered */}
                    <Box sx={{
                        position: 'relative',
                        width: '80%',
                        height: '400px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                        backgroundColor: '#000',
                        zIndex: 1,
                        mt: 6
                    }}>
                        <video
                            autoPlay
                            muted
                            loop
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        >
                            <source src={loginVideo} type="video/mp4" />
                        </video>
                    </Box>
                </Box>

                {/* Right Section - Login Form on Bluish Grey */}
                <Box sx={{
                    flex: 1,
                    backgroundColor: '#e6e8f5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: '30px 50px',
                    height: '100%'
                }}>
                    <Box sx={{ width: '100%', maxWidth: '380px' }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#000000' }}>
                            Login
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ fontWeight: 500, mb: 0.5, color: '#000000', fontSize: '14px' }}>
                                    Email Id
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter Email Id"
                                    {...register("username")}
                                    error={!!errors.username}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#fff',
                                            borderRadius: '6px',
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#FF671F',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#FF671F',
                                            },
                                        },
                                    }}
                                />
                                {errors.username && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors.username.message as string}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography sx={{ fontWeight: 500, mb: 0.5, color: '#000000', fontSize: '14px' }}>
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter Password"
                                    {...register("password")}
                                    error={!!errors.password}
                                    onKeyPress={handleKeyPress}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButtonIcon
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <Box component="img" src={viewIcon} sx={{ width: '20px', height: '20px' }} />
                                                    ) : (
                                                        <Box component="img" src={hideIcon} sx={{ width: '20px', height: '20px' }} />
                                                    )}
                                                </IconButtonIcon>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#fff',
                                            borderRadius: '6px',
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#FF671F',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#FF671F',
                                            },
                                        }
                                    }}
                                />
                                {errors.password && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors.password.message as string}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <FormControlLabel
                                    sx={{ ml: -0.5 }}
                                    control={
                                        <Checkbox
                                            size="small"
                                            icon={<Box sx={{ width: 18, height: 18, bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '4px' }} />}
                                            checkedIcon={
                                                <Box sx={{
                                                    width: 18,
                                                    height: 18,
                                                    bgcolor: '#fff',
                                                    border: '1px solid #FF671F',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <CheckIcon sx={{ fontSize: 13, color: '#FF671F' }} />
                                                </Box>
                                            }
                                            sx={{ p: 0.5, mr: 0.5 }}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: '14px', color: '#000000', fontWeight: 500 }}>Remember Me</Typography>}
                                />
                                <Typography
                                    sx={{ fontSize: '14px', color: '#1942b6', fontWeight: 500, cursor: 'pointer' }}
                                    onClick={() => navigate('/resetpassword')}
                                >
                                    Forgot Password?
                                </Typography>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={state.status.fetchStatus === FetchStatus.DOING || usersState.status.fetchStatus === FetchStatus.DOING || (!!state.token && usersState.role === undefined)}
                                sx={{
                                    py: 1.8,
                                    backgroundColor: '#FF671F',
                                    '&:hover': { backgroundColor: '#e85a15' },
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(255, 107, 33, 0.3)',
                                    mb: 2.5,
                                    position: 'relative'
                                }}
                            >
                                {(state.status.fetchStatus === FetchStatus.DOING || usersState.status.fetchStatus === FetchStatus.DOING || (!!state.token && usersState.role === undefined)) ? (
                                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                                ) : (
                                    'Login'
                                )}
                            </Button>

                            <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#000000', fontWeight: 500 }}>
                                Don't have account? <Box component="span" sx={{ color: '#FF671F', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/signUp')}>Registration Here</Box>
                            </Typography>

                            {errorMsg && (
                                <Typography variant="subtitle2" sx={{ mt: 3, textAlign: "center", color: 'red', fontWeight: 600 }}>
                                    {errorMsg}
                                </Typography>
                            )}
                        </form>
                    </Box>
                </Box>
            </Box>

            <Snackbar
                open={toastOpen}
                autoHideDuration={6000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%', borderRadius: '8px' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Landing;
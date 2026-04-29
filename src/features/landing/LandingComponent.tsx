import React, { useRef } from 'react';
import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField, Modal, Divider, CircularProgress, Snackbar, Alert, MenuItem } from "@mui/material";
import logo from '../../images/logo_nps.png';
import ffsLogo from '../../images/ffs_final_logo.png';
import azadiLogo from '../../images/Azadi.png'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { validateUser } from './landingSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import '../../index.css'
import loginIconImg from '../../images/aif_login_icon.png'
import { authenticateThunk, clearErrorMessage, clearMfaPending, defaultLoginRequest, selectAuthenticatedUser, selectMfaPending, setActiveRole, setErrorMessage, verifyMfaThunk } from "../../components/auth/authenticationSlice";
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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// Image imports removed as they have been replaced by video

import { env } from 'yargs';
import ReactDOM from 'react-dom';
import { FetchStatus } from '../../lib/api-status/IStatus';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import loginVideo from '../../videos/login_videos.mp4';
import viewIcon from '../../images/view.svg';
import hideIcon from '../../images/hide.svg';
import user_manual from '../../files/user_manual.pdf';
import faq from '../../files/FAQs.pdf';
const Landing = () => {
    const parseRolesFromToken = (token?: string | null): string[] => {
        if (!token) return [];
        try {
            const payload = token.split('.')[1];
            if (!payload) return [];
            const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
            const decoded = JSON.parse(window.atob(padded));
            const roles = decoded?.rol;
            if (Array.isArray(roles)) {
                return roles.map((r) => String(r).toUpperCase());
            }
            return [];
        } catch {
            return [];
        }
    };

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const state = useAppSelector(selectAuthenticatedUser)
    const mfaPending = useAppSelector(selectMfaPending)
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const initialState = defaultLoginRequest
    const [value, setStateValue] = useState(initialState);
    const errorMsg = useAppSelector(state => state.landing.error);
    const isValidUser = useAppSelector(state => state.landing.validUser);
    const [actionId] = useState(uuid());
    const [showPassword, setShowPassword] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const usersState = useAppSelector(selectUsers)
    // console.log(usersState)

    useEffect(() => {
        const token = state.token != null ? String(state.token) : localStorage.getItem('token');
        if (token && usersState.role === undefined && usersState.status.fetchStatus === FetchStatus.IDLE) {
            dispatch(fetchRoleAsync(wrapArgument(actionId, undefined)));
        }
    }, [dispatch, state.token, usersState.role, usersState.status.fetchStatus, actionId]);

    useEffect(() => {
        const token = state.token != null ? String(state.token) : localStorage.getItem('token');
        const activeRole = state.activeRole != null ? String(state.activeRole) : localStorage.getItem('activeRole');
        const tokenRoles = state.availableRoles?.length > 0 ? state.availableRoles : parseRolesFromToken(token);
        if (token && state.availableRoles?.length > 1 && !activeRole) {
            return;
        }
        if (token) {
            const effectiveRole = (activeRole || usersState.role || tokenRoles[0] || '').toUpperCase();
            if (['USERADMIN'].includes(effectiveRole)) {
                navigate('/admin');
            } else if (['ADMIN', 'CHECKER', 'MAKER', 'MANAGER', 'USER'].includes(effectiveRole)) {
                navigate('/home');
            } else {
                navigate('/home');
            }
        }
    }, [state.token, state.activeRole, state.availableRoles, usersState.role, navigate]);

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
            .required("Username is required").max(200, "Username cannot be more than 200 charactors"),
        password: Yup.string().required("Password is required").min(4, "Password cannot be less than 4 charactors").max(200, "Password cannot be more than 200 charactors"),
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
        dispatch(authenticateThunk(wrapArgument(
            actionId, { ...formData, captchaResponse: "BLANK" }
        )));

    }

    return (
        <>
            <Box sx={{ pt: '3%', height: '100vh', display: 'flex', overflow: 'hidden' }}>
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
                        // width: '80%',
                        // height: '400px',
                        // width: '100%',
                        height: '100%',
                        // borderRadius: '24px',
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
                            {mfaPending ? 'Enter verification code' : 'Login'}
                        </Typography>

                        {mfaPending ? (
                            <Box component="form" onSubmit={(e) => {
                                e.preventDefault();
                                const otp = otpValue.trim();
                                if (otp.length < 4) {
                                    dispatch(setErrorMessage('Please enter the verification code from your email.'));
                                    return;
                                }
                                dispatch(verifyMfaThunk(wrapArgument(actionId, {
                                    challengeId: mfaPending.challengeId,
                                    otp,
                                })));
                            }}>
                                <Typography sx={{ mb: 2, fontSize: '14px', color: '#333' }}>
                                    A one-time password has been sent to your registered email ID. 
                                    It is valid for {mfaPending.expiresInSeconds ? Math.ceil(mfaPending.expiresInSeconds / 60) : 5} minutes.
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Verification code"
                                    placeholder="6-digit code"
                                    value={otpValue}
                                    onChange={(e) => setOtpValue(e.target.value.replace(/\s/g, ''))}
                                    inputProps={{ maxLength: 12, inputMode: 'numeric' as const, autoComplete: 'one-time-code' }}
                                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '6px' } }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={state.status.fetchStatus === FetchStatus.DOING}
                                    sx={{
                                        py: 1.8,
                                        backgroundColor: '#FF671F',
                                        '&:hover': { backgroundColor: '#FF671F' },
                                        borderRadius: '6px',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        mb: 2,
                                    }}
                                >
                                    {state.status.fetchStatus === FetchStatus.DOING ? (
                                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                                    ) : (
                                        'Verify & continue'
                                    )}
                                </Button>
                                <Typography
                                    sx={{ fontSize: '14px', color: '#1942b6', fontWeight: 500, cursor: 'pointer', textAlign: 'center' }}
                                    onClick={() => {
                                        setOtpValue('');
                                        dispatch(clearMfaPending());
                                    }}
                                >
                                    Back to login
                                </Typography>
                            </Box>
                        ) : (
                        state.availableRoles?.length > 1 && !(state.activeRole || localStorage.getItem('activeRole')) ? (
                            <Box>
                                <Typography sx={{ mb: 2, fontSize: '14px', color: '#333' }}>
                                    Select the role you want to use for this session.
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    label="Role"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '6px' } }}
                                >
                                    {state.availableRoles.map((role) => (
                                        <MenuItem key={role} value={role}>{role}</MenuItem>
                                    ))}
                                </TextField>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => {
                                        if (!selectedRole) {
                                            dispatch(setErrorMessage('Please select a role to continue.'));
                                            return;
                                        }
                                        dispatch(setActiveRole(selectedRole));
                                    }}
                                    sx={{
                                        py: 1.8,
                                        backgroundColor: '#FF671F',
                                        '&:hover': { backgroundColor: '#FF671F' },
                                        borderRadius: '6px',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                    }}
                                >
                                    Continue
                                </Button>
                            </Box>
                        ) : (
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
                                disabled={state.status.fetchStatus === FetchStatus.DOING || usersState.status.fetchStatus === FetchStatus.DOING}
                                sx={{
                                    py: 1.8,
                                    backgroundColor: '#FF671F',
                                    '&:hover': { backgroundColor: '#FF671F' },
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(255, 107, 33, 0.3)',
                                    mb: 2.5,
                                    position: 'relative'
                                }}
                            >
                                {(state.status.fetchStatus === FetchStatus.DOING || usersState.status.fetchStatus === FetchStatus.DOING) ? (
                                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                                ) : (
                                    'Login'
                                )}
                            </Button>

                            <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#000000', fontWeight: 500, mb: 3 }}>
                                Don't have account? <Box component="span" sx={{ color: '#FF671F', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/signUp')}>Register Here</Box>
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="outlined"
                                    component="a"
                                    href={user_manual}
                                    target="_blank"
                                    download="User Manual.pdf"
                                    startIcon={<MenuBookIcon sx={{ color: '#fff' }} />}
                                    sx={{
                                        flex: 1,
                                        color: '#fff',
                                        borderColor: '#FF671F',
                                        backgroundColor: '#FF671F',
                                        textTransform: 'none',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        '&:hover': {
                                            backgroundColor: '#FF671F',
                                            borderColor: '#FF671F',
                                        }
                                    }}
                                >
                                    User Manual
                                </Button>
                                <Button
                                    variant="outlined"
                                    component="a"
                                    href={faq}
                                    target="_blank"
                                    download="FAQs.pdf"
                                    startIcon={<HelpOutlineIcon sx={{ color: '#fff' }} />}
                                    sx={{
                                        flex: 1,
                                        color: '#fff',
                                        borderColor: '#FF671F',
                                        backgroundColor: '#FF671F',
                                        textTransform: 'none',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        '&:hover': {
                                            backgroundColor: '#FF671F',
                                            borderColor: '#FF671F',
                                        }
                                    }}
                                >
                                    FAQs
                                </Button>
                            </Box>

                            {errorMsg && (
                                <Typography variant="subtitle2" sx={{ mt: 3, textAlign: "center", color: 'red', fontWeight: 600 }}>
                                    {errorMsg}
                                </Typography>
                            )}
                        </form>
                        )
                        )}
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
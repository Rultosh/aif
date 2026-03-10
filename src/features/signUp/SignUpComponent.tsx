import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField, Modal, FormControl, InputLabel, Select, MenuItem, Radio, RadioGroup, FormControlLabel, FormLabel, Paper, Link } from "@mui/material";
import logo from '../../images/logo.png';
import ffsLogo from '../../images/ffs_final_logo.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import CloseIcon from '@mui/icons-material/Close';
import loginIconImg from '../../images/aif_login_icon.png'
import { defaultISignup, ISignup } from "./ISignup";
import uuid from "react-uuid";
import { signupUsersAsync } from './signUpSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { selectedSignup } from './signUpSlice'
import { ModalComponent } from '../../components/ModalComponent'
import { state, city } from "./stateAndCity";
import signupBg from '../../images/signup_ai.jpeg';

import { getError } from "../../lib/api-status/errorHandler"
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const SignUp = () => {
    const fieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF671F',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF671F',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#000000',
        }
    };

    const sectionHeaderSx = {
        mb: 3,
        mt: 4,
        pb: 1,
        borderBottom: '1px solid #e2e8f0',
        color: '#000000',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 1
    };

    const { id } = useParams()
    const [formData, setFormData] = useState(defaultISignup);
    const signupState = useAppSelector(selectedSignup)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [showResponse, setShowResponse] = useState(false);
    const [formDataEmail, setFormDataEmail] = useState(false);
    const [registedWithSebi, setRegisteredWithSebi] = useState("no");
    const captchaRef = React.createRef<ReCAPTCHA>();

    async function handleSubmitForm(data: any) {
        const captchaResponse = await captchaRef.current?.executeAsync();
        console.log("recaptcha", captchaResponse);
        if (captchaResponse !== null && captchaResponse !== undefined) {
            console.log(data)
            setShowResponse(true)
            dispatch(
                signupUsersAsync(
                    wrapArgument(actionUid, { ...data, registeredOn: new Date(), captchaResponse })
                )
            )
        }
    }


    const handleChange = (ev: any) => {

        if (ev.target.id == 'username') {
            let username = ev.target.value;
            username = username && username.toLowerCase();
            // if (username != '' &&
            //     ((username.substring(username.indexOf('@')) != '@gmail.com') &&
            //         (username.substring(username.indexOf('@')) != '@yahoo.com') &&
            //         (username.substring(username.indexOf('@')) != '@yahoo.co.in') &&
            //         (username.substring(username.indexOf('@')) != '@rediffmail.com') &&
            //         (username.substring(username.indexOf('@')) != '@hotmail.com') &&
            //         (username.substring(username.indexOf('@')) != '@yahoomail.com'))) {
            setFormDataEmail(true);
            ev.preventDefault();
            let copiedValue = { ...formData }
            let key = ev.target.id ? ev.target.id : ev.target.name;
            copiedValue[key as keyof typeof formData] = ev.target.value;
            setFormData(copiedValue);
            // } else {
            //     setFormDataEmail(false);
            //     ev.preventDefault();
            //     let copiedValue = { ...formData }
            //     let key = ev.target.id ? ev.target.id : ev.target.name;
            //     copiedValue[key as keyof typeof formData] = undefined;
            //     setFormData(copiedValue);
            // }
        } else {
            ev.preventDefault();
            let copiedValue = { ...formData }
            let key = ev.target.id ? ev.target.id : ev.target.name;
            copiedValue[key as keyof typeof formData] = ev.target.value;

            if (key === 'state') {
                copiedValue.city = undefined;
                copiedValue.otherCity = undefined;
                setValue('city', '');
                setValue('otherCity', undefined);
            }

            setFormData(copiedValue);
        }
    };

    const handleReset = () => {
        setShowResponse(false)
        setFormData(defaultISignup)
    };


    const handleClose = () => {
        setShowResponse(false)
        //setFormData(defaultISignup)
    };

    const checkPublicMailsIds = (email: string) => {

        const domain = email && email.toLowerCase().substring(email.indexOf('@'));

        return (domain == "@gmail.com" ||
            domain == "@yahoo.com" ||
            domain == "@yahoo.co.in" ||
            domain == "@rediffmail.com" ||
            domain == "@hotmail.com" ||
            domain == "@yahoomail.com"
        )
    }

    const validationSchema = Yup.object().shape({
        companyName: Yup
            .string()
            .trim()
            .test("Invalid input entered", function (value: any) {
                const pattern = /[<>\/]/;
                const isNotValidInput = pattern.test(value);
                if (isNotValidInput) {
                    return false;
                } else {
                    return true;
                }
            })
            .required("Company Name is required"),
        sebiRegistration: Yup
            .string()
            .trim()
            .test("Invalid input entered", function (value: any) {
                const pattern = /[<>]/;
                const isNotValidInput = pattern.test(value);
                if (isNotValidInput) {
                    return false;
                } else {
                    return true;
                }
            })
            .required("SEBI Registration is required"),
        contactPerson: Yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Please enter valid contact person')
            .required("Contact Person is required"),
        sebiRegistrationDate: Yup.date()
            .nullable()
            .transform((curr, orig) => orig === '' ? null : curr)
            .typeError("Please enter a valid date")
            .max(new Date(), "SEBI Registration Date cannot be a future date")
            .required("SEBI Registration Date is required"),
        username: Yup
            .string()
            .required("Email is required")
            .test("email-regex", "Enter a valid Email", function (value: any) {
                const EmailRegex =
                    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                const IsValidEmail = EmailRegex.test(value);

                if (!IsValidEmail) {
                    return false;
                }
                return true;
            }),
        // .test("organization-email", "Enter your official email id", function (value: any) {
        //     return !checkPublicMailsIds(value);
        // }),
        title: Yup
            .string()
            .matches(/^[A-Za-z. ]*$/, 'Please enter valid title')
            .required("Title is required"),
        phoneNumber: Yup.string().required("Phone Number is required").test("test-name", "Enter a valid Mobile No", function (value: any) {
            const PhoneRegex = /^[0-9]{10}$/; // Change This Regex Based On Requirement
            const IsValidPhone = PhoneRegex.test(value);
            if (!IsValidPhone) {
                return false;
            }
            return true;
        }),
        state: Yup
            .string()
            .required("State is required"),
        city: Yup
            .string()
            .required("City is required"),
        otherCity: Yup.string().when("city", {
            is: (val: string) => val === "others",
            then: Yup.string().required("Please specify your city"),
            otherwise: Yup.string().nullable()
        }),
        address: Yup.string()
            .trim()
            .test("Invalid input entered", function (value: any) {
                const pattern = /[<>'=()[\]@$%*]/;
                const isNotValidInput = pattern.test(value);
                if (isNotValidInput) {
                    return false;
                } else {
                    return true;
                }
            })
            .required("Address is required")
    });

    const {
        control,
        setValue,
        getValues,
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<ISignup>({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultISignup
    });

    const onSubmit = (data: any) => {
        handleSubmitForm(data);
    };

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
            {/* Blurred Background Layer */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                backgroundImage: `url(${signupBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(2px)',
                transform: 'scale(1.1)', // Prevent blurred edges from showing
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Light overlay to keep form readable
                }
            }} />

            <ReCAPTCHA
                ref={captchaRef}
                size={'invisible'}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
            />
            <Container maxWidth="lg" sx={{ pt: '100px', pb: '60px', position: 'relative', zIndex: 1 }}>

                <Paper
                    elevation={0}
                    sx={{
                        px: 4,
                        py: 5,
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        background: '#ffffff',
                        backdropFilter: 'blur(20px)',
                        mb: 3
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#000000' }}>
                                Registration
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                            <Link
                                href="#/home"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#1942b6',
                                    // width: '100%',
                                    justifyContent: 'flex-end',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    mb: 0,
                                    width: 'fit-content',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        color: '#000000',
                                        transform: 'translateX(-4px)'
                                    }
                                }}
                            >
                                <KeyboardDoubleArrowLeftIcon sx={{ fontSize: '1.2rem', mr: 0.5 }} />
                                Back To Login
                            </Link>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    required
                                    fullWidth
                                    id="sebiRegistration"
                                    label="SEBI - Registration No."
                                    value={formData["sebiRegistration"] || ''}
                                    {...register("sebiRegistration")}
                                    error={!!errors.sebiRegistration}
                                    helperText={errors.sebiRegistration?.message as string}
                                    onChange={handleChange}
                                    sx={fieldSx}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Controller
                                        name="sebiRegistrationDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                label="SEBI - Registration Date"
                                                inputFormat='DD/MM/YYYY'
                                                disableFuture
                                                maxDate={dayjs()}
                                                onChange={(newValue) => field.onChange(newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        required
                                                        error={!!errors.sebiRegistrationDate}
                                                        helperText={errors.sebiRegistrationDate?.message as string}
                                                        sx={fieldSx}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    required
                                    fullWidth
                                    id="companyName"
                                    label="AIF Name"
                                    value={formData["companyName"] || ''}
                                    {...register("companyName")}
                                    error={!!errors.companyName}
                                    helperText={errors.companyName?.message as string}
                                    onChange={handleChange}
                                    sx={fieldSx}
                                />
                            </Grid>

                            <Grid item xs={8}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <FormControl required sx={{
                                        ...fieldSx,
                                        width: '120px',
                                        '& .MuiOutlinedInput-root': {
                                            ...fieldSx['& .MuiOutlinedInput-root'],
                                            borderTopRightRadius: 0,
                                            borderBottomRightRadius: 0,
                                        }
                                    }}>
                                        <InputLabel id="title-label">Title</InputLabel>
                                        <Select
                                            required
                                            labelId="title-label"
                                            id="title"
                                            label="Title *"
                                            value={formData["title"] || ""}
                                            {...register("title")}
                                            error={!!errors.title}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Mr.">Mr.</MenuItem>
                                            <MenuItem value="Mrs.">Mrs.</MenuItem>
                                            <MenuItem value="Ms.">Ms.</MenuItem>
                                            <MenuItem value="Dr.">Dr.</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        required
                                        fullWidth
                                        id="contactPerson"
                                        label="Contact Person Name"
                                        value={formData["contactPerson"] || ''}
                                        {...register("contactPerson")}
                                        error={!!errors.contactPerson}
                                        onChange={handleChange}
                                        sx={{
                                            ...fieldSx,
                                            flex: 1,
                                            '& .MuiOutlinedInput-root': {
                                                ...fieldSx['& .MuiOutlinedInput-root'],
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                ml: '-1px'
                                            }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', px: 1 }}>
                                    {errors.title && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, mr: 2 }}>
                                            {errors.title.message as string}
                                        </Typography>
                                    )}
                                    {errors.contactPerson && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                            {errors.contactPerson.message as string}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Email Of Contact Person"
                                    value={formData["username"] || ''}
                                    {...register("username")}
                                    error={!!errors.username}
                                    helperText={errors.username?.message as string}
                                    onChange={handleChange}
                                    sx={fieldSx}
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    required
                                    fullWidth
                                    type='number'
                                    id="phoneNumber"
                                    label="Phone Number"
                                    value={formData["phoneNumber"] || ''}
                                    {...register("phoneNumber")}
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber?.message as string}
                                    onChange={handleChange}
                                    sx={fieldSx}
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <FormControl required fullWidth sx={fieldSx}>
                                    <InputLabel id="state-label">State</InputLabel>
                                    <Select
                                        required
                                        labelId="state-label"
                                        id="state"
                                        label="State *"
                                        {...register("state")}
                                        error={!!errors.state}
                                        onChange={handleChange}
                                        value={formData["state"] || ""}
                                    >
                                        {state.categoryData.map((item: any) => (
                                            <MenuItem key={item.ID} value={item.ID}>
                                                {item.VALUE}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.state && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {errors.state.message as string}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl required fullWidth sx={fieldSx}>
                                    <InputLabel id="city-label">City</InputLabel>
                                    <Select
                                        required
                                        labelId="city-label"
                                        id="city"
                                        label="City *"
                                        {...register("city")}
                                        error={!!errors.city}
                                        onChange={handleChange}
                                        value={formData["city"] || ""}
                                    >
                                        {city.categoryData.map((item: any) => {
                                            if (item.STATE_ID === formData["state"]) {
                                                return (
                                                    <MenuItem key={item.ID} value={item.ID}>
                                                        {item.VALUE}
                                                    </MenuItem>
                                                );
                                            }
                                            return null;
                                        })}
                                        <MenuItem key="others" value="others">
                                            {"Others"}
                                        </MenuItem>
                                    </Select>
                                    {errors.city && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {errors.city.message as string}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            {formData.city === 'others' && (
                                <Grid item xs={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="otherCity"
                                        label="Please Enter City Name"
                                        value={formData["otherCity"] || ''}
                                        {...register("otherCity")}
                                        error={!!errors.otherCity}
                                        helperText={errors.otherCity?.message as string}
                                        onChange={handleChange}
                                        sx={fieldSx}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={8}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    id="address"
                                    label="Full Address"
                                    value={formData["address"] || ''}
                                    {...register("address")}
                                    error={!!errors.address}
                                    helperText={errors.address?.message as string}
                                    onChange={handleChange}
                                    sx={fieldSx}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 1, mb: 0, display: 'flex', gap: 3, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        textTransform: 'none',
                                        width: 250,
                                        py: 1.8,
                                        borderRadius: '6px',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        backgroundColor: '#FF671F',
                                        '&:hover': {
                                            backgroundColor: '#FF671F',
                                            boxShadow: '0 6px 16px rgba(255, 103, 31, 0.4)',
                                        },
                                        boxShadow: '0 4px 12px rgba(255, 107, 33, 0.3)',
                                    }}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Registration
                                </Button>
                                {/* <Button
                                    variant="outlined"
                                    disableElevation
                                    sx={{
                                        textTransform: 'none',
                                        width: 200,
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        borderColor: '#c27a1b',
                                        color: '#c27a1b',
                                        borderWidth: '2px',
                                        '&:hover': {
                                            borderColor: '#a36616',
                                            borderWidth: '2px',
                                            backgroundColor: 'rgba(194, 122, 27, 0.04)',
                                        }
                                    }}
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button> */}
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ mt: 0 }}>
                                    {showResponse && signupState.response !== undefined && (
                                        <Typography sx={{ textAlign: 'center', mb: 1, color: '#000000' }}>{signupState.response}</Typography>
                                    )}
                                    <ModalComponent
                                        open={showResponse}
                                        close={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        className="special_modal"
                                        msg={signupState.response}
                                        status={signupState.status.fetchStatus}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1, textAlign: "center", color: '#000000' }}>
                        For any help, please feel free to contact us at <span style={{ color: '#000000', fontWeight: 600 }}>aif.investment@npstrust.org.in</span>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignUp;

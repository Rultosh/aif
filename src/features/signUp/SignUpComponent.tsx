import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField, Modal, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import logo from '../../images/logo.png'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import CloseIcon from '@mui/icons-material/Close';
import loginIconImg from '../../images/aif_login_icon.png'
import { defaultISignup } from "./ISignup";
import uuid from "react-uuid";
import { Controller } from "../../lib/api-wrappers/Controller";
import { signupUsersAsync } from './signUpSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { selectedSignup } from './signUpSlice'
import {ModalComponent} from '../../components/ModalComponent'
import { state, city } from "./stateAndCity";

import { getError } from "../../lib/api-status/errorHandler"
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";


const SignUp = () => {

    const { id } = useParams()
    const [formData, setFormData] = useState(defaultISignup);
    const signupState = useAppSelector(selectedSignup)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [showResponse, setShowResponse] = useState(false);
    const [formDataEmail, setFormDataEmail] = useState(false);

    const captchaRef = React.createRef<ReCAPTCHA>();

    async function handleSubmitForm() {
        const captchaResponse = await captchaRef.current?.executeAsync();
        console.log("recaptcha", captchaResponse);
        // dispatch(validateUser(value))
        if(captchaResponse !== null && captchaResponse !== undefined) {
        console.log(formData)
            setShowResponse(true)
            dispatch(
                signupUsersAsync(
                    wrapArgument(actionUid, {...formData, captchaResponse})
                )
            )
        }
    }


    const handleChange = (ev: any) => {
        
        if(ev.target.id == 'username'){
            let username = ev.target.value;
            username = username && username.toLowerCase();
            if(username != '' && 
                ((username.substring(username.indexOf('@')) != '@gmail.com') && 
                (username.substring(username.indexOf('@')) != '@yahoo.com') && 
                (username.substring(username.indexOf('@')) != '@yahoo.co.in') && 
                (username.substring(username.indexOf('@')) != '@rediffmail.com') && 
                (username.substring(username.indexOf('@')) != '@hotmail.com') && 
                (username.substring(username.indexOf('@')) != '@yahoomail.com'))){
                setFormDataEmail(true);
                ev.preventDefault();
                let copiedValue = { ...formData }
                let key = ev.target.id ? ev.target.id : ev.target.name;
                copiedValue[key as keyof typeof formData] = ev.target.value;
                setFormData(copiedValue);
            } else {
                setFormDataEmail(false);
                ev.preventDefault();
                let copiedValue = { ...formData }
                let key = ev.target.id ? ev.target.id : ev.target.name;
                copiedValue[key as keyof typeof formData] = undefined;
                setFormData(copiedValue);
            }
        } else {
            ev.preventDefault();
            let copiedValue = { ...formData }
            let key = ev.target.id ? ev.target.id : ev.target.name;
            copiedValue[key as keyof typeof formData] = ev.target.value;
            setFormData(copiedValue);
        }
    };
    
    const handleReset = () => {
        setShowResponse(false)
        setFormData(defaultISignup)
    };


    const handleClose= () => {
        setShowResponse(false)
        //setFormData(defaultISignup)
    };

    const checkPublicMailsIds = (email : string) => {

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
            .test("Invalid input entered", function (value:any){
                const pattern = /[<>\/]/;
                const isNotValidInput = pattern.test(value);
                if(isNotValidInput){
                    return false;
                }else{
                    return true;
                }
            })
            .required("Company Name is required"),
        contactPerson: Yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Please enter valid contact person')
            .required("Contact Person is required"),
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
          })
        .test("organization-email", "Enter your official email id", function(value: any) {
            return !checkPublicMailsIds(value);
        }),
        title: Yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Please enter valid title')
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
        address: Yup.string()
            .trim()
            .test("Invalid input entered", function (value:any){
                const pattern = /[<>\/'=()[]-@$%*]/;
                const isNotValidInput = pattern.test(value);
                if(isNotValidInput){
                    return false;
                }else{
                    return true;
                }
            })
             .required("Address is required")
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
        handleSubmitForm();
      };

    return (
        <>
          <ReCAPTCHA
                ref={captchaRef}
                size={'invisible'}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
            />
        <div >
            <Container sx={{ mt: '5px', }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container >
                        <Grid item xs={3}>
                            <Card className="login_card_left" sx={{ display: 'flex', height: '675px', mb: 2, border: 1, borderColor: "#363062", borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', backgroundColor: "#363062" }}>

                                <CardContent sx={{ flex: 1 }}>

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 14 }}>

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
                                                alignItems="center">
                                                <Typography variant="h6" sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Application Portal</Typography>

                                            </Box>

                                        </Toolbar>

                                    </Box>
                                </CardContent>

                            </Card>
                        </Grid>
                        <Grid item xs={9}>
                            <Card sx={{ display: 'flex', height: '675px', mb: 2 }}>
                                <CardContent sx={{ flex: 1 }}>


                                    <Toolbar disableGutters sx={{ opacity: '0.8', mt: -2, ml: -2, mr: -2, color: 'white', backgroundColor: '#363062', textAlign: "center", justifyContent: "space-around" }}>
                                        <Grid container xs={12}>
                                            <Grid item xs={11}>
                                                <Box display="flex"
                                                    justifyContent="center"
                                                    alignItems="center">
                                                    <Typography sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Sign-Up here</Typography>

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
                                        <div>
                                            <Typography variant="caption" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>Note:</Typography> <br></br>
                                            <Typography variant="caption" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>1. This registration is only for Alternative Investment Fund (AIF) registered in India. </Typography> <br></br>
                                            <Typography variant="caption" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>2. Startups are not eligible to apply here.</Typography> <br></br>
                                            <Typography variant="caption" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>3. Use your corporate e-mail address for sign up. A link to set your password will be sent.</Typography> <br></br>
                                            <Typography variant="caption" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>4. Temporary credentials will be active ony for 90 days.</Typography> <br></br>
                                        </div>

                                        <Grid container spacing={2} sx={{ mt: 3 }}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="companyName"
                                                    label="Company Name"
                                                    //defaultValue={value["companyName"] === undefined ? "" : value["companyName"]}
                                                    value={formData["companyName"] || ''}
                                                    {...register("companyName")}
                                                    error={(errors.companyName) ? true : false}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                                <Typography variant="caption" color="error">
                                                    <>{(errors.companyName)?errors.companyName.message : ''}</>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="contactPerson"
                                                    label="Contact Person Name"
                                                    value={formData["contactPerson"] || ''}
                                                    {...register("contactPerson")}
                                                    error={(errors.contactPerson) ? true : false}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                                <Typography variant="caption" color="error">
                                                    <>{(errors.contactPerson)?errors.contactPerson.message : ''}</>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="username"
                                                    label="Email"
                                                    // value={formData["username"] || ''}
                                                    {...register("username")}
                                                    error={(errors.username) ? true : false}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                                <Typography variant="caption" color="error">
                                                    <>{(errors.username)?errors.username.message : ''}</>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="title"
                                                    label="Title"
                                                    value={formData["title"] || ''}
                                                    {...register("title")}
                                                    error={(errors.title) ? true : false}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                                <Typography variant="caption" color="error">
                                                    <>{(errors.title)?errors.title.message : ''}</>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    type='number'
                                                    id="phoneNumber"
                                                    label="Phone Number"
                                                    value={formData["phoneNumber"] || ''}
                                                    {...register("phoneNumber")}
                                                    error={(errors.phoneNumber) ? true : false}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                                <Typography variant="caption" color="error">
                                                    <>{(errors.phoneNumber)?errors.phoneNumber.message : ''}</>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                {/* <TextField
                                                    required
                                                    id="state"
                                                    label="State"
                                                    value={formData["state"] || ''}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                /> */}
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-state">State</InputLabel>
                                                    <Select
                                                        key="state"
                                                        required
                                                        labelId="demo-simple-select-state"
                                                        id="state"
                                                        // name="state"
                                                        label="State"
                                                        // value={formData["state"] || ''}
                                                        {...register("state")}
                                                        error={(errors.state) ? true : false}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            state.categoryData.map((item: any) => {
                                                                // console.log('CB', props.propertyValue, item.id, props.propertyValue === item.id);
                                                                return <MenuItem 
                                                                value={item.ID}
                                                                // selected={formData["state"] === item.ID} 
                                                                >
                                                                    {item.VALUE}
                                                                </MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                                <Typography variant="caption" color="error">
                                                    <>{(errors.state)?errors.state.message : ''}</>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                {/* <TextField
                                                    required
                                                    id="city"
                                                    label="City"
                                                    value={formData["city"] || ''}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                /> */}
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-city">City</InputLabel>
                                                    <Select
                                                        key="city"
                                                        required
                                                        labelId="demo-simple-select-city"
                                                        id="city"
                                                        // name="city"
                                                        label="City"
                                                        // value={formData["city"] || ''}
                                                        {...register("city")}
                                                        error={(errors.city) ? true : false}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            city.categoryData.map((item: any) => {
                                                                // console.log('CB', props.propertyValue, item.id, props.propertyValue === item.id);
                                                                if(item.STATE_ID === formData["state"]){
                                                                    return <MenuItem 
                                                                    value={item.ID}
                                                                    // selected={formData["city"] === item.ID} 
                                                                    >
                                                                        {item.VALUE}
                                                                    </MenuItem>
                                                                } else {
                                                                    return <MenuItem 
                                                                    value={item.ID}
                                                                    // selected={formData["city"] === item.ID} 
                                                                    >
                                                                        {item.VALUE}
                                                                    </MenuItem>
                                                                }
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                                <Typography variant="caption" color="error">
                                                    <>{(errors.city)?errors.city.message : ''}</>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="address"
                                                    label="Address"
                                                    value={formData["address"] || ''}
                                                    {...register("address")}
                                                    error={(errors.address) ? true : false}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                                <Typography variant="caption" color="error">
                                                    <>{(errors.address)?errors.address.message : ''}</>
                                                </Typography>
                                            </Grid>
                                            {/*} <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Captcha"
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Captcha"
                                                    sx={{ display: 'flex' }}
                                                />
    </Grid>*/}

                                            <Grid item xs={3} >
                                                <Box display="flex"
                                                    justifyContent="center"
                                                    alignItems="center">
                                                    <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200, background: "#363062" }} 
                                                    // onClick={handleSubmitForm}
                                                    
                                                    onClick={handleSubmit(onSubmit)}
                                                    >
                                                        Sign Up
                                                    </Button>
                                                </Box>
                                            </Grid  >

                                            <Grid item xs={3} >
                                                <Box display="flex"
                                                    justifyContent="center"
                                                    alignItems="center">
                                                    <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200, backgroundColor: '#c27a1b' }} onClick={handleReset}>
                                                        Reset
                                                    </Button>
                                                </Box>
                                            </Grid  >

                                            <Grid item xs={12}>
                                                <Box sx={{ mt: 2 }}>
                                                    {showResponse && signupState.response != undefined ? <>{signupState.response}</> : <></>}
                                                    <ModalComponent
                                                        open={showResponse}
                                                        close={handleClose}
                                                        aria-labelledby="modal-modal-title"
                                                        aria-describedby="modal-modal-description"
                                                        className="special_modal"
                                                        msg = {signupState.response}
                                                        status = {signupState.status.fetchStatus}
                                                    >
                                                    </ModalComponent>
                                                </Box>
                                            </Grid>

                                        </Grid>

                                        {/*
                                        <Grid item xs={12} >
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200, mt: 2 }} onClick={isUserValid}>
                                                    Sign Up
                                                </Button>
                                            </Box>
                                        </Grid  >*/}

                                    </Box>
                                    <Typography sx={{ flex: 1, mt: '10px', textAlign: "center" }}>For any help, emailus at vcfapplication@sidbi.in</Typography>
                                </CardContent>

                            </Card>
                        </Grid>

                    </Grid>
                </Box></Container>

        </div>
        </>
    )
}

export default SignUp;
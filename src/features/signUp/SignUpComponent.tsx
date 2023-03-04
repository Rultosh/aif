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
            if(ev.target.value != '' && ((ev.target.value.substring(ev.target.value.indexOf('@')) != '@gmail.com') && (ev.target.value.substring(ev.target.value.indexOf('@')) != '@yahoo.com') && (ev.target.value.substring(ev.target.value.indexOf('@')) != '@rediffmail.com') && (ev.target.value.substring(ev.target.value.indexOf('@')) != '@hotmail.com') && (ev.target.value.substring(ev.target.value.indexOf('@')) != '@yahoomail.com'))){
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
console.log(formDataEmail);
    const handleReset = () => {
        setShowResponse(false)
        setFormData(defaultISignup)
    };


    const handleClose= () => {
        setShowResponse(false)
        //setFormData(defaultISignup)
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

                                        <Grid container spacing={2} >
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="companyName"
                                                    label="Company Name"
                                                    //defaultValue={value["companyName"] === undefined ? "" : value["companyName"]}
                                                    value={formData["companyName"] || ''}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="contactPerson"
                                                    label="Contact Person Name"
                                                    value={formData["contactPerson"] || ''}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="username"
                                                    label="Email"
                                                    // value={formData["username"] || ''}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="title"
                                                    label="Title"
                                                    value={formData["title"] || ''}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    type='number'
                                                    id="phoneNumber"
                                                    label="Phone Number"
                                                    value={formData["phoneNumber"] || ''}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
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
                                                        name="state"
                                                        label="State"
                                                        // value={formData["state"] || ''}
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
                                                        name="city"
                                                        label="City"
                                                        // value={formData["city"] || ''}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            city.categoryData.map((item: any) => {
                                                                // console.log('CB', props.propertyValue, item.id, props.propertyValue === item.id);
                                                                return <MenuItem 
                                                                value={item.ID}
                                                                // selected={formData["city"] === item.ID} 
                                                                >
                                                                    {item.VALUE}
                                                                </MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="address"
                                                    label="Address"
                                                    value={formData["address"] || ''}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
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
                                                    <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200, background: "#363062" }} onClick={handleSubmitForm}>
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
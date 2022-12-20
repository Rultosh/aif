import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField } from "@mui/material";
import logo from '../../images/logo.png'
import { useNavigate } from 'react-router-dom';
import { submitForm, updateFormData, resetFormData } from './signUpSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import loginIconImg from '../../images/aif_login_icon.png'



const SignUp = () => {

    const navigate = useNavigate()

    const results = useAppSelector(state => state.signUp.formSubmitResponse)

    const formDataToPublish = useAppSelector(state => state.signUp.formData)

    const dispatch = useAppDispatch()



    const initialState = {
        'address': "",
        'companyName': "",
        'name': "",
        'email': "",
        "state": "",
        "phoneNo": "",
        "title": "",
        "city": ""

    };

 

    const [value, setValue] = useState(initialState);


   
    type resultSchema = {
        id: string,
        value: string
    }


    function handleSubmitForm() {
        dispatch(submitForm(formDataToPublish))
    }


    const handleChange = (ev: any) => {
        ev.preventDefault();
        console.log('checking state value', value)
        //const ev = (e.target as HTMLInputElement);
        const obj: resultSchema = { id: ev.target.id, value: ev.target.value }
        let copiedValue = { ...value };
        copiedValue[ev.target.id as keyof typeof initialState] = ev.target.value;
        setValue(copiedValue);

        console.log(obj)
        dispatch(updateFormData(obj));
    };


    const handleReset = () => {
        setValue(initialState);
        console.log("inside reste", value)
        dispatch(resetFormData());
    };


    return (
        <div >
            <Container sx={{ mt: '5px', }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container >
                        <Grid item xs={3}>
                            <Card className="login_card_left" sx={{ display: 'flex', height: '675px',mb:2,  border: 1, borderColor:"#363062",borderTopLeftRadius:'8px',borderBottomLeftRadius:'8px',backgroundColor:"#363062" }}>

                                <CardContent sx={{ flex: 1 }}>

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 14 }}>

                                        <Toolbar disableGutters sx={{ borderRadius:'18px',justifyContent: "center",backgroundColor:'#ffffff'}}>
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
                                        sx={{ mt: 4,mb:2 }}>

                                        <Toolbar disableGutters sx={{width:'80px',height:'80px', justifyContent: "center",backgroundColor:'#ffffff', borderRadius:'50px' }}>
                                            <Box
                                                component="img"
                                                sx={{  position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                alt="success"
                                                src={loginIconImg}
                                            />

                                        </Toolbar>

                                    </Box>

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center">

                                        <Toolbar disableGutters sx={{ justifyContent: "center" ,color:"#ffffff"}}>
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Typography variant="h5" sx={{ flex: 1, ml: '10px', textAlign: "center",fontWeight:'bold' }}>Alternate Investment Fund</Typography>

                                            </Box>

                                        </Toolbar>

                                    </Box>
                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center">

                                        <Toolbar disableGutters sx={{ justifyContent: "center",color:"#ffffff" }}>
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Typography variant="h6" sx={{ flex: 1, ml: '10px', textAlign: "center",fontWeight:'bold' }}>Application Portal</Typography>

                                            </Box>

                                        </Toolbar>

                                    </Box>
                                </CardContent>

                            </Card>
                        </Grid>
                        <Grid item xs={9}>
                            <Card sx={{ display: 'flex', height: '675px',mb:2 }}>
                                <CardContent sx={{ flex: 1 }}>


                                    <Toolbar disableGutters sx={{ opacity:'0.8',mt:-2,ml:-2,mr:-2,color: 'white', backgroundColor: '#363062', textAlign: "center", justifyContent: "space-around" }}>
                                        <Grid container xs={12}>
                                            <Grid item xs={11}>
                                                <Box display="flex"
                                                    justifyContent="center"
                                                    alignItems="center">
                                                    <Typography sx={{ flex: 1, ml: '10px', textAlign: "center",fontWeight:'bold'  }}>Sign-Up here</Typography>

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
                                            <Typography variant="caption" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>1. This registration is only for Alternate Investment Fund (AIF) registered in India. </Typography> <br></br>
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
                                                    defaultValue={value["companyName"] === undefined ? "" : value["companyName"]}
                                                    value={value["companyName"]}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="name"
                                                    label="Contact Person Name"
                                                    defaultValue={value["name"]}
                                                    value={value["name"]}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="email"
                                                    label="Email"
                                                    defaultValue={value["email"]}
                                                    value={value["email"]}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="title"
                                                    label="Title"
                                                    defaultValue={value["title"]}
                                                    value={value["title"]}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="phoneNo"
                                                    label="Phone Number"
                                                    defaultValue={value["phoneNo"]}
                                                    value={value["phoneNo"]}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="state"
                                                    label="State"
                                                    defaultValue={value["state"]}
                                                    value={value["state"]}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="city"
                                                    label="City"
                                                    defaultValue={value["city"]}
                                                    value={value["city"]}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    required
                                                    id="address"
                                                    label="Address"
                                                    defaultValue={value["address"]}
                                                    value={value["address"]}
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
                                                    <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200 ,background:"#363062"}} onClick={handleSubmitForm}>
                                                        Sign Up
                                                    </Button>
                                                </Box>
                                            </Grid  >

                                            <Grid item xs={3} >
                                                <Box display="flex"
                                                    justifyContent="center"
                                                    alignItems="center">
                                                    <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200 ,backgroundColor:'#c27a1b'}} onClick={handleReset}>
                                                        Reset
                                                    </Button>
                                                </Box>
                                            </Grid  >


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
            {/*} <Container sx={{ mt: '90px', }}>
                <Grid >
               
                    <CardActionArea component="a" disableRipple >
                    <Grid item  sm={3} >
                        <Card sx={{ display: 'flex' }}>
                            <CardContent sx={{ flex: 1 }}>
                                {"card1"}
                                <Box display="flex"
                                    justifyContent="center"
                                    alignItems="center">
                                   
                                </Box>
                            </CardContent>

                        </Card>
                        </Grid>
                        <Grid item  sm={3} >
                        <Card sx={{ display: 'flex' }}>
                            <CardContent sx={{ flex: 1 }}>
                                {"card2"}
                                <Box display="flex"
                                    justifyContent="center"
                                    alignItems="center">
                                   
                                </Box>
                            </CardContent>

                        </Card>
                        </Grid>
                        <Grid item  sm={3} >
                        <Card sx={{ display: 'flex' }}>
                            <CardContent sx={{ flex: 1 }}>
                                {"card3"}
                                <Box display="flex"
                                    justifyContent="center"
                                    alignItems="center">
                                   
                                </Box>
                            </CardContent>

                        </Card>
                        </Grid>

                    </CardActionArea>
                </Grid>
    </Container>*/}
        </div>

    )
}

export default SignUp;
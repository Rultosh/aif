import { Container, Grid, Card, CardContent, Box, Button, Toolbar, Typography, TextField } from "@mui/material";
import logo from '../../images/logo.png'
import { useNavigate } from 'react-router-dom';
import {  updateFormData } from '../signUp/signUpSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import loginIconImg from '../../images/aif_login_icon.png'



const ResetPassword = () => {

    const navigate = useNavigate()

    const results = useAppSelector(state => state.signUp.formSubmitResponse)

    const formDataToPublish = useAppSelector(state => state.signUp.formData)

    const dispatch = useAppDispatch()

    let emailSent = false;


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

    //const initialState = {} as any;

    const [value, setValue] = useState(initialState);


    type resultSchema = {
        id: string,
        value: string
    }



    function handleSubmitForm() {
        emailSent = true
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



    return (
        <div >
            <Container sx={{ mt: '60px', }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container >
                        <Grid item xs={5}>
                            <Card className="login_card_left" sx={{  height: '545px',display: 'flex',  border: 1, borderColor:"#363062",borderTopLeftRadius:'8px',borderBottomLeftRadius:'8px',backgroundColor:"#363062" }}>
                                <CardContent sx={{ flex: 1, position: "relative", backgroundColor: "transparent" }}>

                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 10 }}>

                                        <Toolbar disableGutters sx={{  borderRadius:'18px',justifyContent: "center",backgroundColor:'#ffffff' }}>
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

                                        <Toolbar disableGutters sx={{ justifyContent: "center",color:"#ffffff" }}>
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Typography variant="h5" sx={{ flex: 1, ml: '10px', textAlign: "center",fontWeight:'bold' }}>Alternative Investment Fund</Typography>

                                            </Box>

                                        </Toolbar>

                                    </Box>
                                    <Box display="flex"
                                        justifyContent="center"
                                        alignItems="center">

                                        <Toolbar disableGutters sx={{ justifyContent: "center" ,color:"#ffffff"}}>
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
                        <Grid item xs={7}>
                            <Card sx={{ display: 'flex', height: '545px',borderColor:"#363062",border:1 }}>
                                <CardContent sx={{ flex: 1 }}>


                                    <Toolbar disableGutters sx={{opacity:'0.8',mt:-2,ml:-2,mr:-2, color: 'white', backgroundColor: '#363062', textAlign: "center", justifyContent: "space-around" }}>
                                        <Grid container xs={12}>
                                            <Grid item xs={11}>
                                                <Box display="flex"
                                                    justifyContent="center"
                                                    alignItems="center">
                                                    <Typography sx={{ flex: 1, ml: '10px', textAlign: "center",fontWeight:'bold' }}>Reset Password</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Box onClick={() => navigate('/')} sx={{ color: 'white' ,cursor: 'pointer'}} >
                                                    <CloseIcon ></CloseIcon>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Toolbar>

                                    <Box
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 3 }}>

                                        <Typography variant="h6" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>Forgot your password?</Typography> <br></br>

                                        {!emailSent ?
                                            <Grid container spacing={2} >

                                                <Grid item xs={12}>
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
                                                </Grid>

                                                <Grid item xs={12} >
                                                    <Box display="flex"
                                                        justifyContent="center"
                                                        alignItems="center">
                                                        <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200, backgroundColor:'#c27a1b' }} onClick={handleSubmitForm}>
                                                            Send Email
                                                        </Button>
                                                    </Box>
                                                </Grid  >

                                            </Grid> : <Typography sx={{ flex: 1, mt: '10px', textAlign: "center" }}>Passwor reset email has been sent to your email id!</Typography>
                                        }
                                    </Box>
                                    <Typography sx={{ flex: 1, mt: '10px', textAlign: "center" }}>For any help, emailus at vcfapplication@sidbi.in</Typography>
                                </CardContent>
                                {/*<CardFooter>
                                    <Typography sx={{ flex: 1, mt: '10px', textAlign: "center" }}>For any help, emailus at vcfapplication@sidbi.in</Typography>
                                    </CardFooter>*/}
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

export default ResetPassword;
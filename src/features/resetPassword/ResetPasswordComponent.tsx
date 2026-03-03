import { Container, Grid, Card, CardContent, Box, Button, Typography, TextField, IconButton, Link, Divider } from "@mui/material";
import logo from '../../images/logo.png';
import ffsLogo from '../../images/ffs_final_logo.png';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import CloseIcon from '@mui/icons-material/Close';
import uuid from "react-uuid";
import { useState } from "react";
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { resetUserPasswordAsync, selectedforgotPassword } from '../forgotPassword/forgotPasswordSlice'
import { defaultIResetPassword } from './IResetPassword'
import signupBg from '../../images/signup_ai.jpeg';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const ResetPassword = () => {
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

    const navigate = useNavigate()
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState(defaultIResetPassword);
    const state = useAppSelector(selectedforgotPassword)
    console.log("state", state)
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState<string>("");
    const [serverError, setServerError] = useState<string>("");

    async function handleSubmitForm() {
        // clear previous errors
        setError("");
        setServerError("");

        if (!formData["username"] || formData["username"].trim() === "") {
            setError("Email address is required");
            return;
        }

        try {
            await dispatch(
                resetUserPasswordAsync(
                    wrapArgument(actionUid, formData)
                )
            ).unwrap();
            // only mark sent when request succeeds
            setEmailSent(true);
        } catch (err: any) {
            // display error above the button
            setServerError(err?.message || err || "Failed to send reset email");
        }
    }

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...formData }
        let key = ev.target.id ? ev.target.id : ev.target.name;
        copiedValue[key as keyof typeof formData] = ev.target.value;
        setFormData(copiedValue);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pt: '80px',
            pb: '40px'
        }}>
            {/* Background with Blur */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${signupBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1,
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(2px)',
                }
            }} />

            <Container maxWidth="sm">
                <Card sx={{
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <CardContent sx={{ p: 0 }}>

                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
                                        Forgot your password?
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                                    <Link
                                        href="#/login"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#1942b6',
                                            textDecoration: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                color: '#FF671F',
                                                transform: 'translateX(-4px)'
                                            }
                                        }}
                                    >
                                        <KeyboardDoubleArrowLeftIcon sx={{ fontSize: '1.2rem', mr: 0.5 }} />
                                        Back To Login
                                    </Link>
                                </Grid>
                            </Grid>

                            <Typography variant="body2" sx={{ color: '#666666', mb: 4 }}>
                                Enter your registered email address to receive instructions.
                            </Typography>

                            {!emailSent ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="username"
                                            label="Email Address"
                                            value={formData["username"]}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            sx={fieldSx}
                                            error={!!error}
                                            helperText={error}
                                        />
                                    </Grid>

                                    {/* show server-side error message above the button */}
                                    {serverError && (
                                        <Grid item xs={12}>
                                            <Typography sx={{ color: '#d32f2f', textAlign: 'left' }}>
                                                {serverError}
                                            </Typography>
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleSubmitForm}
                                            sx={{
                                                py: 1.5,
                                                backgroundColor: '#FF671F',
                                                '&:hover': { backgroundColor: '#FF671F' },
                                                borderRadius: '6px',
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                boxShadow: '0 4px 12px rgba(255, 107, 33, 0.3)',
                                                mt: 1
                                            }}
                                        >
                                            Send Email
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography sx={{ color: '#000', fontWeight: 500 }}>
                                        Password reset email has been sent to your email id!
                                    </Typography>
                                    <Button
                                        onClick={() => navigate('/')}
                                        sx={{ mt: 3, color: '#FF671F', fontWeight: 600 }}
                                    >
                                        Back to Login
                                    </Button>
                                </Box>
                            )}

                            <Divider sx={{ my: 4 }} />

                            <Typography variant="body2" sx={{ color: '#666666', textAlign: 'center' }}>
                                Need help? Contact us at <Link href="mailto:aif.investment@npstrust.org.in" sx={{ color: '#FF671F', textDecoration: 'none', fontWeight: 600 }}>aif.investment@npstrust.org.in</Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default ResetPassword;
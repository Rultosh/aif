import { Container, Grid, Card, CardContent, Box, Button, Typography, TextField, IconButton, Link, Divider, InputAdornment } from "@mui/material";
import IconButtonIcon from '@mui/material/IconButton';
import logo from '../../images/logo.png';
import ffsLogo from '../../images/ffs_final_logo.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import CloseIcon from '@mui/icons-material/Close';
import loginIconImg from '../../images/aif_login_icon.png'
import uuid from "react-uuid";
import { useEffect, useState } from "react";
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { setUserPasswordAsync, selectedforgotPassword, changeUserPasswordAsync } from './forgotPasswordSlice'
import { defaultIForgotPassword } from './IForgotPassword'
import { ModalComponent } from '../../components/ModalComponent'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import signupBg from '../../images/signup_ai.jpeg';
import viewIcon from '../../images/view.svg';
import hideIcon from '../../images/hide.svg';
import { defaultIChangePassword } from "../changePassword/IChangePassword";

const ForgotPassword = () => {
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
    const [searchParams] = useSearchParams();
    let token = searchParams.get("token")
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState(defaultIForgotPassword);
    const state = useAppSelector(selectedforgotPassword)
    const [passwordSet, setPasswordSet] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (token != undefined) {
            setFormData({ ...formData, token: token })
        }
    }, [token])

    function handleSubmitForm() {
        setPasswordSet(true)
        setShowResponse(true)
        if (token) {
            dispatch(
                setUserPasswordAsync(
                    wrapArgument(actionUid, formData)
                )
            )
        } else {
            dispatch(
                changeUserPasswordAsync(
                    wrapArgument(actionUid,
                        {
                            ...defaultIChangePassword,
                            passwordWithSaltAndIv: formData.passwordWithSaltAndIv
                        })
                )
            )
        }
    }

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...formData }
        let key = ev.target.id ? ev.target.id : ev.target.name;
        copiedValue[key as keyof typeof formData] = ev.target.value;
        setFormData(copiedValue);
    };

    const handleClose = () => {
        setShowResponse(false)
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
                    <CardContent sx={{ p: '0 !important' }}>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
                                        Set your password
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                                    <Link
                                        href="#/home"
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
                                        Back To Home
                                    </Link>
                                </Grid>
                            </Grid>

                            <Typography variant="body2" sx={{ color: '#666666', mb: 4 }}>
                                Please create a strong password for your account.
                            </Typography>

                            {!passwordSet ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            label="New Password"
                                            value={formData["password"] || ''}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            sx={fieldSx}
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
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="matchingPassword"
                                            label="Confirm Password"
                                            value={formData["matchingPassword"] || ''}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            sx={fieldSx}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButtonIcon
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? (
                                                                <Box component="img" src={viewIcon} sx={{ width: '20px', height: '20px' }} />
                                                            ) : (
                                                                <Box component="img" src={hideIcon} sx={{ width: '20px', height: '20px' }} />
                                                            )}
                                                        </IconButtonIcon>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

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
                                            Set Password
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography sx={{ color: '#000', fontWeight: 500 }}>
                                        Processing your request...
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <ModalComponent
                                    open={showResponse}
                                    close={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    className="special_modal"
                                    msg={state.response}
                                    status={state.status.fetchStatus}
                                />
                            </Box>

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

export default ForgotPassword;
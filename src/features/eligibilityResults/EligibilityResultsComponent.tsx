import { Box, Button, Card, CardActionArea, CardContent, Container, FormControl, FormControlLabel, FormLabel, Grid, Link, Radio, RadioGroup, ToggleButton, Toolbar, Typography, Paper, IconButton, Stack } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, * as Rect from 'react'
import { useState } from "react"
import successImg from '../../images/success.png'
import failureImg from '../../images/failure.png'
import loadingImg from '../../images/loading.png'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchResults, updateResults } from './eligibilityResultsSice'
import { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';


const EligibilityResults = () => {

    const isEligible = useAppSelector(state => state.eligibilityResults.eligibleToApply)
    const isLoading = useAppSelector(state => state.eligibilityResults.loading)
    const tempRes = useAppSelector(state => state.eligibilityQuestioner.results)
    const scheme = useAppSelector(state => state.eligibilityQuestioner.scheme)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(updateResults(tempRes))

    }, [])

    let resultTextSuccess = {
        "Fund of funds": ["Fund of Funds"],
        "Asipre for Start-ups": ["Asipre for Start-ups"],
        "UP Start-up Fund": ["UP Start-up Fund"],
        "Odisha Startup Fund": ["Odisha Startup Fund"]
    }

    let resultText = {
        "Fund of funds": ["NPS Trust's Fund of Funds for Startups (FFS) is intended to support AIFs to invest in startups.", "Based on Your size and/or structure, you do not meet the minimum eligible requirement for contribution under FFS."],
        "Aspire for MSME": ["NPS Trust’s ASPIRE fund is intended to support AIFs to invest in MSME.", "Based on your size and/or structure, you do not meet the minimum eligible requirement for contribution under ASPIRE fund scheme."],
        "UP Start-up Fund": ["NPS Trust’s UP Startup fund is intended to support AIFs to invest in startups.", "Based on your size and/or structure, you do not meet the minimum eligible requirement for contribution under UP Startup fund scheme."],
        "Odisha Startup Fund": ["NPS Trust’s UP Startup fund is intended to support AIFs to invest in startups.", "Based on your size and/or structure, you do not meet the minimum eligible requirement for contribution under UP Startup fund scheme."]
    }



    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)',
            pt: '90px',
            pb: 4
        }}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(54, 48, 98, 0.15)',
                    backgroundColor: '#ffffff'
                }}>
                    <Toolbar sx={{
                        backgroundColor: '#363062',
                        color: 'white',
                        px: 3,
                        justifyContent: 'space-between',
                        minHeight: '64px !important'
                    }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                            Eligibility Check Questionnaire
                        </Typography>
                        <IconButton onClick={() => navigate('/')} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>

                    <Box sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
                        {!isLoading ? (
                            <Box>
                                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                                    <Box
                                        component="img"
                                        src={isEligible ? successImg : failureImg}
                                        alt={isEligible ? 'Success' : 'Failure'}
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))'
                                        }}
                                    />
                                </Box>

                                {isEligible ? (
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2 }}>
                                            Congratulations!
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.7 }}>
                                            You meet the minimum eligibility requirement for applying for contribution under NPS Bharat Fund of Funds. Please login/sign-up to proceed.
                                            {/* Based on your size and structure, you may be eligible for contribution through NPS Trust's */}
                                            {/* <span style={{ color: '#363062', fontWeight: 700, marginLeft: '4px' }}>{scheme}</span>. */}
                                        </Typography>

                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate('/')}
                                                sx={{
                                                    background: '#363062',
                                                    borderRadius: '12px',
                                                    px: 4,
                                                    py: 1,
                                                    textTransform: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    boxShadow: '0 8px 20px rgba(54, 48, 98, 0.3)',
                                                    '&:hover': { background: '#2a254d' }
                                                }}
                                            >
                                                Login
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate('/signup')}
                                                sx={{
                                                    borderColor: '#363062',
                                                    color: '#363062',
                                                    borderRadius: '12px',
                                                    px: 4,
                                                    py: 1,
                                                    textTransform: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    '&:hover': { borderColor: '#2a254d', backgroundColor: 'rgba(54, 48, 98, 0.05)' }
                                                }}
                                            >
                                                Sign Up
                                            </Button>
                                        </Stack>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#e11d48', mb: 1 }}>
                                            We are Sorry!
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                                            You do not meet the minimum eligibility requirement for applying for contribution under NPS Bharat Fund of Funds.
                                        </Typography>
                                        {/* <Typography variant="body1" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                                            {resultText[scheme as keyof typeof resultText][0]}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
                                            {resultText[scheme as keyof typeof resultText][1]}
                                        </Typography> */}

                                        <Button
                                            startIcon={<HelpOutlineIcon />}
                                            sx={{
                                                color: '#363062',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                                            }}
                                        >
                                            Check FAQs for more information
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ py: 6 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                    <Box
                                        component="img"
                                        src={loadingImg}
                                        alt="Loading"
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            animation: 'spin 2s linear infinite',
                                            '@keyframes spin': {
                                                '0%': { transform: 'rotate(0deg)' },
                                                '100%': { transform: 'rotate(360deg)' }
                                            }
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                                    Processing your results...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default EligibilityResults;
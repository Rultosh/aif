import { Box, Button, Card, CardActionArea, CardContent, Container, FormControl, FormControlLabel, FormLabel, Grid, Link, Radio, RadioGroup, ToggleButton, Toolbar, Typography } from '@mui/material';
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


    let resultText = {
        "Fund of funds": ["SIDBI's Fund of Funds for Startups (FFS) is intended to support AIFs to invest in startups.", "Based on Your size and/or structure, you do not meet the minimum eligible requirement for contribution under FFS."],
        "Aspire for Start-ups": ["SIDBI’s ASPIRE fund is intended to support AIFs to invest in MSME.","Based on your size and/or structure, you do not meet the minimum eligible requirement for contribution under ASPIRE fund scheme."],
        "UP Start-up Fund": ["SIDBI’s UP Startup fund is intended to support AIFs to invest in startups.","Based on your size and/or structure, you do not meet the minimum eligible requirement for contribution under UP Startup fund scheme."]
    }



    return (
        <div>
            <Container maxWidth={false} sx={{ mt: '90px', width: '80%' }}>
                <Grid   >
                    <CardActionArea component="a" href="#" disableRipple sx={{ border: 1, borderColor: "#363062", borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} >
                        <Card sx={{ display: 'flex', justifyContent: "center" }}>
                            <CardContent sx={{ flex: 1, justifyContent: "center" }} >
                                <Toolbar disableGutters sx={{ mt: -2, mr: -2, ml: -2, color: 'white', backgroundColor: '#363062' }}>
                                    <Grid container xs={12}>
                                        <Grid item xs={11}>
                                            <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>Eligibility Self-Screener Questionnaire</Typography>
                                        </Grid>
                                        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Box onClick={() => navigate('/')} sx={{ color: 'white', cursor: 'pointer' }} >
                                                <CloseIcon ></CloseIcon>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Toolbar>
                                {!isLoading ?
                                    <Box>
                                        <Toolbar disableGutters sx={{ justifyContent: "center" }}>
                                            <Box
                                                component="img"
                                                sx={{ mt: 1, position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                alt="success"
                                                src={isEligible ? successImg : failureImg}
                                            />
                                        </Toolbar>
                                        {isEligible ?
                                            <div>
                                                <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>Congratulations!</Typography>
                                                <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>Based on your size and structure you may be eligible for applying for contribution through SIDBI's {scheme}</Typography>
                                                <Typography sx={{ flex: 1, ml: '10px', mb: '50px', textAlign: "center" }}>Please <a href="/" style={{ color: 'blue' }}>Login</a>/
                                                    <a href="/" style={{ color: 'blue' }}>Sign-up</a> to be directed to the application</Typography>
                                            </div>
                                            : <div><Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>We are Sorry!</Typography>
                                                {/*} <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>SIDBI's Fund of Funds for Startups (FFS) is intended to support AIFs to invest in startups.</Typography>
                                                <Typography sx={{ flex: 1, ml: '10px', mb: '50px', textAlign: "center" }}>Based on Your size and/or structure, you do not meet the minimum eligible requirement for contribution under FFS.</Typography>
                                        */}
                                                <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>{resultText[scheme as keyof typeof resultText][0]}</Typography>
                                                <Typography sx={{ flex: 1, ml: '10px', mb: '50px', textAlign: "center" }}>{resultText[scheme as keyof typeof resultText][1]}</Typography>

                                                <Typography sx={{ flex: 1, ml: '10px', mb: '50px', textAlign: "center" }}>Please click <a href="/" style={{ color: 'blue' }}>FAQs</a> for more information</Typography>
                                            </div>
                                        }
                                    </Box> :
                                    <Box>
                                        <Toolbar disableGutters sx={{ justifyContent: "center" }}>
                                            <Box
                                                component="img"
                                                sx={{ position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                alt="success"
                                                src={loadingImg}
                                            />
                                        </Toolbar>
                                        <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>Loading...</Typography>
                                    </Box>
                                }
                            </CardContent>

                        </Card>


                    </CardActionArea>
                </Grid>

            </Container>
        </div>


    )

}

export default EligibilityResults;
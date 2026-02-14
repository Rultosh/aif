import { Box, Button, Card, CardActionArea, CardContent, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, ToggleButton, Toolbar, Typography } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, * as Rect from 'react'
import { useState } from "react"
import successImg from './images/success.png'

const EligibilityResults = (props: any) => {

    const { question, results } = props;

    return (
        <div>
            <Container maxWidth={false} sx={{ mt: '90px' }}>
                <Grid   >
                    <CardActionArea component="a" href="#" disableRipple>
                        <Card sx={{ display: 'flex', justifyContent: "center" }}>
                            <CardContent sx={{ flex: 1, justifyContent: "center" }} >
                                <Toolbar disableGutters sx={{ color: 'white', backgroundColor: '#363062' }}>
                                    <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>Eligibility Self-Screener Questionnaire</Typography>
                                </Toolbar>
                                <Box>
                                <Toolbar disableGutters sx={{justifyContent: "center" }}>
                                <Box
                                    component="img"
                                    sx={{ position:'relative',justifyContent: "center", display: { xs: 'block' }}}
                                    alt="success"
                                    src={successImg}
                                />
                                    </Toolbar>
                                
                                <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>Congratulations!</Typography>
                                <Typography sx={{ flex: 1, ml: '10px', textAlign: "center" }}>Based on your size and structure you may be eligible for applying for contribution through NPS Trust's Fund of Funds</Typography>
                                <Typography sx={{ flex: 1, ml: '10px',mb:'50px', textAlign: "center" }}>Please Login/Sign-up to be directed to the application</Typography>
                                </Box>
                            </CardContent>

                        </Card>


                    </CardActionArea>
                </Grid>

            </Container>
        </div>


    )

}

export default EligibilityResults;
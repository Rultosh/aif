import { Box, Button, Card, CardActionArea, CardContent, Container, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, ToggleButton, Typography, Link, Breadcrumbs, Paper, Divider, Stack } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, * as Rect from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchQuestions, selected, getQuestions, schemName } from './eligibiltyQuestionerSlice'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

type resultSchema = {
    id: string,
    value: string
}


const EligibilityQuestioner = () => {

    //const { question, results } = props;
    const [scheme, setScheme] = React.useState(0);
    const question = useAppSelector(state => state.eligibilityQuestioner.questions)
    const results = useAppSelector(state => state.eligibilityQuestioner.results)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({} as resultSchema);
    const [enableCheck, setEnableCheck] = useState(false);
    const schemeNames = ["Fund of funds", "Aspire for MSME", "UP Start-up Fund", "Odisha Startup Fund"]

    useEffect(() => {
        // dispatch(fetchQuestions())
        dispatch(getQuestions())
    }, [])

    useEffect(() => {
        updateCheckButton()
    }, [formData])


    function convertStringToComponent(text: string) {
        const newText = text.split('<br>').map(str => <p>{str}</p>);
        return newText;
    }

    const handleChange = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        const ev = (e.target as HTMLInputElement);
        //const obj: resultSchema = { id: ev.id, value: ev.value }
        let copiedValue = { ...formData };
        copiedValue[ev.id as keyof resultSchema] = ev.value;
        setFormData(copiedValue);

        //setFormData(formData => ({...formData,obj}))
        //dispatch(selected(obj));
    };

    const handleSelectChange = (e: any) => {
        setFormData({} as resultSchema);
        setScheme(e.target.value);
    }
    function updateCheckButton() {
        if (scheme !== undefined && question[schemeNames[scheme]]?.length === Object.keys(formData).length) {
            setEnableCheck(true)
        }
        else {
            setEnableCheck(false)
        }
    }

    function submitOnCheckEligibility() {
        dispatch(selected(formData));
        dispatch(schemName(schemeNames[scheme || 0]));
        navigate('/eligibilityResults')
    }

    let outputComponents = []


    for (let i = 0; scheme !== undefined && i < question[schemeNames[scheme]]?.length; i++) {
        let quest = question[schemeNames[scheme]];
        let qes = quest[i].id.toString().concat('. ', quest[i].text);
        let qesId = quest[i].id.toString();

        if (quest[i] && quest[i].options === undefined) {
            outputComponents.push(
                <Box key={qesId} sx={{ mb: 4 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 600,
                            color: '#2d3748',
                            mb: 1.5,
                            fontSize: '1.05rem',
                            lineHeight: 1.6
                        }}
                    >
                        {convertStringToComponent(qes)}
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={formData[qesId as keyof resultSchema]}
                        exclusive
                        onChange={handleChange}
                        aria-label="Selection"
                        sx={{
                            '& .MuiToggleButton-root': {
                                px: 4,
                                py: 0.75,
                                borderRadius: '8px !important',
                                border: '1px solid #e2e8f0 !important',
                                mr: 1,
                                textTransform: 'none',
                                fontWeight: 700,
                                color: '#4a5568',
                                '&.Mui-selected': {
                                    backgroundColor: '#0B3C6F',
                                    color: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: '#092d54',
                                    }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="yes" id={qesId}>Yes</ToggleButton>
                        <ToggleButton value="no" id={qesId}>No</ToggleButton>
                    </ToggleButtonGroup>
                    {i < question[schemeNames[scheme]].length - 1 && <Divider sx={{ mt: 3, borderColor: '#f0f4f8' }} />}
                </Box>
            );
        }
        else {
            outputComponents.push(
                <Box key={qesId} sx={{ mb: 4 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 600,
                            color: '#2d3748',
                            mb: 1.5,
                            fontSize: '1.05rem',
                            lineHeight: 1.6
                        }}
                    >
                        {qes}
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={formData[qesId as keyof resultSchema]}
                        exclusive
                        onChange={handleChange}
                        aria-label="Selection"
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            '& .MuiToggleButton-root': {
                                px: 3,
                                py: 0.75,
                                borderRadius: '8px !important',
                                border: '1px solid #e2e8f0 !important',
                                textTransform: 'none',
                                fontWeight: 700,
                                color: '#4a5568',
                                '&.Mui-selected': {
                                    backgroundColor: '#0B3C6F',
                                    color: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: '#092d54',
                                    }
                                }
                            }
                        }}
                    >
                        {
                            quest[i].options.map((obj: any) => (
                                <ToggleButton key={obj.text} value={obj.text} id={qesId}>{obj.text}</ToggleButton>
                            ))
                        }
                    </ToggleButtonGroup>
                    {i < question[schemeNames[scheme]].length - 1 && <Divider sx={{ mt: 3, borderColor: '#f0f4f8' }} />}
                </Box>
            );
        }

    }

    return (
        <Container maxWidth="lg" sx={{ pt: '140px', pb: '60px' }}>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    background: '#ffffff',
                    mb: 3
                }}
            >
                <Grid container spacing={3} alignItems="flex-start">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0B3C6F' }}>
                            Eligibility Check
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                            Verify your scheme eligibility by answering a few questions.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Link
                            href="#/home"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#0B3C6F',
                                // width: '100%',
                                justifyContent: 'flex-end',
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                mb: 1,
                                width: 'fit-content',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    color: '#092d54',
                                    transform: 'translateX(-4px)'
                                }
                            }}
                        >
                            <KeyboardDoubleArrowLeftIcon sx={{ fontSize: '1.2rem', mr: 0.5 }} />
                            Back To Login
                        </Link>
                    </Grid>

                    {/* <Grid item xs={12} md={12}>
                        <FormControl sx={{ minWidth: 300 }}>
                            <InputLabel id="scheme-select-label">Select Scheme</InputLabel>
                            <Select
                                labelId="scheme-select-label"
                                id="scheme-select"
                                value={scheme}
                                label="Select Scheme"
                                onChange={handleSelectChange}
                                sx={{
                                    borderRadius: '10px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#e2e8f0'
                                    }
                                }}
                            >
                                <MenuItem key={"Fund of funds"} value={0}>Fund of Funds for Startups</MenuItem>
                                <MenuItem key={"Aspire for MSME"} value={1}>Aspire for MSME</MenuItem>
                                <MenuItem key={"UP Start-up Fund"} value={2}>UP Start-up Fund</MenuItem>
                                <MenuItem key={"Odisha Startup Fund"} value={3}>Odisha Startup Fund</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid> */}
                </Grid>
            </Paper>

            {scheme !== undefined ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        background: '#ffffff'
                    }}
                >
                    <Box sx={{ mt: 2 }}>
                        {outputComponents}
                    </Box>

                    <Box
                        sx={{
                            mt: 6,
                            p: 3,
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 500,
                                color: '#475569',
                                textAlign: 'justify',
                                lineHeight: 1.6
                            }}
                        >
                            <Box component="span" sx={{ fontWeight: 800, color: '#0B3C6F', display: 'block', mb: 1 }}>
                                Disclaimer
                            </Box>
                            The values entered/selected are true to your knowledge. In the future, at any point in time, if the information submitted by the Fund is found misleading or incorrect in any manner, the application will be suspended at that point in time.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <Button
                            variant="contained"
                            disabled={!enableCheck}
                            onClick={submitOnCheckEligibility}
                            sx={{
                                px: 6,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: '12px',
                                backgroundColor: '#0B3C6F',
                                '&:hover': {
                                    backgroundColor: '#092d54',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: '#cbd5e1',
                                    color: '#94a3b8'
                                }
                            }}
                        >
                            Check Eligibility
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 10,
                        opacity: 0.6
                    }}
                >
                    <DomainVerificationIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#64748b' }}>
                        Please select a scheme to proceed with the questionnaire
                    </Typography>
                </Box>
            )}
        </Container>
    )

}

export default EligibilityQuestioner;
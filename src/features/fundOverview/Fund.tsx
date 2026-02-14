import { Card, Divider, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button } from "@mui/material";
import FundOverviewData from "./subsections/fundOverviewData/FundOverviewData";
import InvestmentPartner from "./subsections/fundOverviewData/investmentPartner/InvestmentPartner";
import ContributorDetails from "./subsections/fundOverviewData/contributorDetails/ContributorDetails";
import InvestmentAssociate from "./subsections/fundOverviewData/investmentAssociate/InvestmentAssociate";
import InvestmentPast from "./subsections/fundOverviewData/investmentPast/InvestmentPast";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import PrelimApplicationData from "./subsections/fundOverviewData/PrelimApplication";
import { clearPrelimApplication, selectPrelimApplication } from "./subsections/fundOverviewData/prelimApplicationDataSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FetchStatus } from "../../lib/api-status/IStatus";
import UploadComponents from "../DetailedApplicationComponent/subsections/uploadComponents";

export const Fund = (props: any) => {

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [prelimApplicationId, setPrelimApplicationId] = useState(id);

    const prelimApplicationState = useAppSelector(selectPrelimApplication)

    const handleApplicationIdCreation = (value: String | undefined) => {
        if (value) setPrelimApplicationId(String(value));
    }

    useEffect(() => {
        if (props.checkUnAuth) {
            navigate('/login')
        }
    })

    // useEffect(() => {
    //     dispatch(clearPrelimApplication);
    //     if(prelimApplicationId == "NEW" || !Number(prelimApplicationId)) {
    //         setPrelimApplicationId(undefined);
    //     }
    // })

    useEffect(() => {
        console.log('use effect fund', prelimApplicationState.prelimApplication.id)
        setPrelimApplicationId(String(prelimApplicationState.prelimApplication.id))
    }, [prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    useEffect(() => {
        setPrelimApplicationId(id);
        if (!Number(id)) {
            console.log('clearing prelim applicaiton', Number(id))
            dispatch(clearPrelimApplication());
            console.log('cleared prelim application')
        }
    }, [id])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>("1");

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate(`/preliminary/${prelimApplicationId}/profile`)
        }
    }
    return (
        <Box className="formAnimation" sx={{ pb: 5 }}>
            <Card sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
                overflow: 'visible'
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#363062', mb: 1 }}>
                            Fund Overview
                        </Typography>
                        <Divider sx={{ borderColor: 'rgba(54, 48, 98, 0.1)', mb: 3 }} />
                        <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                            Provide detailed information about the fund, investment team, and track record.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Accordion
                                elevation={0}
                                sx={{
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '12px !important',
                                    mb: 2,
                                    overflow: 'hidden',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        borderColor: '#363062',
                                        borderLeft: '6px solid #363062'
                                    }
                                }}
                                expanded={expanded === "1"}
                                onChange={handleChange("1")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "1" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "1" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "1" ? '#363062' : '#f0f0f0',
                                            color: expanded === "1" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>1</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "1" ? '#363062' : '#444'
                                        }}>
                                            Fund Overview
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <PrelimApplicationData
                                            prelimApplicationId={prelimApplicationId}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                elevation={0}
                                sx={{
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '12px !important',
                                    mb: 2,
                                    overflow: 'hidden',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        borderColor: '#363062',
                                        borderLeft: '6px solid #363062'
                                    }
                                }}
                                expanded={expanded === "2"}
                                onChange={handleChange("2")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "2" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "2" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "2" ? '#363062' : '#f0f0f0',
                                            color: expanded === "2" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>2</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "2" ? '#363062' : '#444'
                                        }}>
                                            Details of Investment team (At partner level)
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentPartner prelimApplicationId={Number(prelimApplicationId)} />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                elevation={0}
                                sx={{
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '12px !important',
                                    mb: 2,
                                    overflow: 'hidden',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        borderColor: '#363062',
                                        borderLeft: '6px solid #363062'
                                    }
                                }}
                                expanded={expanded === "3"}
                                onChange={handleChange("3")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "3" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "3" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "3" ? '#363062' : '#f0f0f0',
                                            color: expanded === "3" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>3</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "3" ? '#363062' : '#444'
                                        }}>
                                            Details of Contributor to the Fund
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <ContributorDetails prelimApplicationId={Number(prelimApplicationId)} />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                elevation={0}
                                sx={{
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '12px !important',
                                    mb: 2,
                                    overflow: 'hidden',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        borderColor: '#363062',
                                        borderLeft: '6px solid #363062'
                                    }
                                }}
                                expanded={expanded === "4"}
                                onChange={handleChange("4")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "4" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "4" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "4" ? '#363062' : '#f0f0f0',
                                            color: expanded === "4" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>4</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "4" ? '#363062' : '#444'
                                        }}>
                                            Details of Investment team (at Associate level)
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentAssociate prelimApplicationId={Number(prelimApplicationId)} />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                elevation={0}
                                sx={{
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '12px !important',
                                    mb: 2,
                                    overflow: 'hidden',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        borderColor: '#363062',
                                        borderLeft: '6px solid #363062'
                                    }
                                }}
                                expanded={expanded === "5"}
                                onChange={handleChange("5")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "5" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "5" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "5" ? '#363062' : '#f0f0f0',
                                            color: expanded === "5" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>5</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "5" ? '#363062' : '#444'
                                        }}>
                                            Investments made, if any from the current Fund
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentPast prelimApplicationId={Number(prelimApplicationId)} />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                elevation={0}
                                sx={{
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '12px !important',
                                    mb: 2,
                                    overflow: 'hidden',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        borderColor: '#363062',
                                        borderLeft: '6px solid #363062'
                                    }
                                }}
                                expanded={expanded === "6"}
                                onChange={handleChange("6")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "6" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "6" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "6" ? '#363062' : '#f0f0f0',
                                            color: expanded === "6" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>6</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "6" ? '#363062' : '#444'
                                        }}>
                                            Past investment track record of the AMC
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <Box sx={{ border: '1px dashed #ccc', borderRadius: '8px', p: 2, mb: 2, backgroundColor: '#fafafa' }}>
                                            <Button
                                                variant="text"
                                                href="/templates/SASF_Fund Track Record Template.xlsx"
                                                sx={{ color: '#363062', fontWeight: 600 }}
                                            >
                                                Download Template
                                            </Button>
                                        </Box>
                                        <Box>
                                            <UploadComponents id={`pastInvestmentTrackRecord${id}`} signed={false} />
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                    </Grid>

                    {Number(prelimApplicationId) ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button
                                onClick={(e) => handleClick(e, "next")}
                                endIcon={<ArrowRightIcon />}
                                variant="contained"
                                sx={{
                                    backgroundColor: '#363062',
                                    px: 4,
                                    py: 1.2,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(54, 48, 98, 0.3)',
                                    '&:hover': {
                                        backgroundColor: '#2a254d'
                                    }
                                }}
                            >
                                Profile
                            </Button>
                        </Box>
                    ) : <></>}
                </CardContent>
            </Card>
        </Box>
    );
}


export default Fund;
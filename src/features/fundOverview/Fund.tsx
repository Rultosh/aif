import { Card, Divider, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button } from "@mui/material";
import FundOverviewData from "./subsections/fundOverviewData/FundOverviewData";
import InvestmentPartner from "./subsections/fundOverviewData/investmentPartner/InvestmentPartner";
import InvestmentStrategy from "./subsections/fundOverviewData/investmentStrategy/InvestmentStrategy";
import ContributorDetails from "./subsections/fundOverviewData/contributorDetails/ContributorDetails";
import InvestmentAssociate from "./subsections/fundOverviewData/investmentAssociate/InvestmentAssociate";
import InvestmentPast from "./subsections/fundOverviewData/investmentPast/InvestmentPast";
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import PrelimApplicationData from "./subsections/fundOverviewData/PrelimApplication";
import { clearPrelimApplication, selectPrelimApplication } from "./subsections/fundOverviewData/prelimApplicationDataSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FetchStatus } from "../../lib/api-status/IStatus";
import UploadComponents from "../DetailedApplicationComponent/subsections/uploadComponents";
import DealFlow from "./subsections/fundOverviewData/dealFlow/DealFlow";
import MIS from "./subsections/fundOverviewData/mis/MIS";
import Others from "./subsections/fundOverviewData/others/Others";
import SaveIcon from '@mui/icons-material/Save';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

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
            if (isExpanded) {
                setTimeout(() => {
                    const nextAccordion = accordionRefs[panel as keyof typeof accordionRefs]?.current;
                    if (nextAccordion) {
                        nextAccordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            }
        };


    const prelimRef = useRef<any>(null);
    const strategyRef = useRef<any>(null);
    const dealFlowRef = useRef<any>(null);
    const othersRef = useRef<any>(null);
    const misRef = useRef<any>(null);

    const accordionRefs = {
        "1": useRef<HTMLDivElement>(null),
        "2": useRef<HTMLDivElement>(null),
        "3": useRef<HTMLDivElement>(null),
        "4": useRef<HTMLDivElement>(null),
        "5": useRef<HTMLDivElement>(null),
        "6": useRef<HTMLDivElement>(null),
        "7": useRef<HTMLDivElement>(null),
        "8": useRef<HTMLDivElement>(null),
        "9": useRef<HTMLDivElement>(null),
        "10": useRef<HTMLDivElement>(null),
    };

    const handleAccordionSaveAndContinue = async (currentPanel: string, nextPanel: string | null, ref: any) => {
        let isSectionValid = true;
        if (ref && ref.current && ref.current.submit) {
            isSectionValid = await ref.current.submit();
        }

        if (isSectionValid) {
            if (nextPanel) {
                setExpanded(nextPanel);
                // Scroll to the next accordion header
                setTimeout(() => {
                    const nextAccordion = accordionRefs[nextPanel as keyof typeof accordionRefs]?.current;
                    if (nextAccordion) {
                        nextAccordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            } else {
                // If it's the last panel, go to next page
                navigate(`/preliminary/${prelimApplicationId}/profile`);
            }
        }
    };

    const handleClickSave = async () => {
        const results = await Promise.all([
            prelimRef.current?.submit(),
            strategyRef.current?.submit(),
            dealFlowRef.current?.submit(),
            othersRef.current?.submit(),
            misRef.current?.submit()
        ]);

        console.log("allValid", results);

        const allValid = results.every(res => res === true);
        if (!allValid) {
            const firstInvalidIndex = results.findIndex(res => res === false);
            const panels = ["1", "2", "7", "9", "10"];
            if (firstInvalidIndex !== -1) {
                setExpanded(panels[firstInvalidIndex]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        return results;
    };

    const handleClick = async (ev: any, navTo: string) => {
        if (navTo === 'previous') {
            navigate(`/preliminary/${prelimApplicationId}/selfrating`)
        } else if (navTo === 'next') {
            const results = await handleClickSave();
            const allValid = results.every(res => res === true);

            if (allValid) {
                navigate(`/preliminary/${prelimApplicationId}/declaration`)
            } else {
                console.log("allValid", allValid);
            }
        }
    }
    return (
        <Box className="formAnimation" sx={{ pb: 5 }}>
            {/* {Number(prelimApplicationId) ? (
                <Button
                    onClick={(e) => handleClick(e, "next")}
                    variant="contained"
                    sx={{
                        position: 'fixed',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2000,
                        backgroundColor: '#363062',
                        color: 'white',
                        px: 3,
                        py: 2,
                        borderRadius: '20px 0 0 20px',
                        textTransform: 'none',
                        fontWeight: 800,
                        fontSize: '1rem',
                        boxShadow: '-4px 0 15px rgba(54, 48, 98, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#2a254d',
                            paddingRight: 4,
                            boxShadow: '-6px 0 20px rgba(54, 48, 98, 0.6)',
                        }
                    }}
                >
                    <ArrowRightIcon sx={{ fontSize: '2rem', mb: -0.5 }} />
                    <Box sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        Save and Continue
                    </Box>
                </Button>
            ) : null} */}


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
                                ref={accordionRefs["1"]}
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
                                            ref={prelimRef}
                                            prelimApplicationId={prelimApplicationId}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("1", "2", null)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["2"]}
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
                                            Investment Strategy
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentStrategy
                                            ref={strategyRef}
                                            prelimApplicationId={prelimApplicationId}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("2", "3", null)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["3"]}
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
                                            Details of Key Investment team (At Partner Level)
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentPartner prelimApplicationId={Number(prelimApplicationId)} />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAccordionSaveAndContinue("3", "4", null)}
                                                sx={{ backgroundColor: '#363062', color: 'white' }}
                                            >
                                                Save and Continue
                                            </Button>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["4"]}
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
                                            Details of Key Investment team (At Associate Level)
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentAssociate prelimApplicationId={Number(prelimApplicationId)} />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAccordionSaveAndContinue("4", "5", null)}
                                                sx={{ backgroundColor: '#363062', color: 'white' }}
                                            >
                                                Save and Continue
                                            </Button>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["5"]}
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
                                            Details of Contributor to the Fund
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <ContributorDetails prelimApplicationId={Number(prelimApplicationId)} />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAccordionSaveAndContinue("5", "6", null)}
                                                sx={{ backgroundColor: '#363062', color: 'white' }}
                                            >
                                                Save and Continue
                                            </Button>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["6"]}
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
                                            Investments made, if any from the current Fund
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentPast prelimApplicationId={Number(prelimApplicationId)} />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAccordionSaveAndContinue("6", "7", null)}
                                                sx={{ backgroundColor: '#363062', color: 'white' }}
                                            >
                                                Save and Continue
                                            </Button>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["7"]}
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
                                expanded={expanded === "7"}
                                onChange={handleChange("7")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "7" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "7" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "7" ? '#363062' : '#f0f0f0',
                                            color: expanded === "7" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>7</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "7" ? '#363062' : '#444'
                                        }}>
                                            Deal Flow
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <DealFlow
                                            ref={dealFlowRef}
                                            prelimApplicationId={String(prelimApplicationId)}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("7", "8", null)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["8"]}
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
                                expanded={expanded === "8"}
                                onChange={handleChange("8")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "8" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "8" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "8" ? '#363062' : '#f0f0f0',
                                            color: expanded === "8" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>8</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "8" ? '#363062' : '#444'
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
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAccordionSaveAndContinue("8", "9", null)}
                                                sx={{ backgroundColor: '#363062', color: 'white' }}
                                            >
                                                Save and Continue
                                            </Button>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}

                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["9"]}
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
                                expanded={expanded === "9"}
                                onChange={handleChange("9")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "9" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "9" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "9" ? '#363062' : '#f0f0f0',
                                            color: expanded === "9" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>9</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "9" ? '#363062' : '#444'
                                        }}>
                                            MIS
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <MIS
                                            ref={misRef}
                                            prelimApplicationId={String(prelimApplicationId)}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("9", "10", null)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {Number(prelimApplicationId) ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["10"]}
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
                                expanded={expanded === "10"}
                                onChange={handleChange("10")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "10" ? '#363062' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "10" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "10" ? '#363062' : '#f0f0f0',
                                            color: expanded === "10" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>10</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "10" ? '#363062' : '#444'
                                        }}>
                                            Others
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <Others
                                            ref={othersRef}
                                            prelimApplicationId={String(prelimApplicationId)}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("10", null, null)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                    </Grid>


                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            onClick={(e) => handleClick(e, "previous")}
                            startIcon={<ArrowLeftIcon />}
                            variant="outlined"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: 3,
                                fontWeight: 600,
                                color: '#363062',
                                borderColor: '#363062',
                                '&:hover': {
                                    borderColor: '#4d4585',
                                    backgroundColor: 'rgba(54, 48, 98, 0.04)'
                                }
                            }} >
                            Back to Initial Assessment
                        </Button>



                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button
                                onClick={(e) => handleClick(e, "next")}
                                endIcon={<ArrowRightIcon />}
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 700,
                                    backgroundColor: '#363062',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                                    '&:hover': {
                                        backgroundColor: '#4d4585',
                                        boxShadow: '0 6px 16px rgba(54, 48, 98, 0.3)'
                                    }
                                }} >
                                Save & Continue to Declaration
                            </Button>
                        </Box>
                    </Box>

                </CardContent>
            </Card>
        </Box>
    );
}


export default Fund;
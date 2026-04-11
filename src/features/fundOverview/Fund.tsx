import { Card, Divider, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import FundOverviewData from "./subsections/fundOverviewData/FundOverviewData";
import InvestmentPartner from "./subsections/fundOverviewData/investmentPartner/InvestmentPartner";
import InvestmentStrategy from "./subsections/fundOverviewData/investmentStrategy/InvestmentStrategy";
import ContributorDetails from "./subsections/fundOverviewData/contributorDetails/ContributorDetails";
import InvestmentAssociate from "./subsections/fundOverviewData/investmentAssociate/InvestmentAssociate";
import InvestmentPast from "./subsections/fundOverviewData/investmentPast/InvestmentPast";
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import PrelimApplicationData from "./subsections/fundOverviewData/PrelimApplication";
import { clearPrelimApplication, selectPrelimApplication, updatePrelimApplicationAsync } from "./subsections/fundOverviewData/prelimApplicationDataSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FetchStatus } from "../../lib/api-status/IStatus";
import UploadComponents from "../DetailedApplicationComponent/subsections/uploadComponents";
import DealFlow from "./subsections/fundOverviewData/dealFlow/DealFlow";
import LpAdvisoryGovernanceInvestmentCommittee from "./subsections/fundOverviewData/lpAdvisoryGovernanceInvestmentCommittee/LpAdvisoryGovernanceInvestmentCommittee";
import Others from "./subsections/fundOverviewData/others/Others";
import SaveIcon from '@mui/icons-material/Save';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { markFundStepComplete } from "./wizardProgress";

export const Fund = (props: any) => {

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [prelimApplicationId, setPrelimApplicationId] = useState(id);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const effectivePrelimId = String(
        prelimApplicationState.prelimApplication?.id || prelimApplicationId || id || ''
    );
    const [hasInvestment, setHasInvestment] = useState(false);
    useEffect(() => {
        setHasInvestment(prelimApplicationState.prelimApplication.hasInvestment);
    }, [prelimApplicationState.prelimApplication.hasInvestment]);

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
    const investmentPartnerRef = useRef<any>(null);
    const investmentAssociateRef = useRef<any>(null);
    const investmentPastRef = useRef<any>(null);
    const dealFlowRef = useRef<any>(null);
    const lpAdvisoryGovernanceInvestmentCommitteeRef = useRef<any>(null);
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

    /** Accordion panel ids matching validateAllFundSections order (all fund accordions 1–7). */
    const FUND_MANDATORY_PANEL_ORDER = ["1", "2", "3", "4", "5", "6", "7"];

    const validateAllFundSections = async (): Promise<boolean[]> => {
        const [r1, r2, r3, r4, r6, r7] = await Promise.all([
            prelimRef.current?.submit?.() ?? Promise.resolve(true),
            strategyRef.current?.submit?.() ?? Promise.resolve(true),
            investmentPartnerRef.current?.submit?.() ?? Promise.resolve(true),
            investmentAssociateRef.current?.submit?.() ?? Promise.resolve(true),
            lpAdvisoryGovernanceInvestmentCommitteeRef.current?.submit?.() ?? Promise.resolve(true),
            dealFlowRef.current?.submit?.() ?? Promise.resolve(true),
        ]);
        const r5 = hasInvestment
            ? await (investmentPastRef.current?.submit?.() ?? Promise.resolve(false))
            : true;
        return [r1, r2, r3, r4, r5, r6, r7];
    };

    const expandFirstFailedMandatoryPanel = (validations: boolean[]) => {
        const firstInvalidIndex = validations.findIndex((res) => res === false);
        if (firstInvalidIndex === -1) return;
        const panel = FUND_MANDATORY_PANEL_ORDER[firstInvalidIndex];
        setExpanded(panel);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                const validations = await validateAllFundSections();
                if (!validations.every((res) => res === true)) {
                    expandFirstFailedMandatoryPanel(validations);
                    return;
                }
                markFundStepComplete(effectivePrelimId);
                navigate(`/preliminary/${prelimApplicationId}/declaration`);
            }
        }
    };

    const handleClickSave = async () => {
        const validations = await validateAllFundSections();
        const sectionNames = [
            "Fund Overview",
            "Investment Strategy",
            "Investment Team (KMP)",
            "Investment Team (other than KMP)",
            "Past investments",
            "LP Advisory / Governance / IC",
            "Deal Flow/MIS",
        ];
        validations.forEach((isValid, index) => {
            if (isValid === false) {
                console.log(
                    `Validation failed in section: ${sectionNames[index]} (Panel ${FUND_MANDATORY_PANEL_ORDER[index]})`
                );
            }
        });
        if (!validations.every((res) => res === true)) {
            expandFirstFailedMandatoryPanel(validations);
        }
        return validations;
    };

    const handleNextClick = async (ev: any) => {
        setIsLoading(true);
        try {
            if (ev?.navTo === 'previous') {
                navigate(`/preliminary/${prelimApplicationId}/selfrating`)
            } else {
                const results = await handleClickSave();
                const allValid = results.every(res => res === true);

                if (allValid) {
                    markFundStepComplete(effectivePrelimId);
                    navigate(`/preliminary/${prelimApplicationId}/declaration`)
                } else {
                    console.log("allValid", allValid);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmitClick = async () => {
        setIsLoading(true);
        try {
            const results = await handleClickSave();
            const allValid = results.every(res => res === true);
            if (allValid) {
                setIsSubmitted(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const internalButtonSx = {
        backgroundColor: '#FF671F',
        color: 'white',
        textTransform: 'none',
        borderRadius: '8px',
        px: 4,
        '&:hover': {
            border: '1px solid #FF671F',
            color: '#FF671F',
            backgroundColor: 'rgb(255 103 30 / 19%)'
        }
    };

    const [actionUid] = useState(uuid());
    const updateHasInvestment = async (hasInvestment: boolean) => {
        setHasInvestment(hasInvestment)
        if (Number(prelimApplicationId)) {
            await dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, { ...prelimApplicationState.prelimApplication, hasInvestment })));
        }
    };

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
                        Save & Continue
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
                        <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                            <b>Provide detailed information about the fund, investment team, and track record (All Fields are mandatory).</b>
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
                                        borderColor: '#000080',
                                        borderLeft: '6px solid #000080'
                                    }
                                }}
                                expanded={expanded === "1"}
                                onChange={handleChange("1")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "1" ? '#000080' : '#666' }} />}
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
                                            backgroundColor: expanded === "1" ? '#000080' : '#f0f0f0',
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
                                            color: expanded === "1" ? '#000080' : '#444'
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
                                        borderColor: '#000080',
                                        borderLeft: '6px solid #000080'
                                    }
                                }}
                                expanded={expanded === "2"}
                                onChange={handleChange("2")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "2" ? '#000080' : '#666' }} />}
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
                                            backgroundColor: expanded === "2" ? '#000080' : '#f0f0f0',
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
                                            color: expanded === "2" ? '#000080' : '#444'
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
                                        borderColor: '#000080',
                                        borderLeft: '6px solid #000080'
                                    }
                                }}
                                expanded={expanded === "3"}
                                onChange={handleChange("3")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "3" ? '#000080' : '#666' }} />}
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
                                            backgroundColor: expanded === "3" ? '#000080' : '#f0f0f0',
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
                                            color: expanded === "3" ? '#000080' : '#444'
                                        }}>
                                            Details Of Investment Team (At KMP Level)
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentPartner
                                            ref={investmentPartnerRef}
                                            prelimApplicationId={Number(prelimApplicationId)}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAccordionSaveAndContinue("3", "4", null)}
                                                sx={internalButtonSx}
                                            >
                                                Save & Continue
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
                                        borderColor: '#000080',
                                        borderLeft: '6px solid #000080'
                                    }
                                }}
                                expanded={expanded === "4"}
                                onChange={handleChange("4")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "4" ? '#000080' : '#666' }} />}
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
                                            backgroundColor: expanded === "4" ? '#000080' : '#f0f0f0',
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
                                            color: expanded === "4" ? '#000080' : '#444'
                                        }}>
                                            Details of Investment Team Member (Other than KMP) – Maximum 5 Senior Members
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <InvestmentAssociate
                                            ref={investmentAssociateRef}
                                            prelimApplicationId={Number(prelimApplicationId)}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAccordionSaveAndContinue("4", "5", null)}
                                                sx={internalButtonSx}
                                            >
                                                Save & Continue
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
                                        borderColor: '#000080',
                                        borderLeft: '6px solid #000080'
                                    }
                                }}
                                expanded={expanded === "5"}
                                onChange={handleChange("5")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "5" ? '#000080' : '#666' }} />}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        backgroundColor: expanded === "5" ? 'rgba(54, 48, 98, 0.02)' : 'transparent',
                                        '& .MuiAccordionSummary-content': {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === "5" ? '#000080' : '#f0f0f0',
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
                                            color: expanded === "5" ? '#000080' : '#444'
                                        }}>
                                            Have any investments been undertaken by the Fund?
                                        </Typography>
                                    </Box>
                                    <Box onClick={(e) => e.stopPropagation()}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={hasInvestment}
                                                    onChange={(e) => updateHasInvestment(e.target.checked)}
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiSwitch-switchBase': {
                                                            color: '#FF671F',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#FF671F',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#FF671F',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: hasInvestment ? '#000080' : '#666' }}>
                                                    {hasInvestment ? "Yes" : "No"}
                                                </Typography>
                                            }
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        {hasInvestment ? (
                                            <>
                                                <InvestmentPast
                                                    ref={investmentPastRef}
                                                    prelimApplicationId={Number(prelimApplicationId)}
                                                    hasInvestment={hasInvestment}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleAccordionSaveAndContinue("5", "6", null)}
                                                        sx={internalButtonSx}
                                                    >
                                                        Save & Continue
                                                    </Button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Select 'Yes' to view or add investments.
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleAccordionSaveAndContinue("5", "6", null)}
                                                        sx={internalButtonSx}
                                                    >
                                                        Continue
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
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
                                        borderColor: '#000080',
                                        borderLeft: '6px solid #000080'
                                    }
                                }}
                                expanded={expanded === "6"}
                                onChange={handleChange("6")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "6" ? '#000080' : '#666' }} />}
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
                                            backgroundColor: expanded === "6" ? '#000080' : '#f0f0f0',
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
                                            color: expanded === "6" ? '#000080' : '#444'
                                        }}>
                                            Limited Partner Advisory Committee (LPAC), Governance and Investment Committee (IC)
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <LpAdvisoryGovernanceInvestmentCommittee
                                            ref={lpAdvisoryGovernanceInvestmentCommitteeRef}
                                            prelimApplicationId={String(prelimApplicationId)}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("6", "7", null)}
                                        />
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
                                        borderColor: '#000080',
                                        borderLeft: '6px solid #000080'
                                    }
                                }}
                                expanded={expanded === "7"}
                                onChange={handleChange("7")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "7" ? '#000080' : '#666' }} />}
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
                                            backgroundColor: expanded === "7" ? '#000080' : '#f0f0f0',
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
                                            color: expanded === "7" ? '#000080' : '#444'
                                        }}>
                                            Deal Flow/MIS
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                    <Box sx={{ pt: 2 }}>
                                        <DealFlow
                                            ref={dealFlowRef}
                                            prelimApplicationId={String(prelimApplicationId)}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("7", null, null)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}

                        {/* {Number(prelimApplicationId) ? <Grid item xs={12}>
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
                                        borderColor: '#000080',
                                        borderLeft: '6px solid #000080'
                                    }
                                }}
                                expanded={expanded === "8"}
                                onChange={handleChange("8")}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: expanded === "8" ? '#000080' : '#666' }} />}
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
                                            backgroundColor: expanded === "9" ? '#000080' : '#f0f0f0',
                                            color: expanded === "9" ? 'white' : '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>8</Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            color: expanded === "8" ? '#000080' : '#444'
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
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("8", null, null)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>} */}
                    </Grid>


                    {/* <Divider sx={{ mb: 3 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
                    {/* <Button
                            onClick={(e) => handleNextClick({ navTo: 'previous' })}
                            startIcon={<ArrowLeftIcon />}
                            variant="outlined"
                            disabled={isLoading}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: 3,
                                fontWeight: 600,
                                color: '#000080',
                                borderColor: '#000080',
                                '&:hover': {
                                    borderColor: '#4d4585',
                                    backgroundColor: 'rgba(54, 48, 98, 0.04)'
                                }
                            }} >
                            Back To Initial Assessment
                        </Button> */}



                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {!isSubmitted ? (
                                <Button
                                    onClick={handleSubmitClick}
                                    variant="contained"
                                    disabled={isLoading}
                                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 6,
                                        py: 1.5,
                                        fontWeight: 700,
                                        backgroundColor: '#FF671F',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                                        '&:hover': {
                                            border: '1px solid #FF671F',
                                            color: '#FF671F',
                                            backgroundColor: 'rgb(255 103 30 / 19%)'
                                        }
                                    }}
                                >
                                    Save & Continue
                                </Button>
                            ) : (
                                <Button
                                    onClick={(e) => handleNextClick({ navTo: 'next' })}
                                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                                    endIcon={!isLoading && <ArrowRightIcon />}
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 700,
                                        backgroundColor: '#FF671F',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                                        '&:hover': {
                                            border: '1px solid #FF671F',
                                            color: '#FF671F',
                                            backgroundColor: 'rgb(255 103 30 / 19%)'
                                        }
                                    }} >
                                    Save & Continue To Declaration
                                </Button>
                            )}
                        </Box> */}
                    {/* </Box> */}

                </CardContent>
            </Card>

            {/* Sticky Save Button */}
            <Box
                sx={{
                    position: 'fixed',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
            >
                <Button
                    onClick={(e) => !isSubmitted ? handleSubmitClick() : handleNextClick({ navTo: 'next' })}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                        minWidth: 'auto',
                        width: isLoading ? '80px' : '48px',
                        height: '48px',
                        borderRadius: '12px 0 0 12px',
                        backgroundColor: '#FF671F',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        boxShadow: '-2px 0 10px rgba(54, 48, 98, 0.3)',
                        '&:hover': {
                            border: '1px solid #FF671F',
                            color: '#FF671F',
                            backgroundColor: '#ffffff'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isLoading && <CircularProgress size={20} color="inherit" />}
                        <SaveIcon />
                    </Box>
                </Button>
            </Box>
        </Box>
    );
}


export default Fund;
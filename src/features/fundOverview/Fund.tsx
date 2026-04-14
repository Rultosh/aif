import { Alert, Backdrop, Card, Divider, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, CircularProgress, Switch, FormControlLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import FundOverviewData from "./subsections/fundOverviewData/FundOverviewData";
import InvestmentPartner from "./subsections/fundOverviewData/investmentPartner/InvestmentPartner";
import InvestmentStrategy from "./subsections/fundOverviewData/investmentStrategy/InvestmentStrategy";
import ContributorDetails from "./subsections/fundOverviewData/contributorDetails/ContributorDetails";
import InvestmentAssociate from "./subsections/fundOverviewData/investmentAssociate/InvestmentAssociate";
import InvestmentPast from "./subsections/fundOverviewData/investmentPast/InvestmentPast";
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useState, useEffect, useRef, useCallback } from "react";
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
import { opaqueInfoToastAlertSx } from "../../lib/ui/opaqueInfoToastAlertSx";

export const Fund = (props: any) => {

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [prelimApplicationId, setPrelimApplicationId] = useState(id);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    /** First positive numeric id among Redux, local state, and route (avoids literal "undefined" from String(undefined) blocking the URL id). */
    const pickPositivePrelimIdString = (): string => {
        const sources: unknown[] = [
            prelimApplicationState.prelimApplication?.id,
            prelimApplicationId,
            id,
        ];
        for (const s of sources) {
            if (s === undefined || s === null) continue;
            const str = String(s).trim();
            if (!str || str === 'undefined' || str === 'null') continue;
            const n = Number(str);
            if (!Number.isNaN(n) && n > 0) return str;
        }
        return '';
    };
    const effectivePrelimId = pickPositivePrelimIdString();
    /** Sections 2–7 mount and validate only once we have a numeric prelim id (Redux, URL, or local state). */
    const hasNumericFundPrelimId = effectivePrelimId.length > 0 && !Number.isNaN(Number(effectivePrelimId));
    const [hasInvestment, setHasInvestment] = useState(false);
    useEffect(() => {
        setHasInvestment(prelimApplicationState.prelimApplication.hasInvestment);
    }, [prelimApplicationState.prelimApplication.hasInvestment]);

    useEffect(() => {
        if (!hasInvestment) {
            setPastInvestmentSectionHasErrors(false);
        }
    }, [hasInvestment]);

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
        const pid = prelimApplicationState.prelimApplication?.id;
        if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE && pid != null) {
            const n = Number(pid);
            if (!Number.isNaN(n) && n > 0) {
                setPrelimApplicationId(String(pid));
            }
        }
    }, [prelimApplicationState.status.fetchStatus, prelimApplicationState.prelimApplication?.id])

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
    const [fundCompletenessToastOpen, setFundCompletenessToastOpen] = useState(false);
    /** Panel ids ("1"–"7") that failed the last full-fund validation; shown with a mild red tint. */
    const [fundPanelValidationErrors, setFundPanelValidationErrors] = useState<string[]>([]);
    /** Deal Flow/MIS: react-hook-form or document errors while editing (not only full-fund validation). */
    const [dealFlowSectionHasErrors, setDealFlowSectionHasErrors] = useState(false);
    /** Section 3: KMP team — too few rows or mandatory document gaps. */
    const [investmentPartnerSectionHasErrors, setInvestmentPartnerSectionHasErrors] = useState(false);
    /** Section 4: non-KMP team — missing mandatory uploads or more than 5 rows. */
    const [investmentAssociateSectionHasErrors, setInvestmentAssociateSectionHasErrors] = useState(false);
    /** Section 5: past investments when "Yes" — no rows yet. */
    const [pastInvestmentSectionHasErrors, setPastInvestmentSectionHasErrors] = useState(false);
    /** Section 2: strategy form errors or missing Risk Assessment upload (file server). */
    const [investmentStrategySectionHasErrors, setInvestmentStrategySectionHasErrors] = useState(false);
    const [fundValidatingAll, setFundValidatingAll] = useState(false);

    const reportDealFlowSectionErrors = useCallback((hasErrors: boolean) => {
        setDealFlowSectionHasErrors(hasErrors);
    }, []);

    const reportInvestmentPartnerSectionErrors = useCallback((hasErrors: boolean) => {
        setInvestmentPartnerSectionHasErrors(hasErrors);
    }, []);

    const reportInvestmentAssociateSectionErrors = useCallback((hasErrors: boolean) => {
        setInvestmentAssociateSectionHasErrors(hasErrors);
    }, []);

    const reportPastInvestmentSectionErrors = useCallback((hasErrors: boolean) => {
        setPastInvestmentSectionHasErrors(hasErrors);
    }, []);

    const reportInvestmentStrategySectionErrors = useCallback((hasErrors: boolean) => {
        setInvestmentStrategySectionHasErrors(hasErrors);
    }, []);

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

    const isFundSectionSubmitOk = (v: unknown) =>
        v === true || (typeof v === 'object' && v !== null && (v as { ok?: boolean }).ok === true);

    /**
     * Full-fund result is driven only by each section’s `submit({ silent: true })` outcome.
     * Do not OR in live accordion refs here — they update in effects and can stay “stale true” while
     * `submit()` already passed, which incorrectly tinted section 2 when failures were only in 3 or 7.
     */
    const mergeLiveAccordionErrorsIntoValidations = (v: boolean[]): boolean[] => [...v];

    const FUND_COMPLETENESS_TOAST_TEXT =
        'Some fund sections still have errors or missing mandatory documents. Review each section from the top (red highlights show where to fix). Choose Stay to keep working here, or Continue to go to the declaration step anyway.';

    const fundAccordionShellSx = (panelId: string) => {
        /** Prefer the last full-fund failure list so stale per-section flags (effects not yet cleared) do not re-tint the wrong accordion — e.g. only panel 7 in `fundPanelValidationErrors` while partner state still says “has errors”. */
        const liveErr =
            fundPanelValidationErrors.length === 0 &&
            ((panelId === "2" && investmentStrategySectionHasErrors) ||
                (panelId === "3" && investmentPartnerSectionHasErrors) ||
                (panelId === "4" && investmentAssociateSectionHasErrors) ||
                (panelId === "5" && pastInvestmentSectionHasErrors) ||
                (panelId === "7" && dealFlowSectionHasErrors));
        const hasErr = fundPanelValidationErrors.includes(panelId) || liveErr;
        return {
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px !important',
            mb: 2,
            overflow: 'hidden',
            ...(hasErr
                ? {
                    backgroundColor: 'rgba(211, 47, 47, 0.055)',
                    borderColor: 'rgba(211, 47, 47, 0.22)',
                }
                : {}),
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                borderColor: '#000080',
                borderLeft: '6px solid #000080',
                ...(hasErr ? { backgroundColor: 'rgba(211, 47, 47, 0.045)' } : {}),
            },
        };
    };

    const applyFundCompletenessFailure = (validations: boolean[]) => {
        const failedIds = FUND_MANDATORY_PANEL_ORDER.filter((_, i) => validations[i] === false);
        setFundPanelValidationErrors(failedIds);
        setFundCompletenessToastOpen(true);
        const firstFailed = failedIds[0];
        if (firstFailed) {
            setExpanded(firstFailed);
            setTimeout(() => {
                accordionRefs[firstFailed as keyof typeof accordionRefs]?.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 150);
        }
    };

    const stayReviewFundSections = () => {
        setFundCompletenessToastOpen(false);
    };

    const continueToDeclarationDespiteFundErrors = () => {
        setFundCompletenessToastOpen(false);
        setFundPanelValidationErrors([]);
        markFundStepComplete(effectivePrelimId);
        navigate(`/preliminary/${prelimApplicationId}/declaration`);
    };

    /** When validating all sections at once, do not run per-section `onSaveSuccess` (avoids re-entering accordion flow in parallel). */
    const SILENT_VALIDATE = { silent: true } as const;

    /** Validates panels 1→7 in order (top to bottom). Each section runs form + document checks for that section only. */
    const validateAllFundSections = async (): Promise<boolean[]> => {
        setFundValidatingAll(true);
        const safeDetailSectionSubmit = async (ref: { current: any }): Promise<boolean> => {
            if (!hasNumericFundPrelimId) return true;
            const submitFn = ref.current?.submit as ((o?: { silent?: boolean }) => Promise<unknown>) | undefined;
            if (typeof submitFn !== 'function') return false;
            try {
                return isFundSectionSubmitOk(await submitFn(SILENT_VALIDATE));
            } catch {
                return false;
            }
        };
        try {
            let r1 = true;
            try {
                r1 = isFundSectionSubmitOk(
                    await (prelimRef.current?.submit?.(SILENT_VALIDATE) ?? Promise.resolve(true))
                );
            } catch {
                r1 = false;
            }
            const r2 = await safeDetailSectionSubmit(strategyRef);
            const r3 = await safeDetailSectionSubmit(investmentPartnerRef);
            const r4 = await safeDetailSectionSubmit(investmentAssociateRef);
            const r5 = hasInvestment ? await safeDetailSectionSubmit(investmentPastRef) : true;
            const r6 = await safeDetailSectionSubmit(lpAdvisoryGovernanceInvestmentCommitteeRef);
            const r7 = await safeDetailSectionSubmit(dealFlowRef);
            return [r1, r2, r3, r4, r5, r6, r7];
        } finally {
            setFundValidatingAll(false);
        }
    };

    /** Runs sequential validation, then re-merges after a microtask so child refs/state from effects are current. */
    const runMergedFullFundValidation = async (): Promise<boolean[]> => {
        try {
            const raw = await validateAllFundSections();
            await new Promise<void>((resolve) => {
                queueMicrotask(() => resolve());
            });
            return mergeLiveAccordionErrorsIntoValidations(raw);
        } catch (e) {
            console.error('validateAllFundSections failed', e);
            return FUND_MANDATORY_PANEL_ORDER.map(() => false);
        }
    };

    /** Panels whose Save & Continue is a raw button (no prior child submit); must run `submit()` here. */
    const FUND_PANELS_WITH_BUTTON_ONLY_CONTINUE = new Set(["3", "4", "5"]);

    const getFundPanelSubmitRef = (panelId: string) => {
        const map: Record<string, React.MutableRefObject<any>> = {
            "1": prelimRef,
            "2": strategyRef,
            "3": investmentPartnerRef,
            "4": investmentAssociateRef,
            "5": investmentPastRef,
            "6": lpAdvisoryGovernanceInvestmentCommitteeRef,
            "7": dealFlowRef,
            "8": othersRef,
        };
        return map[panelId];
    };

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);

            if (isExpanded && fundPanelValidationErrors.includes(panel)) {
                const submitRef = getFundPanelSubmitRef(panel);
                void (async () => {
                    const raw = await submitRef?.current?.submit?.(SILENT_VALIDATE);
                    if (isFundSectionSubmitOk(raw ?? false)) {
                        setFundPanelValidationErrors((prev) => prev.filter((id) => id !== panel));
                    }
                })();
            }
        };

    const handleAccordionSaveAndContinue = async (currentPanel: string, nextPanel: string | null, ref: any) => {
        const resolvedRef =
            ref && ref.current
                ? ref
                : FUND_PANELS_WITH_BUTTON_ONLY_CONTINUE.has(currentPanel)
                    ? getFundPanelSubmitRef(currentPanel)
                    : null;

        let isSectionValid = true;
        let submitResult: unknown = true;
        if (resolvedRef?.current?.submit) {
            submitResult = await resolvedRef.current.submit();
            isSectionValid = isFundSectionSubmitOk(submitResult);
        }

        if (!isSectionValid) {
            const highlightPanel =
                typeof submitResult === 'object' &&
                submitResult !== null &&
                'highlightPanel' in submitResult &&
                typeof (submitResult as { highlightPanel?: string }).highlightPanel === 'string'
                    ? (submitResult as { highlightPanel: string }).highlightPanel
                    : currentPanel;
            setFundPanelValidationErrors((prev) => Array.from(new Set([...prev, highlightPanel])));
            if (currentPanel === '7' && (highlightPanel === '3' || highlightPanel === '4')) {
                setExpanded(highlightPanel);
                setTimeout(() => {
                    const refKey = highlightPanel as '3' | '4';
                    accordionRefs[refKey]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
            return;
        }

        if (nextPanel) {
            setFundCompletenessToastOpen(false);
            setFundPanelValidationErrors([]);
            setExpanded(nextPanel);
            setTimeout(() => {
                const nextAccordion = accordionRefs[nextPanel as keyof typeof accordionRefs]?.current;
                if (nextAccordion) {
                    nextAccordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        } else {
            const validations = await runMergedFullFundValidation();
            if (!validations.every((res) => res === true)) {
                applyFundCompletenessFailure(validations);
                return;
            }
            setFundCompletenessToastOpen(false);
            setFundPanelValidationErrors([]);
            markFundStepComplete(effectivePrelimId);
            navigate(`/preliminary/${prelimApplicationId}/declaration`);
        }
    };

    const handleClickSave = async () => {
        const validations = await runMergedFullFundValidation();
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
            applyFundCompletenessFailure(validations);
        } else {
            setFundCompletenessToastOpen(false);
            setFundPanelValidationErrors([]);
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
        if (hasNumericFundPrelimId) {
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
                                sx={fundAccordionShellSx("1")}
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
                        {hasNumericFundPrelimId ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["2"]}
                                elevation={0}
                                sx={fundAccordionShellSx("2")}
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
                                            prelimApplicationId={effectivePrelimId}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("2", "3", null)}
                                            onSectionHasErrorsChange={reportInvestmentStrategySectionErrors}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {hasNumericFundPrelimId ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["3"]}
                                elevation={0}
                                sx={fundAccordionShellSx("3")}
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
                                            prelimApplicationId={Number(effectivePrelimId)}
                                            onSectionHasErrorsChange={reportInvestmentPartnerSectionErrors}
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
                        {hasNumericFundPrelimId ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["4"]}
                                elevation={0}
                                sx={fundAccordionShellSx("4")}
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
                                            prelimApplicationId={Number(effectivePrelimId)}
                                            onSectionHasErrorsChange={reportInvestmentAssociateSectionErrors}
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
                        {hasNumericFundPrelimId ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["5"]}
                                elevation={0}
                                sx={fundAccordionShellSx("5")}
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
                                                    prelimApplicationId={Number(effectivePrelimId)}
                                                    hasInvestment={hasInvestment}
                                                    onSectionHasErrorsChange={reportPastInvestmentSectionErrors}
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
                        {hasNumericFundPrelimId ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["6"]}
                                elevation={0}
                                sx={fundAccordionShellSx("6")}
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
                                            prelimApplicationId={effectivePrelimId}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("6", "7", null)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> : <></>}
                        {hasNumericFundPrelimId ? <Grid item xs={12}>
                            <Accordion
                                ref={accordionRefs["7"]}
                                elevation={0}
                                sx={fundAccordionShellSx("7")}
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
                                            prelimApplicationId={effectivePrelimId}
                                            setPrelimApplicationId={handleApplicationIdCreation}
                                            onSaveSuccess={() => handleAccordionSaveAndContinue("7", null, null)}
                                            onSectionHasErrorsChange={reportDealFlowSectionErrors}
                                            onDealFlowSaveIncomplete={() => {
                                                void (async () => {
                                                    const validations = await runMergedFullFundValidation();
                                                    if (!validations.every((res) => res === true)) {
                                                        applyFundCompletenessFailure(validations);
                                                    }
                                                })();
                                            }}
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

            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 10,
                    color: '#fff',
                    flexDirection: 'column',
                    gap: 2,
                }}
                open={fundValidatingAll}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        textAlign: 'center',
                        px: 3,
                    }}
                >
                    <CircularProgress color="inherit" size={48} thickness={4} />
                    {/* <Typography variant="h6" component="p" sx={{ fontWeight: 600, maxWidth: 360 }}>
                        Validating fund sections…
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.88, maxWidth: 400 }}>
                        Please wait while we validate your entries and mandatory document uploads in the background.
                    </Typography> */}
                </Box>
            </Backdrop>

            {/* Dialog portals to body; sx z-index lifts the whole Modal above sticky save. Avoid raising only Backdrop z-index — it stacks above Paper and blocks clicks. */}
            <Dialog
                open={fundCompletenessToastOpen}
                onClose={(_, reason) => {
                    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                        stayReviewFundSections();
                    }
                }}
                maxWidth="sm"
                fullWidth
                disableScrollLock={false}
                sx={{ zIndex: 10001 }}
                PaperProps={{
                    sx: {
                        ...opaqueInfoToastAlertSx,
                        borderRadius: '12px',
                        maxWidth: 640,
                        m: 2,
                        position: 'relative',
                        zIndex: 1,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#4e342e', pb: 1 }}>Fund sections need attention</DialogTitle>
                <DialogContent sx={{ pt: 0 }}>
                    <Typography variant="body1" sx={{ color: '#4e342e', lineHeight: 1.5, fontWeight: 500 }}>
                        {FUND_COMPLETENESS_TOAST_TEXT}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
                    <Button color="primary" variant="outlined" onClick={stayReviewFundSections}>
                        Stay
                    </Button>
                    <Button color="primary" variant="contained" onClick={continueToDeclarationDespiteFundErrors}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}


export default Fund;
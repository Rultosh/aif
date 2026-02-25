import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, TextField, FormControlLabel, Divider, Checkbox, FormGroup, Switch } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { getPrelimApplicationData, selectPrelimApplication, updatePrelimApplicationAsync } from "../fundOverviewData/prelimApplicationDataSlice";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import { defaultIPrelimApplicationData, IPrelimApplicationData } from "../fundOverviewData/IPrelimApplicationData";
import uuid from 'react-uuid';
import { FetchStatus } from "../../../../lib/api-status/IStatus";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from "dayjs";
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DocumentChip from "../../../../components/DocumentChip";

const Declaration = (props: any) => {

    const { id } = useParams();
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid());

    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const [agreed, setAgreed] = useState<boolean>(!!prelimApplicationState.prelimApplication.declarationAccepted);
    const [expanded, setExpanded] = useState<string | false>("1");

    const validationSchema = Yup.object().shape({
        sdDescription: Yup.string().label("Capital Raised Till Date").nullable(),
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<IPrelimApplicationData>({
        resolver: yupResolver(validationSchema),
        defaultValues: prelimApplicationState.prelimApplication || {}
    });

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleInternalSaveAndContinue = (nextPanel: string) => {
        setExpanded(nextPanel);
    };

    const handleClick = async (ev: any, navTo: string) => {
        if (navTo === 'previous') {
            navigate(`/preliminary/${prelimApplicationState.prelimApplication.id}/selfRating`)
        } else {
            await handleSubmit(async (data) => {
                await handleClickSave(data);
                navigate(`/preliminary/${prelimApplicationState.prelimApplication.id}/preview`)
            })();
        }
    }

    useEffect(() => {
        if (props.checkUnAuth) {
            navigate('/login')
        }
    })

    useEffect(() => {
        window.scrollTo(0, 0)
        if (!prelimApplicationState.prelimApplication.id && id) {
            dispatch(getPrelimApplicationData(
                wrapArgument(actionUid, Number(id))
            ))
        }
    }, [])

    useEffect(() => {
        if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE) {
            setAgreed(!!prelimApplicationState.prelimApplication.declarationAccepted);
            reset(prelimApplicationState.prelimApplication);
        }
    }, [prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    function handleAgreementChange() {
        setAgreed(!agreed)
    }

    async function handleClickSave(formData?: IPrelimApplicationData) {
        const dataToUpdate = formData || prelimApplicationState.prelimApplication;
        await dispatch(
            updatePrelimApplicationAsync(
                wrapArgument(
                    actionUid, { ...defaultIPrelimApplicationData, ...dataToUpdate, id: Number(id), declarationAccepted: agreed }
                )
            )
        ).unwrap();
    }

    const accordionSx = {
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
    };

    const accordionSummarySx = {
        px: 3,
        py: 1,
        backgroundColor: 'transparent',
        '&.Mui-expanded': {
            backgroundColor: 'rgba(54, 48, 98, 0.02)',
        }
    };

    const stepNumberSx = (panel: string) => ({
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: expanded === panel ? '#363062' : '#f0f0f0',
        color: expanded === panel ? 'white' : '#666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 2,
        fontWeight: 700,
        fontSize: '0.9rem'
    });

    const internalButtonSx = {
        backgroundColor: '#363062',
        color: 'white',
        textTransform: 'none',
        borderRadius: '8px',
        px: 4,
        '&:hover': {
            backgroundColor: '#4d4585'
        }
    };

    const numericSx = {
        '& .MuiOutlinedInput-root': { borderRadius: '8px' },
        '& .MuiFormHelperText-root': { fontWeight: 600, color: '#666', fontSize: '0.75rem', mt: 0.5 }
    };

    const labelSx = { fontWeight: 700, mb: 1, display: 'block', color: '#363062' };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="formAnimation">
                <Card sx={{
                    mb: 3,
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#363062', mb: 1 }}>
                            KYC, Supporting Documents & Declaration
                        </Typography>
                        <Divider sx={{ borderColor: 'rgba(54, 48, 98, 0.1)', mb: 3 }} />

                        {/* Accordion 1: KYC */}
                        <Accordion
                            elevation={0}
                            sx={accordionSx}
                            expanded={expanded === "1"}
                            onChange={handleAccordionChange("1")}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: expanded === "1" ? '#363062' : '#666' }} />}
                                sx={accordionSummarySx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={stepNumberSx("1")}>1</Box>
                                    <Typography sx={{ fontWeight: 700, color: expanded === "1" ? '#363062' : '#444' }}>
                                        KYC
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                <Box sx={{ mb: 4 }}>
                                    {[
                                        {
                                            id: "kycBoardDirectors",
                                            text: "1. KYC Form of the Board of Directors of Trustee Company, AMC, Sponsor, Advisory Board, Members of IC, Investment Management Team to be provided in the format attached in Annexure I. Along with the self-attested copy of POI (Proof of Identity), POA (Proof of address: permanent and correspondent), Two passport size photograph for purpose of KYC.",
                                            templateLabel: "Download Template"
                                        },
                                        {
                                            id: "boardResolution",
                                            text: "2. Board resolution or the requisite documents for such authorization to submit application on behalf of the IM",
                                            templateLabel: "Download Template"
                                        }
                                    ].map((item, index) => (
                                        <Box key={item.id} sx={{ mb: index === 0 ? 4 : 0, p: 2, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#363062', mb: 2, lineHeight: 1.6 }}>
                                                {item.text}
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DownloadIcon />}
                                                    sx={{
                                                        textTransform: 'none',
                                                        borderRadius: '6px',
                                                        borderColor: 'rgba(54, 48, 98, 0.3)',
                                                        color: '#363062',
                                                        '&:hover': { borderColor: '#363062', backgroundColor: 'rgba(54, 48, 98, 0.05)' },
                                                        mb: '17px'
                                                    }}
                                                >
                                                    {item.templateLabel}
                                                </Button>
                                                <DocumentChip label="Upload Document" id={`${item.id}${id}`} />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleInternalSaveAndContinue("2")}
                                        sx={internalButtonSx}
                                    >
                                        Save & Continue
                                    </Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 2: Supporting Documents */}
                        <Accordion
                            elevation={0}
                            sx={accordionSx}
                            expanded={expanded === "2"}
                            onChange={handleAccordionChange("2")}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: expanded === "2" ? '#363062' : '#666' }} />}
                                sx={accordionSummarySx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={stepNumberSx("2")}>2</Box>
                                    <Typography sx={{ fontWeight: 700, color: expanded === "2" ? '#363062' : '#444' }}>
                                        Supporting Documents
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#363062', mb: 3 }}>
                                        Fund Overview
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleInternalSaveAndContinue("3")}
                                        sx={internalButtonSx}
                                    >
                                        Save & Continue
                                    </Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 3: Declaration */}
                        <Accordion
                            elevation={0}
                            sx={accordionSx}
                            expanded={expanded === "3"}
                            onChange={handleAccordionChange("3")}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: expanded === "3" ? '#363062' : '#666' }} />}
                                sx={accordionSummarySx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={stepNumberSx("3")}>3</Box>
                                    <Typography sx={{ fontWeight: 700, color: expanded === "3" ? '#363062' : '#444' }}>
                                        Declaration
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 4, pt: 1 }}>
                                <Box sx={{ mt: 2, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                                    <Box sx={{ p: 3, backgroundColor: 'rgba(54, 48, 98, 0.04)' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#363062' }}>
                                            I / We (Partner/Directors) hereby declare that:
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 3 }}>
                                        {[
                                            { key: "A", text: "The information given above and the statements and other papers enclosed are to the best of our knowledge and belief, true and correct in all particulars." },
                                            { key: "B", text: "There are no arrears of statutory dues and no government enquiries / proceedings / prosecution / legal action are pending/initiated against the Fund / Sponsor / AMC / Trustee Company / promoters / directors / partners except as indicated in the application." },
                                            { key: "C", text: "I / We also confirm that I / none of the Sponsors / promoters or directors or partners have at any time declared themselves as insolvent." },
                                            { key: "D", text: "I / We have no objection if NPS Trust furnishes the information submitted by me/us to other banks / FIs / CIBIL / RBI / any other agency as may be deemed fit in connection with consideration of my/our application for capital commitment to the proposed venture capital fund." },
                                            { key: "E", text: "I / We have no objection if NPS Trust and/or its representatives making necessary enquiries/verification (including in CIBIL or any other credit information agencies database) while considering my/our application for capital contribution. I / We undertake to furnish all other information that may be required by NPS Trust in connection with my/our application for capital commitment." }
                                        ].map((item, index, array) => (
                                            <Box key={item.key} sx={{ mb: index === array.length - 1 ? 0 : 3 }}>
                                                <Typography variant="body1" sx={{ display: 'flex', gap: 2, mb: 1, fontWeight: 600, color: '#363062' }}>
                                                    <span>{item.key}.</span>
                                                    {item.text}
                                                </Typography>
                                                {index < array.length - 1 && <Divider sx={{ my: 2, opacity: 0.5 }} />}
                                            </Box>
                                        ))}

                                        <Box sx={{
                                            mt: 4,
                                            backgroundColor: agreed ? 'rgba(76, 175, 80, 0.08)' : 'rgba(54, 48, 98, 0.04)',
                                            p: 2,
                                            borderRadius: '12px',
                                            border: agreed ? '1px solid rgba(76, 175, 80, 0.2)' : '1px solid rgba(54, 48, 98, 0.1)',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox checked={!!agreed} onChange={handleAgreementChange} color="success" />}
                                                    label={<Typography sx={{ fontWeight: 700, color: agreed ? '#2e7d32' : '#363062' }}>
                                                        I Accept and Agree to the above Declaration
                                                    </Typography>}
                                                />
                                            </FormGroup>
                                        </Box>
                                    </Box>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
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

                            <Box>
                                <Button
                                    onClick={(e) => handleClick(e, "next")}
                                    disabled={!agreed}
                                    endIcon={<ArrowRightIcon />}
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 700,
                                        backgroundColor: '#363062',
                                        '&:hover': {
                                            backgroundColor: '#4d4585'
                                        }
                                    }}
                                >
                                    Save & Continue to Preview
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        </LocalizationProvider>
    )
}

export default Declaration;
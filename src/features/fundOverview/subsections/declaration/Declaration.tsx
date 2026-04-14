import { Alert, Backdrop, Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, TextField, FormControlLabel, Divider, Checkbox, FormGroup, Switch, Dialog, DialogContent, Zoom, CircularProgress, Snackbar } from "@mui/material";
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
import { markDeclarationStepComplete } from "../../wizardProgress";
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
import FileUploadService from "../../../../components/FileUploadService";
import { opaqueInfoToastAlertSx } from "../../../../lib/ui/opaqueInfoToastAlertSx";

const MANDATORY_DOCUMENTS_UPLOAD_MESSAGE =
    'Please upload all mandatory documents before proceeding.';

const DECLARATION_ACCEPT_MESSAGE = 'Please accept the declaration to continue.';

const Declaration = (props: any) => {

    const { id } = useParams();
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [actionUid] = useState(uuid());

    const prelimApplicationState = useAppSelector(selectPrelimApplication)
    const effectiveId = String(prelimApplicationState.prelimApplication?.id || id || '');
    const [agreed, setAgreed] = useState<boolean>(!!prelimApplicationState.prelimApplication.declarationAccepted);
    const [expanded, setExpanded] = useState<string | false>("1");
    const [documentError, setDocumentError] = useState<string>('');
    /** Accordion panels "1"|"2" with document / prelim-id validation issues (mild red shell). */
    const [declarationDocAccordionErrors, setDeclarationDocAccordionErrors] = useState<string[]>([]);
    const [declarationDocsValidating, setDeclarationDocsValidating] = useState(false);
    // const [declarationValidateTitle, setDeclarationValidateTitle] = useState('');
    /** Single mellow info toast for mandatory uploads or declaration checkbox reminder. */
    const [declarationSoftToastMessage, setDeclarationSoftToastMessage] = useState<string | null>(null);
    /** True after user tries “Save & Continue to Preview” without accepting; cleared when they accept. */
    const [declarationContinueBlocked, setDeclarationContinueBlocked] = useState(false);

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

    const hasUploadedFiles = async (bucketId: string): Promise<boolean> => {
        try {
            const res = await FileUploadService.list(bucketId);
            const files = Array.isArray(res?.data)
                ? res.data
                : (Array.isArray((res as any)?.data?.files) ? (res as any).data.files : []);
            return files.length > 0;
        } catch {
            return false;
        }
    };

    const checkBucketsUploaded = async (buckets: string[]): Promise<boolean> => {
        if (!Number(effectiveId)) return false;
        const checks = await Promise.all(buckets.map((bucket) => hasUploadedFiles(`${bucket}${effectiveId}`)));
        return checks.every(Boolean);
    };

    const validateRequiredDocuments = async (
        buckets: string[],
        bucketLabels?: Record<string, string>
    ): Promise<boolean> => {
        if (!Number(effectiveId)) return false;
        const checks = await Promise.all(
            buckets.map(async (bucket) => ({
                bucket,
                uploaded: await hasUploadedFiles(`${bucket}${effectiveId}`)
            }))
        );
        const missingBuckets = checks.filter((c) => !c.uploaded).map((c) => c.bucket);
        if (missingBuckets.length > 0) {
            setDocumentError('');
            const missingText = missingBuckets
                .map((bucket) => bucketLabels?.[bucket] || bucket)
                .join(', ');
            setDeclarationSoftToastMessage(
                missingBuckets.length === 1
                    ? `Please upload mandatory document: ${missingText}.`
                    : `Please upload all mandatory documents: ${missingText}.`
            );
            return false;
        }
        setDocumentError('');
        setDeclarationSoftToastMessage((prev) =>
            prev && prev.startsWith("Please upload") ? null : prev
        );
        return true;
    };

    const kycDocumentBuckets = ["kycIndicativeListOfDocuments", "kycAnnexureBoardDirectors", "boardResolution"];
    const kycDocumentLabels: Record<string, string> = {
        kycIndicativeListOfDocuments: "Indicative_List_of_Documents_for_KYC",
        kycAnnexureBoardDirectors: "Annexure_I_Details_of_Board_of_Directors",
        boardResolution: "Annexure II - KYC form"
    };

    const supportingDocumentBuckets = [
        "sdPvtPlacementMemorandum",
        "sdLatestInvestorPresentation",
        "sdImAgreement",
        "sdTrustDeal",
        "sdSEBICertificate",
        // sdAifGradingReport is optional
        "sdShareholdingPattern",
        "sdPolicyOfCarry",
        "sdContributionAgreement",
        "sdInvestmentPolicy",
        "sdInvestmentCommitteeNote",
        "sdHrPolicy",
        "sdOrganisationStructure",
        "detailsOfInvestmentCommitteeMembers",
        "detailsOfContributorToTheFund",
        "pastInvestmentTrackRecord",
    ];

    const handleInternalSaveAndContinue = async (currentPanel: string, nextPanel: string) => {
        if (!Number(effectiveId)) {
            setDocumentError('Please save the form to upload documents.');
            setDeclarationDocAccordionErrors((prev) => Array.from(new Set([...prev, '1', '2'])));
            return;
        }

        if (currentPanel === "1") {
            // setDeclarationValidateTitle('Validating KYC…');
            setDeclarationDocsValidating(true);
            try {
                const ok = await validateRequiredDocuments(kycDocumentBuckets, kycDocumentLabels);
                if (!ok) {
                    setDeclarationDocAccordionErrors((prev) => Array.from(new Set([...prev, '1'])));
                    return;
                }
                setDeclarationDocAccordionErrors((prev) => prev.filter((p) => p !== '1'));
            } finally {
                setDeclarationDocsValidating(false);
            }
        }

        if (currentPanel === "2") {
            // setDeclarationValidateTitle('Validating supporting documents…');
            setDeclarationDocsValidating(true);
            try {
                const ok = await validateRequiredDocuments(supportingDocumentBuckets);
                if (!ok) {
                    setDeclarationDocAccordionErrors((prev) => Array.from(new Set([...prev, '2'])));
                    return;
                }
                setDeclarationDocAccordionErrors((prev) => prev.filter((p) => p !== '2'));
            } finally {
                setDeclarationDocsValidating(false);
            }
        }

        setDocumentError('');
        setDeclarationSoftToastMessage((prev) =>
            prev === MANDATORY_DOCUMENTS_UPLOAD_MESSAGE ? null : prev
        );
        setExpanded(nextPanel);
    };

    const handleClick = async (ev: any, navTo: string) => {
        if (navTo === 'previous') {
            navigate(`/preliminary/${prelimApplicationState.prelimApplication.id}/fund`)
        } else {
            await handleSubmit(async (data) => {
                try {
                    if (!Number(effectiveId)) {
                        setDocumentError('Please save the form to upload documents.');
                        setDeclarationDocAccordionErrors((prev) => Array.from(new Set([...prev, '1', '2'])));
                        return;
                    }
                    // setDeclarationValidateTitle('Validating KYC and supporting documents…');
                    setDeclarationDocsValidating(true);
                    try {
                        const kycOk = await validateRequiredDocuments(kycDocumentBuckets, kycDocumentLabels);
                        const supportingOk = await checkBucketsUploaded(supportingDocumentBuckets);
                        setDeclarationDocAccordionErrors((prev) => {
                            let next = prev.filter((p) => p !== '1' && p !== '2');
                            if (!kycOk) next = Array.from(new Set([...next, '1']));
                            if (!supportingOk) next = Array.from(new Set([...next, '2']));
                            return next;
                        });
                        if (!kycOk || !supportingOk) {
                            setDocumentError('');
                            setDeclarationContinueBlocked(false);
                            setDeclarationSoftToastMessage(MANDATORY_DOCUMENTS_UPLOAD_MESSAGE);
                            setExpanded(!kycOk ? '1' : '2');
                            return;
                        }
                        setDocumentError('');
                        setDeclarationSoftToastMessage((prev) =>
                            prev === MANDATORY_DOCUMENTS_UPLOAD_MESSAGE ? null : prev
                        );

                        if (!agreed) {
                            setDeclarationContinueBlocked(true);
                            setDeclarationSoftToastMessage(DECLARATION_ACCEPT_MESSAGE);
                            setExpanded('3');
                            return;
                        }
                        setDeclarationContinueBlocked(false);
                        setDeclarationSoftToastMessage((prev) =>
                            prev === DECLARATION_ACCEPT_MESSAGE ? null : prev
                        );

                        await handleClickSave(data);
                        setDeclarationDocAccordionErrors([]);
                        markDeclarationStepComplete(String(prelimApplicationState.prelimApplication.id));
                        navigate(`/preliminary/${prelimApplicationState.prelimApplication.id}/preview`)
                    } finally {
                        setDeclarationDocsValidating(false);
                    }
                } catch (error: any) {
                    console.error("Save failure:", error);
                    alert(error?.message || "An unexpected error occurred while saving.");
                }
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

    useEffect(() => {
        if (agreed) {
            setDeclarationContinueBlocked(false);
            setDeclarationSoftToastMessage((prev) =>
                prev === DECLARATION_ACCEPT_MESSAGE ? null : prev
            );
        }
    }, [agreed]);

    function handleAgreementChange() {
        setAgreed(!agreed)
    }

    async function handleClickSave(formData?: IPrelimApplicationData) {
        const dataToUpdate = formData || prelimApplicationState.prelimApplication;
        try {
            await dispatch(
                updatePrelimApplicationAsync(
                    wrapArgument(
                        actionUid, { ...defaultIPrelimApplicationData, ...dataToUpdate, id: Number(id), declarationAccepted: agreed }
                    )
                )
            ).unwrap();
        } catch (error) {
            // Re-throw to be caught by the caller
            throw error;
        }
    }

    const declarationFormFieldErrors = Object.keys(errors).length > 0;

    const declarationAccordionShellSx = (panelId: string) => {
        const hasErr =
            declarationDocAccordionErrors.includes(panelId) ||
            (panelId === '3' && (declarationContinueBlocked || declarationFormFieldErrors));
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
                borderColor: '#363062',
                borderLeft: '6px solid #363062',
                ...(hasErr ? { backgroundColor: 'rgba(211, 47, 47, 0.045)' } : {}),
            },
        };
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
                        {/* Accordion 1: KYC */}
                        <Accordion
                            elevation={0}
                            sx={declarationAccordionShellSx('1')}
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
                                            text: "1. Details and KYC Form of the Board of Directors of Trustee Company, AMC, Sponsor, Advisory Board, Members of IC, Investment Management Team to be provided in the format attached in Annexure I and Annexure II. Along with the self-attested copy of POI (Proof of Identity), POA (Proof of address: permanent and correspondent), Two passport size photograph for purpose of KYC.",
                                            templateLabel: "Download Template",
                                            href: "/vcf/templates/annexure-I-template-and-list-of-docs.zip",
                                            uploads: [
                                                {
                                                    id: "kycIndicativeListOfDocuments",
                                                    validationTitle: "Indicative_List_of_Documents_for_KYC"
                                                },
                                                {
                                                    id: "kycAnnexureBoardDirectors",
                                                    validationTitle: "Annexure_I_Details_of_Board_of_Directors"
                                                }
                                            ]
                                        },
                                        {
                                            id: "boardResolution",
                                            text: "2. Board resolution or the requisite documents for such authorization to submit application on behalf of the IM",
                                            // templateLabel: "Download Template",
                                            href: "/vcf/templates/Annexure_II_KYC_Form.xlsx",
                                            validationTitle: "Annexure_II_KYC_Form"
                                        }
                                    ].map((item, index) => (
                                        <Box key={item.id} sx={{ mb: index === 0 ? 4 : 0, p: 2, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#363062', mb: 2, lineHeight: 1.6 }}>
                                                {item.text}
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                                {item.templateLabel && <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DownloadIcon />}
                                                    href={item.href}
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
                                                </Button>}
                                                {item.uploads?.length ? (
                                                    item.uploads.map((upload: any) => (
                                                        <span key={upload.id} style={{ marginTop: '10px' }}>
                                                            <DocumentChip
                                                                label={`Upload ${upload.validationTitle}`}
                                                                validationTitle={upload.validationTitle}
                                                                id={`${upload.id}${effectiveId}`}
                                                            />
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span style={{ marginTop: '10px' }}>
                                                        <DocumentChip label="Upload Document" validationTitle={item.validationTitle} id={`${item.id}${effectiveId}`} />
                                                    </span>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleInternalSaveAndContinue("1", "2")}
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
                            sx={declarationAccordionShellSx('2')}
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
                                    <Box sx={{
                                        p: 3,
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        borderRadius: '16px',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        {Number(effectiveId) ? (
                                            <Grid container spacing={2}>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Private Placement Memorandum" validationTitle="Private Placement Memorandum" id={`sdPvtPlacementMemorandum${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Latest Investor Presentation" validationTitle="Latest Investor Presentation" id={`sdLatestInvestorPresentation${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="IM Agreement" validationTitle="IM Agreement" id={`sdImAgreement${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Trust Deed" validationTitle="Trust Deed" id={`sdTrustDeal${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="SEBI Registration Certificate" validationTitle="SEBI Registration Certificate" id={`sdSEBICertificate${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="AIF Grading Report" validationTitle="AIF Grading Report" id={`sdAifGradingReport${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Shareholding Pattern of Sponsor/IM"  id={`sdShareholdingPattern${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Policy of Carry" validationTitle="Policy of Carry" id={`sdPolicyOfCarry${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Draft Contribution Agreement" validationTitle="Draft Contribution Agreement" id={`sdContributionAgreement${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Investment and Other Policies" validationTitle="Investment and Other Policies" id={`sdInvestmentPolicy${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Sample Investment Committee Note" validationTitle="Sample Investment Committee Note" id={`sdInvestmentCommitteeNote${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="HR Policy" validationTitle="HR Policy" id={`sdHrPolicy${effectiveId}`} />
                                                </Grid>
                                                <Grid item xs="auto">
                                                    <DocumentChip label="Organisation Structure" validationTitle="Organisation Structure" id={`sdOrganisationStructure${effectiveId}`} />
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                                Please save the form to upload documents.
                                            </Typography>
                                        )}
                                    </Box>

                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#363062', mb: 3, mt: 4 }}>
                                        Details of Investment Committee Member of Current Fund
                                    </Typography>

                                    <Box sx={{
                                        p: 3,
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        borderRadius: '16px',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        {Number(effectiveId) ? (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                                <Button
                                                    variant="outlined"
                                                    href="/vcf/templates/Details of Investment Committee Members.xlsx"
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
                                                    Download Template
                                                </Button>
                                                <span style={{ marginTop: '10px' }}>
                                                    <DocumentChip label="Upload Document" validationTitle="Details of Investment Committee Members" id={`detailsOfInvestmentCommitteeMembers${effectiveId}`} />
                                                </span>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                                Please save the form to upload documents.
                                            </Typography>
                                        )}
                                    </Box>

                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#363062', mb: 3, mt: 4 }}>
                                        Details of contributors of Current Fund
                                    </Typography>

                                    <Box sx={{
                                        p: 3,
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        borderRadius: '16px',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        {Number(effectiveId) ? (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                                <Button
                                                    variant="outlined"
                                                    href="/vcf/templates/Details of contributors of Current Fund.xlsx"
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
                                                    Download Template
                                                </Button>
                                                <span style={{ marginTop: '10px' }}>
                                                    <DocumentChip label="Upload Document" validationTitle="Details of contributors of Current Fund" id={`detailsOfContributorToTheFund${effectiveId}`} />
                                                </span>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                                Please save the form to upload documents.
                                            </Typography>
                                        )}
                                    </Box>

                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#363062', mb: 3, mt: 4 }}>
                                        Past Investment Track Record Of IM/AMC
                                    </Typography>

                                    <Box sx={{
                                        p: 3,
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        borderRadius: '16px',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        {Number(effectiveId) ? (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                                <Button
                                                    variant="outlined"
                                                    href="/vcf/templates/Past Investment Track Record of IM or AMC.xlsx"
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
                                                    Download Template
                                                </Button>
                                                <span style={{ marginTop: '10px' }}>
                                                    <DocumentChip label="Upload Document" validationTitle="Past Investment Track Record Of IM or AMC" id={`pastInvestmentTrackRecord${effectiveId}`} />
                                                </span>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                                Please save the form to upload documents.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleInternalSaveAndContinue("2", "3")}
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
                            sx={declarationAccordionShellSx('3')}
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
                                            I / We (KMP) hereby declare that:
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
                                Back to Fund Information
                            </Button>

                            <Box>
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
                                        backgroundColor: '#FF671F',
                                        '&:hover': {
                                            border: '1px solid #FF671F',
                                            color: '#FF671F',
                                            backgroundColor: 'rgb(255 103 30 / 19%)'
                                        }
                                    }}
                                >
                                    Save & Continue to Preview
                                </Button>
                            </Box>
                        </Box>
                        {documentError && (
                            <Typography variant="caption" color="error" sx={{ mt: 1.5, display: 'block' }}>
                                {documentError}
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                <Snackbar
                    open={declarationSoftToastMessage !== null}
                    autoHideDuration={declarationSoftToastMessage === DECLARATION_ACCEPT_MESSAGE ? 10000 : 12000}
                    onClose={(_, reason) => {
                        if (reason === 'clickaway') return;
                        setDeclarationSoftToastMessage(null);
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    sx={{ zIndex: (theme) => theme.zIndex.modal + 12 }}
                >
                    <Alert
                        onClose={() => setDeclarationSoftToastMessage(null)}
                        severity="info"
                        variant="standard"
                        sx={opaqueInfoToastAlertSx}
                    >
                        {declarationSoftToastMessage}
                    </Alert>
                </Snackbar>

                <Backdrop
                    sx={{
                        zIndex: (theme) => theme.zIndex.modal + 10,
                        color: '#fff',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                    open={declarationDocsValidating}
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
                        {/* <Typography variant="h6" component="p" sx={{ fontWeight: 600, maxWidth: 400 }}>
                            {declarationValidateTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.88, maxWidth: 420 }}>
                            Please wait while we verify your uploads in the background.
                        </Typography> */}
                    </Box>
                </Backdrop>
            </div>
        </LocalizationProvider>
    )
}

export default Declaration;
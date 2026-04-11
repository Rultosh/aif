import { Box, Button, Grid, TextField, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { getPrelimApplicationData, PrelimApplicationState, selectPrelimApplication, updatePrelimApplicationAsync } from "../prelimApplicationDataSlice";
import { IPrelimApplicationData } from "../IPrelimApplicationData";
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { FetchStatus } from "../../../../../lib/api-status/IStatus";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadService from "../../../../../components/FileUploadService";
import { useParams } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';
import DocumentChip from "../../../../../components/DocumentChip";

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
}

const DealFlow = forwardRef((props: PrelimApplicationProps, ref) => {
    const { id } = useParams();
    const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
    const [prelimApplicationFormData, setPrelimApplicationFormData] = useState(prelimApplicationState.prelimApplication);
    const [actionUid] = useState(uuid());
    const [documentError, setDocumentError] = useState('');
    const prelimAppicationId = props.prelimApplicationId;
    const effectiveId = String(prelimAppicationId || prelimApplicationState.prelimApplication?.id || id || '');
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (Number(prelimAppicationId)) {
            dispatch(getPrelimApplicationData(
                wrapArgument(actionUid, Number(prelimAppicationId))
            ));
        }
    }, [prelimAppicationId, actionUid, dispatch]);

    const aifCategoryType = prelimApplicationState.prelimApplication?.aifCategoryType || 'Equity Oriented AIF';
    const isEquityOriented = ['Equity Oriented AIF', 'Equity Oriented Fund'].includes(String(aifCategoryType));

    useEffect(() => {
        if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE && prelimApplicationState.prelimApplication?.id) {
            const isInitialLoad = !prelimApplicationFormData?.id;
            setPrelimApplicationFormData(prelimApplicationState.prelimApplication);
            reset(prelimApplicationState.prelimApplication, { keepDirtyValues: !isInitialLoad });
        }
    }, [prelimApplicationState.prelimApplication?.id, prelimApplicationState.status.fetchStatus]);
    const freeformRegx = /^[\s\S]*$/;
    const validationSchema = Yup.object().shape({
        dfTotalDealsEvaluated: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        //dfCurrentPipeline: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        // dfSourcingBreakdown: Yup.string().required("This field is required").nullable(),
        // dfConversionRatio: Yup.number().required("This field is required").nullable(),
        dfMeetingFrequency: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfInvestigationDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfExclusiveVC: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfDirectorshipsPolicy: isEquityOriented
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)")
            : Yup.string().nullable(),
        dfConsolidatedInfo: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfNAVFrequency: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        //dfValuationReport: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfNAVGuidelines: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfMonitoringActivities: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfContributorTerms: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfDecisionApprovals: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IPrelimApplicationData>({
        resolver: yupResolver(validationSchema),
        mode: "all",
        defaultValues: prelimApplicationState.prelimApplication || {}
    });

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

    const onSubmit = async (data: IPrelimApplicationData): Promise<boolean> => {
        const requiredBuckets = [
            `sdDetailsOfCurrentPipelineOfDealsUnderConsideration${effectiveId}`,
            `sdEmpanelledListOfExternalFirms${effectiveId}`,
        ];
        const checks = await Promise.all(requiredBuckets.map((bucket) => hasUploadedFiles(bucket)));
        const allUploaded = checks.every(Boolean);
        if (!allUploaded) {
            setDocumentError("Please upload all mandatory documents before proceeding.");
            return false;
        }
        setDocumentError('');
        await dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, { ...prelimApplicationFormData, ...data })));
        if (props.onSaveSuccess) {
            props.onSaveSuccess();
        }
        return true;
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            let isValid = false;
            await handleSubmit(
                async (data) => {
                    const ok = await onSubmit(data);
                    isValid = ok;
                },
                () => {
                    isValid = false;
                }
            )();
            return isValid;
        }
    }));

    const qSx = { mb: 3 };
    const labelSx = { fontWeight: 600, mb: 1, display: 'block', color: '#333', textAlign: 'justify' };

    const fieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF671F',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF671F',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#FF671F',
        },
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

    const numericSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&.Mui-readOnly, & .MuiInputBase-input[readOnly]': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }
        },
    };

    if (prelimApplicationState.status.fetchStatus === FetchStatus.FAILED && !prelimApplicationState.prelimApplication?.id) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>Failed to load data</Typography>
                <Button 
                    variant="outlined" 
                    onClick={() => {
                        if (Number(prelimAppicationId)) {
                            dispatch(getPrelimApplicationData(wrapArgument(actionUid, Number(prelimAppicationId))));
                        }
                    }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE || prelimApplicationState.prelimApplication?.id) {
        return (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 0 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>1. Total number of business plans / deals evaluated since Fund inception and Conversion ratio for transactions sourced to those completed.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("dfTotalDealsEvaluated")}
                            error={!!errors.dfTotalDealsEvaluated}
                            helperText={errors.dfTotalDealsEvaluated?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>2. Frequency of meetings to update the contributor.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("dfMeetingFrequency")}
                            error={!!errors.dfMeetingFrequency}
                            helperText={errors.dfMeetingFrequency?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>3. Has any of the member(s) of the Board of Directors of Investment Manager, Trustee, Sponsor or employee(s) of the Investment Manager have been investigated by any regulatory authority during the last 5 years? If yes, please give full details of the same.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("dfInvestigationDetails")}
                            error={!!errors.dfInvestigationDetails}
                            helperText={errors.dfInvestigationDetails?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>4. Is the Investment Manager exclusively handling AIF business or is it also doing any other business or activity?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("dfExclusiveVC")}
                            error={!!errors.dfExclusiveVC}
                            helperText={errors.dfExclusiveVC?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    {isEquityOriented && (<Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>5. Do any Investment Manager (employees) hold directorships in investee companies? If yes, please provide details.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("dfDirectorshipsPolicy")}
                            error={!!errors.dfDirectorshipsPolicy}
                            helperText={errors.dfDirectorshipsPolicy?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>
                    )}
                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>{isEquityOriented ? '6' : '5'}. List the activities involved in monitoring and follow-up of investments? And How frequently do the investee companies furnish reports to the Investment Manager? Please give details of the same.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("dfMonitoringActivities")}
                            error={!!errors.dfMonitoringActivities}
                            helperText={errors.dfMonitoringActivities?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>{isEquityOriented ? '7' : '6'}. Are all contributors governed by same terms and conditions or whether anyone or more has been offered special terms or terms different from that of others? If yes, please give details thereof and name of the contributor (along with reasons).</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("dfContributorTerms")}
                            error={!!errors.dfContributorTerms}
                            helperText={errors.dfContributorTerms?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>{isEquityOriented ? '8' : '7'}. Who approves investment and divestment decisions? Please give details of the process of evaluation of the deals and approvals/investments/exits thereafter.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("dfDecisionApprovals")}
                            error={!!errors.dfDecisionApprovals}
                            helperText={errors.dfDecisionApprovals?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={labelSx}>{isEquityOriented ? '9' : '8'}. What is the reporting structure/procedure for the contributors.</Typography>

                        <Box sx={{ ml: 2 }}>
                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>a) What information about the portfolio companies is consolidated and reported to investors, and what is the frequency of such reporting?</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("dfConsolidatedInfo")}
                                error={!!errors.dfConsolidatedInfo}
                                helperText={errors.dfConsolidatedInfo?.message as string}
                                variant="outlined"
                                sx={{ ...fieldSx, mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>b) Frequency of NAV reporting (quarterly/ half-yearly).</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("dfNAVFrequency")}
                                error={!!errors.dfNAVFrequency}
                                helperText={errors.dfNAVFrequency?.message as string}
                                variant="outlined"
                                sx={{ ...fieldSx, mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>c) Guidelines for calculating NAV.</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("dfNAVGuidelines")}
                                error={!!errors.dfNAVGuidelines}
                                helperText={errors.dfNAVGuidelines?.message as string}
                                variant="outlined"
                                sx={{ ...fieldSx, mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#363062', mb: 3, mt: 0 }}>
                            Details of Current Pipeline of Deals Under Consideration
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
                                        href="/vcf/templates/Details of current pipeline of deals under consideration.xlsx"
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
                                        <DocumentChip label="Upload Document" validationTitle="Details of current pipeline of deals under consideration" id={`sdDetailsOfCurrentPipelineOfDealsUnderConsideration${effectiveId}`} />
                                    </span>
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                    Please save the form to upload documents.
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#363062', mb: 3, mt: 0 }}>
                            Empanelled list of external firms
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
                                        href="/vcf/templates/Empanelled list of external Firms.xlsx"
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
                                        <DocumentChip label="Upload Document" validationTitle="Empanelled list of external Firms" id={`sdEmpanelledListOfExternalFirms${effectiveId}`} />
                                    </span>
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                    Please save the form to upload documents.
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={internalButtonSx}
                            >
                                Save and Continue
                            </Button>
                        </Box>
                        {documentError && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                {documentError}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: '#FF671F', mr: 2 }} /><Typography component="span">Loading...</Typography></Box>;
});

export default DealFlow;

import { Box, Button, Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography, FormHelperText, CircularProgress } from "@mui/material";
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback, useRef } from "react";
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { getPrelimApplicationData, PrelimApplicationState, selectPrelimApplication, updatePrelimApplicationAsync } from "../prelimApplicationDataSlice";
import { IPrelimApplicationData } from "../IPrelimApplicationData";
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { FetchStatus } from "../../../../../lib/api-status/IStatus";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DocumentChip from "../../../../../components/DocumentChip";
import { useParams } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import UploadComponents from "../../../../DetailedApplicationComponent/subsections/uploadComponents";
import FileUploadService from "../../../../../components/FileUploadService";

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
    /** Tint fund accordion section 2 when mandatory risk document is missing or form has errors. */
    onSectionHasErrorsChange?: (hasErrors: boolean) => void;
}

const InvestmentStrategy = forwardRef((props: PrelimApplicationProps, ref) => {
    const { id } = useParams();
    const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
    const [prelimApplicationFormData, setPrelimApplicationFormData] = useState(prelimApplicationState.prelimApplication);
    const [actionUid] = useState(uuid());
    const prelimAppicationId = props.prelimApplicationId;
    const effectiveId = String(prelimAppicationId || prelimApplicationState.prelimApplication?.id || id || '');
    const dispatch = useAppDispatch();
    const [documentError, setDocumentError] = useState('');
    const [riskAssessmentDocMissing, setRiskAssessmentDocMissing] = useState(false);
    const onSectionHasErrorsChangeRef = useRef(props.onSectionHasErrorsChange);
    onSectionHasErrorsChangeRef.current = props.onSectionHasErrorsChange;
    /** After `reset()` from prelim refresh, RHF/yup can briefly report errors and falsely flag section 2 for other panels’ activity. */
    const skipStrategyErrorReportRef = useRef(false);

    /** `true` / `false` = list succeeded; `null` = still failing after retries — caller treats as “unknown”, not “missing”. */
    const riskBucketHasFiles = useCallback(async (): Promise<boolean | null> => {
        if (!Number(effectiveId)) return false;
        const bucketId = `sdRiskAssessmentAndMitigationPlan${effectiveId}`;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const res = await FileUploadService.list(bucketId);
                const files = Array.isArray(res?.data)
                    ? res.data
                    : (Array.isArray((res as any)?.data?.files) ? (res as any).data.files : []);
                return files.length > 0;
            } catch {
                if (attempt < 2) {
                    await new Promise((r) => setTimeout(r, 70));
                }
            }
        }
        return null;
    }, [effectiveId]);

    const refreshRiskAssessmentDocMissing = useCallback(async () => {
        if (!Number(effectiveId)) {
            setRiskAssessmentDocMissing(false);
            return;
        }
        const ok = await riskBucketHasFiles();
        if (ok === null) return;
        setRiskAssessmentDocMissing(!ok);
    }, [effectiveId, riskBucketHasFiles]);

    useEffect(() => {
        if (Number(effectiveId)) {
            dispatch(getPrelimApplicationData(wrapArgument(actionUid, Number(effectiveId))));
        }
    }, [effectiveId, actionUid, dispatch]);

    useEffect(() => {
        if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE && prelimApplicationState.prelimApplication?.id) {
            const isInitialLoad = !prelimApplicationFormData?.id;
            setPrelimApplicationFormData(prelimApplicationState.prelimApplication);
            skipStrategyErrorReportRef.current = true;
            reset(prelimApplicationState.prelimApplication, { keepDirtyValues: !isInitialLoad });
            window.setTimeout(() => {
                skipStrategyErrorReportRef.current = false;
            }, 80);
        }
    }, [prelimApplicationState.prelimApplication?.id, prelimApplicationState.status.fetchStatus]);
    const freeformRegx = /^[\s\S]*$/; // Allow all characters for multiline fields, or more permissive set
    const aifCategoryType = prelimApplicationState.prelimApplication?.aifCategoryType || 'Equity Oriented AIF';
    const isEquityOriented = ['Equity Oriented AIF', 'Equity Oriented Fund'].includes(String(aifCategoryType));
    const isDebtOriented = ['Debt Oriented AIF', 'Debt Oriented Fund'].includes(String(aifCategoryType));

    const validationSchema = Yup.object().shape({
        isStrategyBasis: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        // isFocusSectors: Yup.string().required("This field is required").nullable(),
        isComparisonPast: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        // isSignificantChange: Yup.string().required("This field is required").nullable(),
        //isSectorSituations: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        isControlsRights: isEquityOriented
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        isRightsProtections: isDebtOriented
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        // isInvestmentPolicy: Yup.string().required("This field is required").nullable(),
        // isRisksMitigation: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        isRolledOverInvestments: isEquityOriented
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        isGrossReturnObjective: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        isTargetInvestmentSize: isEquityOriented
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        isTargetInvestmentSizePerTransaction: isDebtOriented
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        isTargetNumberInvestments: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        // isAverageHoldingPeriod: Yup.string().required("This field is required").nullable(),
        isExitStrategy: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
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
        shouldFocusError: false,
        defaultValues: prelimApplicationState.prelimApplication || {}
    });

    useEffect(() => {
        let cancelled = false;
        void (async () => {
            if (!Number(effectiveId)) {
                if (!cancelled) setRiskAssessmentDocMissing(false);
                return;
            }
            const ok = await riskBucketHasFiles();
            if (!cancelled && ok !== null) {
                setRiskAssessmentDocMissing(!ok);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [effectiveId, riskBucketHasFiles, prelimApplicationState.prelimApplication?.id]);

    useEffect(() => {
        if (skipStrategyErrorReportRef.current) return;
        const hasFormErrors = Object.keys(errors).length > 0;
        onSectionHasErrorsChangeRef.current?.(hasFormErrors || riskAssessmentDocMissing);
    }, [errors, riskAssessmentDocMissing]);

    useEffect(
        () => () => {
            onSectionHasErrorsChangeRef.current?.(false);
        },
        []
    );

    const persistStrategySection = async (data: IPrelimApplicationData, silent: boolean): Promise<boolean> => {
        const hasDocument = await riskBucketHasFiles();
        if (hasDocument === null) {
            if (!silent) {
                setDocumentError('Unable to verify the risk assessment document. Check your connection and try again.');
                return false;
            }
            /** Silent full-fund run: do not fail section 2 (or dispatch) on file-server hiccups while other sections validate. */
            setDocumentError('');
            setRiskAssessmentDocMissing(false);
            return true;
        }
        if (!hasDocument) {
            setRiskAssessmentDocMissing(true);
            if (!silent) {
                setDocumentError("Risk Assessment and Mitigation Plan document is mandatory.");
            } else {
                setDocumentError('');
            }
            return false;
        }
        setDocumentError('');
        setRiskAssessmentDocMissing(false);
        await dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, { ...prelimApplicationFormData, ...data })));
        if (!silent && props.onSaveSuccess) {
            props.onSaveSuccess();
        }
        return true;
    };

    const onSubmit = async (data: IPrelimApplicationData) => persistStrategySection(data, false);

    useImperativeHandle(ref, () => ({
        submit: async (opts?: { silent?: boolean }) => {
            const silent = Boolean(opts?.silent);
            /** Full-fund silent run: fail fast on missing risk doc without relying only on RHF `onValid` ordering. */
            if (silent) {
                const hasFile = await riskBucketHasFiles();
                if (hasFile === false) {
                    setRiskAssessmentDocMissing(true);
                    setDocumentError('');
                    return false;
                }
                if (hasFile === null) {
                    setDocumentError('');
                    /** Let `persistStrategySection` / RHF decide; avoid failing the whole fund on transient list errors. */
                }
            }
            let isValid = false;
            await handleSubmit(
                async (data) => {
                    const submitOk = await persistStrategySection(data, silent);
                    isValid = submitOk;
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

    // errors && console.log('errors', JSON.stringify(errors));

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
                        <Typography variant="body1" sx={labelSx}>1. What is your investment strategy and the focus investment sectors for the fund?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("isStrategyBasis")}
                            error={!!errors.isStrategyBasis}
                            helperText={errors.isStrategyBasis?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>2. How does the investment strategy compare to the past fund strategies (if applicable) and Explain the reason for any significant change in your strategy?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("isComparisonPast")}
                            error={!!errors.isComparisonPast}
                            helperText={errors.isComparisonPast?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    {isEquityOriented && (
                        <Grid item xs={12} sx={qSx}>
                            <Typography variant="body1" sx={labelSx}>3. What controls and rights do you take / plan to take with minority shares? How do you ensure / propose to ensure your ability to exit when an opportunity comes? Will the fund typically be looking at gaining control positions? If yes, do you have the skills set to manage such investments? If yes, please give details.</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("isControlsRights")}
                                error={!!errors.isControlsRights}
                                helperText={errors.isControlsRights?.message as string}
                                variant="outlined"
                                sx={fieldSx}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Grid>
                    )}

                    {isDebtOriented && (
                        <Grid item xs={12} sx={qSx}>
                            <Typography variant="body1" sx={labelSx}>3. What rights and protections does the fund obtain in its investments, and how are these covenants enforced? How does the fund ensure timely repayment or exit?</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("isRightsProtections")}
                                error={!!errors.isRightsProtections}
                                helperText={errors.isRightsProtections?.message as string}
                                variant="outlined"
                                sx={fieldSx}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Grid>
                    )}

                    {isEquityOriented && (
                        <Grid item xs={12} sx={qSx}>
                            <Typography variant="body1" sx={labelSx}>4. Have any investments been carried forward or rolled over from previous fund(s)? If yes, please provide the relevant details.</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("isRolledOverInvestments")}
                                error={!!errors.isRolledOverInvestments}
                                helperText={errors.isRolledOverInvestments?.message as string}
                                variant="outlined"
                                sx={fieldSx}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={labelSx}>{isEquityOriented ? '5. Describe the following investment considerations:' : '4. Describe the following investment considerations:'}</Typography>

                        <Box sx={{ ml: 2 }}>
                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>a) Gross return objective of the overall fund</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("isGrossReturnObjective")}
                                error={!!errors.isGrossReturnObjective}
                                helperText={errors.isGrossReturnObjective?.message as string}
                                variant="outlined"
                                sx={{ ...fieldSx, mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />

                            {isEquityOriented && (
                                <>
                                    <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>b) Target investment size and percentage stake</Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        {...register("isTargetInvestmentSize")}
                                        error={!!errors.isTargetInvestmentSize}
                                        helperText={errors.isTargetInvestmentSize?.message as string}
                                        variant="outlined"
                                        sx={{ ...fieldSx, mb: 2 }}
                                        inputProps={{ maxLength: 1000 }}
                                    />
                                </>
                            )}

                            {isDebtOriented && (
                                <>
                                    <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>b) What is the target investment size per transaction, and what proportion of each debt issuance does the fund typically subscribe to?</Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        {...register("isTargetInvestmentSizePerTransaction")}
                                        error={!!errors.isTargetInvestmentSizePerTransaction}
                                        helperText={errors.isTargetInvestmentSizePerTransaction?.message as string}
                                        variant="outlined"
                                        sx={{ ...fieldSx, mb: 2 }}
                                        inputProps={{ maxLength: 1000 }}
                                    />
                                </>
                            )}

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>c) Target number of investments planned and Average holding period for a typical investment</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("isTargetNumberInvestments")}
                                error={!!errors.isTargetNumberInvestments}
                                helperText={errors.isTargetNumberInvestments?.message as string}
                                variant="outlined"
                                sx={{ ...fieldSx, mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>d) Exit strategy</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("isExitStrategy")}
                                error={!!errors.isExitStrategy}
                                helperText={errors.isExitStrategy?.message as string}
                                variant="outlined"
                                sx={{ ...fieldSx, mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#363062', mb: 3, mt: 0 }}>
                            Risk Assessment and Mitigation Plan
                        </Typography>

                        <Box sx={{
                            p: 3,
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: '16px',
                            backgroundColor: '#fafafa',
                            ...(riskAssessmentDocMissing && Number(effectiveId)
                                ? {
                                    backgroundColor: 'rgba(211, 47, 47, 0.06)',
                                    borderColor: 'rgba(211, 47, 47, 0.28)',
                                }
                                : {}),
                        }}>
                            {Number(effectiveId) ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        href="/vcf/templates/Risk Assessment and Mitigation Plan.xlsx"
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
                                        <DocumentChip
                                            label="Upload Document"
                                            validationTitle="Risk Assessment and Mitigation Plan"
                                            id={`sdRiskAssessmentAndMitigationPlan${effectiveId}`}
                                            onAfterUpload={() => {
                                                void refreshRiskAssessmentDocMissing();
                                            }}
                                        />
                                    </span>
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                    Please save the form to upload documents.
                                </Typography>
                            )}
                        </Box>
                        {documentError && (
                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                {documentError}
                            </Typography>
                        )}
                    </Grid>


                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={internalButtonSx}
                            >
                                Save & Continue
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: '#FF671F', mr: 2 }} /><Typography component="span">Loading...</Typography></Box>;
});

export default InvestmentStrategy;

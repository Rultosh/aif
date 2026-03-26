import { Box, Button, Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography, FormHelperText, CircularProgress } from "@mui/material";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
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
import { useDebounceEffect } from "../../../../../hooks/useDebounce";

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
}

const InvestmentStrategy = forwardRef((props: PrelimApplicationProps, ref) => {
    const { id } = useParams();
    const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
    const [prelimApplicationFormData, setPrelimApplicationFormData] = useState(prelimApplicationState.prelimApplication);
    const [actionUid] = useState(uuid());
    const prelimAppicationId = props.prelimApplicationId;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (Number(prelimAppicationId)) {
            dispatch(getPrelimApplicationData(
                wrapArgument(actionUid, Number(prelimAppicationId))
            ));
        }
    }, [prelimAppicationId, actionUid, dispatch]);

    useEffect(() => {
        if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE && prelimApplicationState.prelimApplication?.id) {
            const isInitialLoad = !prelimApplicationFormData?.id;
            setPrelimApplicationFormData(prelimApplicationState.prelimApplication);
            reset(prelimApplicationState.prelimApplication, { keepDirtyValues: !isInitialLoad });
        }
    }, [prelimApplicationState.prelimApplication?.id, prelimApplicationState.status.fetchStatus]);
    const freeformRegx = /^[\s\S]*$/; // Allow all characters for multiline fields, or more permissive set
    const aifCategoryType = prelimApplicationState.prelimApplication?.aifCategoryType || 'Equity Oriented AIF';

    const validationSchema = Yup.object().shape({
        isStrategyBasis: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        // isFocusSectors: Yup.string().required("This field is required").nullable(),
        isComparisonPast: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        // isSignificantChange: Yup.string().required("This field is required").nullable(),
        //isSectorSituations: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        isControlsRights: aifCategoryType === 'Equity Oriented AIF'
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        isRightsProtections: aifCategoryType === 'Debt Oriented AIF'
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        // isInvestmentPolicy: Yup.string().required("This field is required").nullable(),
        // isRisksMitigation: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        isRolledOverInvestments: aifCategoryType === 'Equity Oriented AIF'
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        isGrossReturnObjective: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted"),
        isTargetInvestmentSize: aifCategoryType === 'Equity Oriented AIF'
            ? Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted")
            : Yup.string().nullable(),
        isTargetInvestmentSizePerTransaction: aifCategoryType === 'Debt Oriented AIF'
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
        defaultValues: prelimApplicationState.prelimApplication || {}
    });

    const watchedFields = watch();

    useDebounceEffect(() => {
        const isDataLoaded = prelimApplicationState.status.fetchStatus === FetchStatus.IDLE && 
                           prelimApplicationState.prelimApplication?.id === Number(prelimAppicationId);

        if (isDataLoaded && JSON.stringify(watchedFields) !== JSON.stringify(prelimApplicationState.prelimApplication)) {
            console.log('Auto-saving InvestmentStrategy...');
            dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, { ...prelimApplicationFormData, ...watchedFields })));
        }
    }, [watchedFields], 2000);

    const onSubmit = async (data: IPrelimApplicationData) => {
        await dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, { ...prelimApplicationFormData, ...data })));
        if (props.onSaveSuccess) {
            props.onSaveSuccess();
        }
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            let isValid = false;
            await handleSubmit(
                (data) => {
                    onSubmit(data);
                    isValid = true;
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

                    {aifCategoryType === 'Equity Oriented AIF' && (
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

                    {aifCategoryType === 'Debt Oriented AIF' && (
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

                    {aifCategoryType === 'Equity Oriented AIF' && (
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
                        <Typography variant="body1" sx={labelSx}>{aifCategoryType === 'Equity Oriented AIF' ? '5. Describe the following investment considerations:' : '4. Describe the following investment considerations:'}</Typography>

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

                            {aifCategoryType === 'Equity Oriented AIF' && (
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

                            {aifCategoryType === 'Debt Oriented AIF' && (
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
                            backgroundColor: '#fafafa'
                        }}>
                            {Number(id) ? (
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
                                        <DocumentChip label="Upload Document" validationTitle="Risk Assessment and Mitigation Plan" id={`sdRiskAssessmentAndMitigationPlan${id}`} />
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

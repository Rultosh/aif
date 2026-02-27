import { Box, Button, Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography, FormHelperText } from "@mui/material";
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
import UploadComponents from "../../../../DetailedApplicationComponent/subsections/uploadComponents";

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
}

const InvestmentStrategy = forwardRef((props: PrelimApplicationProps, ref) => {
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
            setPrelimApplicationFormData(prelimApplicationState.prelimApplication);
            reset(prelimApplicationState.prelimApplication);
        }
    }, [prelimApplicationState.prelimApplication?.id, prelimApplicationState.status.fetchStatus]);

    const validationSchema = Yup.object().shape({
        isStrategyBasis: Yup.string().required("This field is required").nullable(),
        // isFocusSectors: Yup.string().required("This field is required").nullable(),
        isComparisonPast: Yup.string().required("This field is required").nullable(),
        // isSignificantChange: Yup.string().required("This field is required").nullable(),
        isSectorSituations: Yup.string().required("This field is required").nullable(),
        isControlsRights: Yup.string().required("This field is required").nullable(),
        // isInvestmentPolicy: Yup.string().required("This field is required").nullable(),
        isRisksMitigation: Yup.string().required("This field is required").nullable(),
        isRolledOverInvestments: Yup.string().required("This field is required").nullable(),
        isGrossReturnObjective: Yup.string().required("This field is required").nullable(),
        isTargetInvestmentSize: Yup.string().required("This field is required").nullable(),
        isTargetNumberInvestments: Yup.string().required("This field is required").nullable(),
        // isAverageHoldingPeriod: Yup.string().required("This field is required").nullable(),
        isExitStrategy: Yup.string().required("This field is required").nullable(),
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IPrelimApplicationData>({
        resolver: yupResolver(validationSchema),
        defaultValues: prelimApplicationState.prelimApplication || {}
    });

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
    const labelSx = { fontWeight: 600, mb: 1, display: 'block', color: '#333' };

    // errors && console.log('errors', JSON.stringify(errors));

    if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE) {
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
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>3. Are there any sectors or types of transactions/situations you would not invest in? If yes, please give details and reasons for the same.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("isSectorSituations")}
                            error={!!errors.isSectorSituations}
                            helperText={errors.isSectorSituations?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>4. What controls and rights do you take / plan to take with minority shares? How do you ensure / propose to ensure your ability to exit when an opportunity comes? Will the fund typically be looking at gaining control positions? If yes, do you have the skills set to manage such investments? If yes, please give details.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("isControlsRights")}
                            error={!!errors.isControlsRights}
                            helperText={errors.isControlsRights?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>5. What are the risks associated with the investments planned under this Fund, and what strategies will be implemented to mitigate those risks?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("isRisksMitigation")}
                            error={!!errors.isRisksMitigation}
                            helperText={errors.isRisksMitigation?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>6. Have any investments been carried forward or rolled over from previous fund(s)? If yes, please provide the relevant details.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("isRolledOverInvestments")}
                            error={!!errors.isRolledOverInvestments}
                            helperText={errors.isRolledOverInvestments?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>7. Describe the following investment considerations:</Typography>

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
                                sx={{ mb: 2 }}
                            />

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>b) Target investment size and percentage stake</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("isTargetInvestmentSize")}
                                error={!!errors.isTargetInvestmentSize}
                                helperText={errors.isTargetInvestmentSize?.message as string}
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>c) Target number of investments planned and Average holding period for a typical investment</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("isTargetNumberInvestments")}
                                error={!!errors.isTargetNumberInvestments}
                                helperText={errors.isTargetNumberInvestments?.message as string}
                                variant="outlined"
                                sx={{ mb: 2 }}
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
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#363062',
                                    '&:hover': { backgroundColor: '#2a254d' },
                                    px: 4,
                                    py: 1,
                                    borderRadius: '8px',
                                    fontWeight: 600
                                }}
                            >
                                Save and Continue
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
});

export default InvestmentStrategy;

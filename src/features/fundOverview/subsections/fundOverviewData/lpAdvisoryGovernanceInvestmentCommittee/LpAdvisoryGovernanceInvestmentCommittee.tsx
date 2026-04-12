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

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
}

const LpAdvisoryGovernanceInvestmentCommittee = forwardRef((props: PrelimApplicationProps, ref) => {
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
    const freeformRegx = /^[\s\S]*$/;
    const validationSchema = Yup.object().shape({
        lpacDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        lpacMemberSelectionDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        lpacLpParticipationDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        //lpacBindingApprovalRightsDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        lpacTotalNumberAndVotingMembersDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        lpacDecisionMakingProcess: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        lpacIndependentMembersDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
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

    const persistLpAdvisorySection = async (data: IPrelimApplicationData, silent: boolean) => {
        await dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, { ...prelimApplicationFormData, ...data })));
        if (!silent && props.onSaveSuccess) {
            props.onSaveSuccess();
        }
    };

    const onSubmit = async (data: IPrelimApplicationData) => persistLpAdvisorySection(data, false);

    useImperativeHandle(ref, () => ({
        submit: async (opts?: { silent?: boolean }) => {
            let isValid = false;
            await handleSubmit(
                async (data) => {
                    await persistLpAdvisorySection(data, Boolean(opts?.silent));
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
                        <Typography variant="body1" sx={labelSx}>1. Is an LPAC/Advisory Board constituted? If yes, then please provide details of the same along with the Frequency of LPAC meetings.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacDetails")}
                            error={!!errors.lpacDetails}
                            helperText={errors.lpacDetails?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>
                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>2. How are LPAC members selected? Are large LPs automatically entitled to LPAC seats?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacMemberSelectionDetails")}
                            error={!!errors.lpacMemberSelectionDetails}
                            helperText={errors.lpacMemberSelectionDetails?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>3. Total Number of Investment Committee members and the number of voting vs. non-voting members</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacTotalNumberAndVotingMembersDetails")}
                            error={!!errors.lpacTotalNumberAndVotingMembersDetails}
                            helperText={errors.lpacTotalNumberAndVotingMembersDetails?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>4. Decisions in IC are taken through simple majority/Unanimously/Veto Rights.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacDecisionMakingProcess")}
                            error={!!errors.lpacDecisionMakingProcess}
                            helperText={errors.lpacDecisionMakingProcess?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>5. Are any IC members independent? If yes, please provide details.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacIndependentMembersDetails")}
                            error={!!errors.lpacIndependentMembersDetails}
                            helperText={errors.lpacIndependentMembersDetails?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>6. Can LPs participate in IC discussions? If yes, in what capacity?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacLpParticipationDetails")}
                            error={!!errors.lpacLpParticipationDetails}
                            helperText={errors.lpacLpParticipationDetails?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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

export default LpAdvisoryGovernanceInvestmentCommittee;

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
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
            setPrelimApplicationFormData(prelimApplicationState.prelimApplication);
            reset(prelimApplicationState.prelimApplication);
        }
    }, [prelimApplicationState.prelimApplication?.id, prelimApplicationState.status.fetchStatus]);

    const validationSchema = Yup.object().shape({
        lpacDetails: Yup.string().required("This field is required").nullable(),
        lpacMemberSelectionDetails: Yup.string().required("This field is required").nullable(),
        lpacLpParticipationDetails: Yup.string().required("This field is required").nullable(),
        lpacBindingApprovalRightsDetails: Yup.string().required("This field is required").nullable(),
        lpacTotalNumberAndVotingMembersDetails: Yup.string().required("This field is required").nullable(),
        lpacDecisionMakingProcess: Yup.string().required("This field is required").nullable(),
        lpacIndependentMembersDetails: Yup.string().required("This field is required").nullable(),
    });

    const {
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
    const labelSx = { fontWeight: 600, mb: 1, display: 'block', color: '#333', textAlign: 'justify' };
    
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

    if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE) {
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
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>3. Does LPAC have binding approval rights or only advisory powers? Provide details.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacBindingApprovalRightsDetails")}
                            error={!!errors.lpacBindingApprovalRightsDetails}
                            helperText={errors.lpacBindingApprovalRightsDetails?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>4. Total Number of Investment Committee members and the number of voting vs. non-voting members</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacTotalNumberAndVotingMembersDetails")}
                            error={!!errors.lpacTotalNumberAndVotingMembersDetails}
                            helperText={errors.lpacTotalNumberAndVotingMembersDetails?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>5. Decisions in IC are taken through simple majority/Unanimously/Veto Rights.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacDecisionMakingProcess")}
                            error={!!errors.lpacDecisionMakingProcess}
                            helperText={errors.lpacDecisionMakingProcess?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>6. Are any IC members independent? If yes, please provide details.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacIndependentMembersDetails")}
                            error={!!errors.lpacIndependentMembersDetails}
                            helperText={errors.lpacIndependentMembersDetails?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>7. Can LPs participate in IC discussions? If yes, in what capacity?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("lpacLpParticipationDetails")}
                            error={!!errors.lpacLpParticipationDetails}
                            helperText={errors.lpacLpParticipationDetails?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={internalButtonSx}
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

export default LpAdvisoryGovernanceInvestmentCommittee;

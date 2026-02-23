import { Box, Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography, FormHelperText } from "@mui/material";
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

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
}

const Others = forwardRef((props: PrelimApplicationProps, ref) => {
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
        if (prelimApplicationState.prelimApplication) {
            setPrelimApplicationFormData(prelimApplicationState.prelimApplication);
            reset(prelimApplicationState.prelimApplication);
        }
    }, [prelimApplicationState.prelimApplication]);

    const validationSchema = Yup.object().shape({
        otExternalFirms: Yup.string().required("This field is required").nullable(),
        otMonitoringActivities: Yup.string().required("This field is required").nullable(),
        otContributorTerms: Yup.string().required("This field is required").nullable(),
        otPlacementAgents: Yup.string().required("This field is required").nullable(),
        otDecisionApprovals: Yup.string().required("This field is required").nullable(),
        otEmployeeCost: Yup.string().required("This field is required").nullable(),
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

    if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE) {
        return (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 0 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>1. List of external firms (legal, technical, financial/accounting/valuation etc.) who are assisting / would be assisting the Investment Manager in the due diligence process.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otExternalFirms")}
                            error={!!errors.otExternalFirms}
                            helperText={errors.otExternalFirms?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>2. List the activities involved in monitoring and follow-up of investments? And How frequently do the investee companies furnish reports to the Investment Manager? Please give details of the same.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otMonitoringActivities")}
                            error={!!errors.otMonitoringActivities}
                            helperText={errors.otMonitoringActivities?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>3. Are all contributors governed by same terms and conditions or whether anyone or more has been offered special terms or terms different from that of others? If yes, please give details thereof and name of the contributor (along with reasons).</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otContributorTerms")}
                            error={!!errors.otContributorTerms}
                            helperText={errors.otContributorTerms?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>4. Has the Investment Manager or the Fund or the sponsor of anyone associated with the fund engaged any placement agents? If yes, please provide details of funds raised and payment(s) made / to be made to the agents. Please also clarify as to who is bearing the cost of the agents?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otPlacementAgents")}
                            error={!!errors.otPlacementAgents}
                            helperText={errors.otPlacementAgents?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>5. Who approves investment and divestment decisions? Please give details of the process of evaluation of the deals and approvals/investments/exits thereafter.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otDecisionApprovals")}
                            error={!!errors.otDecisionApprovals}
                            helperText={errors.otDecisionApprovals?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>6. What is the overall employee cost for the last 3 years? Please indicate the CTC bands of various grades of employees (total, fixed & variable).</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otEmployeeCost")}
                            error={!!errors.otEmployeeCost}
                            helperText={errors.otEmployeeCost?.message as string}
                            variant="outlined"
                        />
                    </Grid>

                    {/* <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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
                                Save
                            </Button>
                        </Box>
                    </Grid> */}
                </Grid>
            </Box>
        );
    }

    return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
});

export default Others;

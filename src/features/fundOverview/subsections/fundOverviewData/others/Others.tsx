import { Box, Button, Grid, TextField, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { getPrelimApplicationData, PrelimApplicationState, selectPrelimApplication, updatePrelimApplicationAsync } from "../prelimApplicationDataSlice";
import { IPrelimApplicationData } from "../IPrelimApplicationData";
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { FetchStatus } from "../../../../../lib/api-status/IStatus";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DownloadIcon from '@mui/icons-material/Download';
import { useParams } from 'react-router-dom';
import DocumentChip from "../../../../../components/DocumentChip";
import * as Yup from "yup";
import { useDebounceEffect } from "../../../../../hooks/useDebounce";

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
}

const Others = forwardRef((props: PrelimApplicationProps, ref) => {
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
            setPrelimApplicationFormData(prelimApplicationState.prelimApplication);
            reset(prelimApplicationState.prelimApplication);
        }
    }, [prelimApplicationState.prelimApplication?.id, prelimApplicationState.status.fetchStatus]);
    const freeformRegx = /^[a-zA-Z0-9_\.\-, _()/]+$/;
    const validationSchema = Yup.object().shape({
       // otExternalFirms: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        otMonitoringActivities: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        otContributorTerms: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        //otPlacementAgents: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        otDecisionApprovals: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        //otEmployeeCost: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IPrelimApplicationData>({
        resolver: yupResolver(validationSchema),
        defaultValues: prelimApplicationState.prelimApplication || {}
    });

    const watchedFields = watch();

    useDebounceEffect(() => {
        if (Number(prelimAppicationId) && JSON.stringify(watchedFields) !== JSON.stringify(prelimApplicationState.prelimApplication)) {
            console.log('Auto-saving Others...');
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

    if (prelimApplicationState.status.fetchStatus === FetchStatus.FAILED) {
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
                        <Typography variant="body1" sx={labelSx}>1. List the activities involved in monitoring and follow-up of investments? And How frequently do the investee companies furnish reports to the Investment Manager? Please give details of the same.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otMonitoringActivities")}
                            error={!!errors.otMonitoringActivities}
                            helperText={errors.otMonitoringActivities?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>2. Are all contributors governed by same terms and conditions or whether anyone or more has been offered special terms or terms different from that of others? If yes, please give details thereof and name of the contributor (along with reasons).</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otContributorTerms")}
                            error={!!errors.otContributorTerms}
                            helperText={errors.otContributorTerms?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>3. Who approves investment and divestment decisions? Please give details of the process of evaluation of the deals and approvals/investments/exits thereafter.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("otDecisionApprovals")}
                            error={!!errors.otDecisionApprovals}
                            helperText={errors.otDecisionApprovals?.message as string}
                            variant="outlined"
                            sx={fieldSx}
                            inputProps={{ maxLength: 1000 }}
                        />
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
                            {Number(id) ? (
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
                                        <DocumentChip label="Upload Document" id={`sdEmpanelledListOfExternalFirms${id}`} />
                                    </span>
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                    Please save the form to upload documents.
                                </Typography>
                            )}
                        </Box>
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

    return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: '#FF671F', mr: 2 }} /><Typography component="span">Loading...</Typography></Box>;
});

export default Others;

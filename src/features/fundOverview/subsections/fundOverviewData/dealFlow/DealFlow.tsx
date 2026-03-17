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
import DownloadIcon from '@mui/icons-material/Download';
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
    const freeformRegx = /^[a-zA-Z0-9_\.\-, ]+$/;
    const validationSchema = Yup.object().shape({
        dfTotalDealsEvaluated: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        //dfCurrentPipeline: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        // dfSourcingBreakdown: Yup.string().required("This field is required").nullable(),
        // dfConversionRatio: Yup.number().required("This field is required").nullable(),
        dfMeetingFrequency: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfInvestigationDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfExclusiveVC: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfDirectorshipsPolicy: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfConsolidatedInfo: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfNAVFrequency: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        //dfValuationReport: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        dfNAVGuidelines: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
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

    if (prelimApplicationState.status.fetchStatus === FetchStatus.IDLE) {
        return (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 0 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>1. Total number of business plans / deals evaluated since Fund inception and Conversion ratio for transactions sourced to those completed.</Typography>
                        <TextField
                            fullWidth
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
                        <Typography variant="body1" sx={labelSx}>4. Is the Investment Manager exclusively handling VC/PE/Private Credit business or is it also doing any other business or activity?</Typography>
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

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>5. How many directorships does each Investment Manager (employee) hold in the investee company?</Typography>
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

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={labelSx}>6. What is the reporting structure/procedure for the contributors.</Typography>

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
                            {Number(id) ? (
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
                                        <DocumentChip label="Upload Document" id={`sdDetailsOfCurrentPipelineOfDealsUnderConsideration${id}`} />
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
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
});

export default DealFlow;

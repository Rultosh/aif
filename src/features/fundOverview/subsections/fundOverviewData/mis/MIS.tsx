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
import UploadIcon from '@mui/icons-material/Upload';
import DocumentChip from "../../../../../components/DocumentChip";
import FileUploadService from "../../../../../components/FileUploadService";
import * as Yup from "yup";

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
}

const MIS = forwardRef((props: PrelimApplicationProps, ref) => {
    const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
    const [prelimApplicationFormData, setPrelimApplicationFormData] = useState(prelimApplicationState.prelimApplication);
    const [actionUid] = useState(uuid());
    const prelimAppicationId = props.prelimApplicationId;
    const dispatch = useAppDispatch();
    const [documentError, setDocumentError] = useState('');

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
    const freeformRegx = /^[\s\S]*$/;
    const validationSchema = Yup.object().shape({
        msMeetingFrequency: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        msInvestigationDetails: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        msExclusiveVC: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        msDirectorshipsPolicy: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        otConsolidatedInfo: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        otNAVFrequency: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        otValuationReport: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
        otNAVGuidelines: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
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

    const onSubmit = async (data: IPrelimApplicationData): Promise<boolean> => {
        const pid = String(prelimAppicationId ?? '');
        if (!Number(pid)) {
            setDocumentError('Please save the form to upload documents.');
            return false;
        }
        const buckets = [
            `investmentOrganisationStructure${pid}`,
            `investmentPolicyDirectorship${pid}`,
        ];
        const checks = await Promise.all(buckets.map((bucket) => hasUploadedFiles(bucket)));
        if (!checks.every(Boolean)) {
            setDocumentError('Please upload both mandatory documents (organisation structure and directorships policy) before proceeding.');
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
                    isValid = await onSubmit(data);
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

    const isFetchFailure = prelimApplicationState.status.fetchStatus === FetchStatus.FAILED && !prelimApplicationState.prelimApplication?.id;
    if (isFetchFailure) {
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
                        <Typography variant="body1" sx={labelSx}>1. Frequency of meetings to update the contributor.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("msMeetingFrequency")}
                            error={!!errors.msMeetingFrequency}
                            helperText={errors.msMeetingFrequency?.message as string}
                            variant="outlined"
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>2. Please attach the organisation structure / chart of the Investment Manager.</Typography>
                        {/* <TextField
                            fullWidth
                            multiline
                            rows={3}
                            {...register("msOrgStructure")}
                            error={!!errors.msOrgStructure}
                            helperText={errors.msOrgStructure?.message as string}
                            variant="outlined"
                        /> */}
                        <Box sx={{ mt: 1 }}>
                            <Box sx={{
                                p: 3,
                                border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: '16px',
                                backgroundColor: '#fafafa'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <UploadIcon sx={{ color: '#363062', mr: 2 }} />
                                    <Typography variant="subtitle2" sx={{ color: '#666' }}>
                                        (Max. file size 5 MB each)
                                    </Typography>
                                </Box>

                                {Number(prelimAppicationId) ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs="auto">
                                            <DocumentChip label="Organisation structure/chart of the Investment Manager" id={`investmentOrganisationStructure${prelimAppicationId}`} required />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="Policy for Directorships held by Investment Managers" id={`investmentPolicyDirectorship${prelimAppicationId}`} required />
                                        </Grid>
                                    </Grid>
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
                        </Box>
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>3. Has any of the member(s) of the Board of Directors of Investment Manager, Trustee, Sponsor or employee(s) of the Investment Manager have been investigated by any regulatory authority during the last 5 years? If yes, please give full details of the same.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("msInvestigationDetails")}
                            error={!!errors.msInvestigationDetails}
                            helperText={errors.msInvestigationDetails?.message as string}
                            variant="outlined"
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>4. Is the Investment Manager exclusively handling VC business or is it also doing any other business or activity?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("msExclusiveVC")}
                            error={!!errors.msExclusiveVC}
                            helperText={errors.msExclusiveVC?.message as string}
                            variant="outlined"
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>5. How many directorships does each Investment Manager (employee) hold?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register("msDirectorshipsPolicy")}
                            error={!!errors.msDirectorshipsPolicy}
                            helperText={errors.msDirectorshipsPolicy?.message as string}
                            variant="outlined"
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={qSx}>
                        <Typography variant="body1" sx={labelSx}>6. What is the reporting structure/procedure for the contributors (quarterly/ half-yearly/annual)</Typography>

                        <Box sx={{ ml: 2 }}>
                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>a) Consolidated information of investee companies</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("otConsolidatedInfo")}
                                error={!!errors.otConsolidatedInfo}
                                helperText={errors.otConsolidatedInfo?.message as string}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>b) Frequency of NAV reporting</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("otNAVFrequency")}
                                error={!!errors.otNAVFrequency}
                                helperText={errors.otNAVFrequency?.message as string}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>c) Detailed valuation report</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("otValuationReport")}
                                error={!!errors.otValuationReport}
                                helperText={errors.otValuationReport?.message as string}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />

                            <Typography variant="body2" sx={{ ...labelSx, mt: 2 }}>d) Guidelines for calculating NAV</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                {...register("otNAVGuidelines")}
                                error={!!errors.otNAVGuidelines}
                                helperText={errors.otNAVGuidelines?.message as string}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
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
                                Save & Continue
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
});

export default MIS;

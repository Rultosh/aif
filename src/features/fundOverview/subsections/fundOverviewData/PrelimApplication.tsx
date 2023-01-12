import { Box, Button, Card, CardContent, Chip, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState, useEffect } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { clearPrelimApplication, createPrelimApplicationAsync, getPrelimApplicationData, PrelimApplicationState, selectPrelimApplication, updatePrelimApplicationAsync } from "./prelimApplicationDataSlice";
import { defaultIPrelimApplicationData, IPrelimApplicationData } from "./IPrelimApplicationData";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { FetchStatus } from "../../../../lib/api-status/IStatus";
import { Today } from "@mui/icons-material";
import { Form } from "react-router-dom";
import { margin } from "@mui/system";
import DocumentChip from "../../../../components/DocumentChip";
import MasterData from "../../../../components/master-data/MasterData";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormHelperText from '@mui/material/FormHelperText';

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
}

export const PrelimApplicationData: React.FC<PrelimApplicationProps> = (props) => {
    const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
    const [prelimApplicationFormData, setPrelimApplicationFormData] = useState(prelimApplicationState.prelimApplication);
    const [actionUid] = useState(uuid());
    const [prelimAppicationId, setPrelimApplicationId] = useState(props.prelimApplicationId);
    const [firstClosingSwitch, setfirstClosingSwitch] = useState(false);

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (Number(prelimAppicationId)) {
            dispatch(getPrelimApplicationData(
                wrapArgument(actionUid, Number(prelimAppicationId))
            ))
        }
    }, [])

    useEffect(() => {
        // console.log('useEffect', prelimAppicationId, prelimApplicationState.prelimApplication)
        setPrelimApplicationFormData(prelimApplicationState.prelimApplication)
        setPrelimApplicationId(String(prelimApplicationState.prelimApplication.id))
    }, [prelimApplicationState.prelimApplication, prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    const setDateValue = (key: String, value: any) => {
        let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };

        copiedValue[key as keyof IPrelimApplicationData] = value;

        setPrelimApplicationFormData(copiedValue)
    };

    const savePrelimApplicationForm = (data: any) => {
        if (prelimApplicationFormData.id) {
            dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, prelimApplicationFormData)));
        } else {
            dispatch(createPrelimApplicationAsync(wrapArgument(actionUid, prelimApplicationFormData)));
        }
    }

    const handleChange = (ev: any) => {
        ev.preventDefault();
        // console.log('handle change', ev.target.id, ev.target.value);

        let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };

        if (ev.target.id) {
            copiedValue[ev.target.id as keyof IPrelimApplicationData] =
                ev.target.id !== undefined ? ev.target.value : ev.target.value
        } else {
            copiedValue[ev.target.name as keyof IPrelimApplicationData] = ev.target.value
        }


        setPrelimApplicationFormData(copiedValue)
    };

    const handleSelectChange = (id: String, value: any) => {
        let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };
        copiedValue[id as keyof IPrelimApplicationData] = value;
        setPrelimApplicationFormData(copiedValue);
    }

    const handleToggle = () => {
        let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };
        copiedValue.firstClosing = !firstClosingSwitch;
        setPrelimApplicationFormData(copiedValue);
        setfirstClosingSwitch(!firstClosingSwitch)
    }
    
    const validationSchema = Yup.object().shape({
        nameOfTheFund: Yup.string().required("Name of the Fund is required"),
        sponsor: Yup.string().required("Sponsor is required"),
        investmentManager: Yup.string().required("Investment Manager is required"),
        fundManager: Yup.string(),
        dealType: Yup.string(),
        impact: Yup.string(),
        aifCategory: Yup.string(),
        dateOfFilingWithSEBI: Yup.string().required("This value is required").nullable(),
        dealSector: Yup.string(),
        // dealSubsector: Yup.string(),
        sdFirstClosingDomesticAmountDate: Yup.string().required("This value is required").nullable(),
        sdFirstCorpusOverseasAmountDate: Yup.string().required("This value is required").nullable(),
        nameOfTrustee: Yup.string().required("Name of Trustee is required"),
        contributionSought: Yup.string().required("Contribution Sought is required"),
        termOfFund: Yup.string().required("Term of Fund is required"),
        commitmentPeriod: Yup.string().required("Commitment Period is required"),
        preferredReturn: Yup.string().required("Preferred Return is required"),
        managementFees: Yup.string().required("Management Fees is required"),
        carriedInterest: Yup.string().required("Carried Interest is required"),
        description: Yup.string().required("Description is required"),
        investmentStrategy: Yup.string().required("Investment Strategy is required"),
        sdDescription: Yup.string().required("Capital raised till date is required"),
        sdTargetCorpusDomestic: Yup.string().required("Domestic is required"),
        sdTargetCorpusOverseas: Yup.string().required("Overseas is required"),
        sdTotalTargetCorpus: Yup.string().required("Total Target Corpus is required"),
        sdFirstClosingDomesticAmount: Yup.string().required("Domestic Amount is required"),
        sdFirstClosingOverseasAmount: Yup.string().required("Overseas Amount is required"),
    });

    const {
        control,
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const childToParentSelect = (formDataName: any, data: any) => {
        console.log(data);
        setValue(formDataName, data);
    };

    const onSubmit = (data: any) => {
        console.log(data);
        setPrelimApplicationFormData(data);
        savePrelimApplicationForm(data);
    };

    const dealSubSectorValues = {
        "26": {
            values: ["Blue Collar Outsourcing",
                "Equipment Rental",
                "Specialised BPO or IT Services",
                "White Collar Outsourcing",
                "Other"
            ]
        },
        "27": {
            values: ["Apparel",
                "Education",
                "Food Retailers",
                "General Retailers",
                "Healthcare",
                "Household Durables",
                "Leisure",
                "Restaurants",
                "Other"
            ]
        },
        "28": {
            values: [
                "Banking",
                "Wealth and Distribution",
                "Specialty Credit",
                "Other"
            ]
        },
        "29": {
            values: [
                "Electronics", "Medical Technology", "Industrial Consumables", "Power", "Transportation Equipment", "Water Waste Management", "Other"
            ]
        },
        "30": {
            values: [
                "Distribution", "Non Renewables", "Renewables", "Transport", "Other"
            ]
        },
        "31": {
            values: [
                "Hospitality", "Industrial", "Office", "Residential", "Retail", "Other"

            ]
        },
        "32": {
            values: [
                "Agribusiness", "Media", "Regional or Sector Funds", "Telecoms", "Other"
            ]
        }
    }

    console.log((dealSubSectorValues as any)[String(prelimApplicationFormData.dealSector || 0)]?.values, prelimApplicationFormData.dealSubsector);

    if (prelimApplicationState.status.fetchStatus == FetchStatus.IDLE)
        return (
            // <form onSubmit={savePrelimApplicationForm}>
            <Box component="form">
                <Grid container spacing={2} >
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="nameOfTheFund"
                            label="Name of the Fund"
                            // value={prelimApplicationFormData.nameOfTheFund || ''}
                            {...register("nameOfTheFund")}
                            error={errors.nameOfTheFund ? true : false}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', ml: 2 }}
                        />
                        <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                            <>{errors.nameOfTheFund?.message}</>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="sponsor"
                            label="Sponsor"
                            // value={prelimApplicationFormData.sponsor || ''}
                            {...register("sponsor")}
                            error={errors.sponsor ? true : false}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.sponsor?.message}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            id="investmentManager"
                            label="Investment Manager (IM)/AMC"
                            {...register("investmentManager")}
                            error={errors.investmentManager ? true : false}
                            // value={prelimApplicationFormData.investmentManager || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.investmentManager?.message}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">Fund Manager</InputLabel>
                            {/* <Select
                                labelId="fundManager"
                                id="fundManager"
                                value={prelimApplicationFormData.fundManager || ''}
                                onChange={handleChange}
                                name="fundManager"
                            >

                                <MenuItem key={"Fund of funds"} value={"1"}>First Time Fund Manager</MenuItem>
                                <MenuItem key={"Asipre for Start-ups"} value={"2"}>Existing but new to SIDBI</MenuItem>
                                <MenuItem key={"Up Start-up Fund"} value={"3"}>Existing with SIDBI</MenuItem>
                            </Select> */}
                            <MasterData propertyType="fundManager"
                                propertyValue={prelimApplicationFormData.fundManager || 0}
                                onChange={handleSelectChange} propertyRequired="required" control={control} propertyTitle='Fund Manager' childToParentSelect={childToParentSelect} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="standard" sx={{ display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">Deal Type</InputLabel>
                            {/* <Select
                                labelId="dealType"
                                id="dealType"
                                value={prelimApplicationFormData.dealType || ''}
                                onChange={handleChange}
                                name="dealType"
                            >

                                <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                                <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                                <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                            </Select> */}
                            <MasterData propertyType="dealType"
                                propertyValue={prelimApplicationFormData.dealType || 0}
                                onChange={handleSelectChange} propertyRequired="required" control={control} propertyTitle="Deal Type" childToParentSelect={childToParentSelect} />
                        </FormControl>

                    </Grid>

                    <Grid item xs={4}>

                        <FormControl variant="standard" sx={{ display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">Impact Fund</InputLabel>
                            {/* <Select
                                labelId="impact"
                                id="impact"
                                value={prelimApplicationFormData.impact || ''}
                                onChange={handleChange}
                                name="impact"
                            >
                                <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                                <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                                <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                            </Select> */}
                            <MasterData propertyType="impact"
                                propertyValue={prelimApplicationFormData.impact || 0}
                                onChange={handleSelectChange} propertyRequired="required" control={control} propertyTitle='Impact Fund' childToParentSelect={childToParentSelect} />
                        </FormControl>

                    </Grid>

                    <Grid item xs={4}>

                        <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">AIF Category</InputLabel>
                            {/* <Select
                                labelId="aifCategory"
                                id="aifCategory"
                                value={prelimApplicationFormData.aifCategory || ''}
                                onChange={handleChange}
                                name="aifCategory"
                            >

                                <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                                <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                                <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                            </Select> */}
                            <MasterData propertyType="aifCategory"
                                propertyValue={prelimApplicationFormData.aifCategory || 0}
                                onChange={handleSelectChange} propertyRequired="required" control={control} propertyTitle='AIF Category' childToParentSelect={childToParentSelect} />
                        </FormControl>

                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="nameOfTrustee"
                            label="Name Of The Trustee"
                            {...register("nameOfTrustee")}
                            error={errors.nameOfTrustee ? true : false}
                            // value={prelimApplicationFormData.nameOfTrustee || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.nameOfTrustee?.message}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4} >
                        <Box sx={{ mr: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <Stack spacing={3}>
                                    <Controller
                                        name="dateOfFilingWithSEBI"
                                        control={control}
                                        defaultValue={null}
                                        render={({
                                            field: { onChange, value },
                                            fieldState: { error, invalid }
                                        }) => (
                                            // console.log(invalid),
                                            (<DesktopDatePicker
                                                inputFormat='DD/MM/YYYY'
                                                disableFuture={true}
                                                label="Date of Filling PPM with SEBI"
                                                value={prelimApplicationFormData.dateOfFilingWithSEBI || null}
                                                minDate={Today.toString()}
                                                onChange={(newValue) => {
                                                    setValue('dateOfFilingWithSEBI', newValue);
                                                    setDateValue("dateOfFilingWithSEBI", newValue);
                                                }}
                                                renderInput={(params) => <TextField
                                                    helperText={(invalid && getValues("dateOfFilingWithSEBI") == null) ? <Typography variant="caption" {...register('dateOfFilingWithSEBI')} color="error">This value is required</Typography> : null} error={invalid} {...params} />}
                                            />
                                            )
                                        )}
                                    />
                                </Stack>
                            </LocalizationProvider>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="contributionSought"
                            label="Contribution sought(INR crores)"
                            {...register("contributionSought")}
                            error={errors.contributionSought ? true : false}
                            // value={prelimApplicationFormData.contributionSought || ''}
                            // onChange={handleChange}
                            //  onKeyUp={(val) =>{
                            //     if(val === '4'){
                            //         return '';
                            //     } else {
                            //         return val;
                            //     }}
                            // }
                            variant="standard"
                            sx={{ display: 'flex', ml: 2 }}
                            onKeyUp={(e) => {
                                if ((e.target as HTMLInputElement).value.length > 4) {
                                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.substring(0, 4);
                                }
                            }}
                            inputProps={{ min: 0, max: 9999, step: 1 }}
                        />
                        <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                            <>{errors.contributionSought?.message}</>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="termOfFund"
                            label="Term of the Fund (No. of months from final closing)"
                            {...register("termOfFund")}
                            error={errors.termOfFund ? true : false}
                            // value={prelimApplicationFormData.termOfFund || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.termOfFund?.message}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="commitmentPeriod"
                            label="Commitment Period (No. of months from first closing)"
                            {...register("commitmentPeriod")}
                            error={errors.commitmentPeriod ? true : false}
                            // value={prelimApplicationFormData.commitmentPeriod || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.commitmentPeriod?.message}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="preferredReturn"
                            label="Preferred Return/Hurdle Rate p.a. Per Tax(%)"
                            {...register("preferredReturn")}
                            error={errors.preferredReturn ? true : false}
                            // value={prelimApplicationFormData.preferredReturn || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', ml: 2 }}
                        />
                        <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                            <>{errors.preferredReturn?.message}</>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="managementFees"
                            label="Management Fee(%)"
                            {...register("managementFees")}
                            error={errors.managementFees ? true : false}
                            // value={prelimApplicationFormData.managementFees || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.managementFees?.message}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="carriedInterest"
                            label="Carried Interest(%)"
                            {...register("carriedInterest")}
                            error={errors.carriedInterest ? true : false}
                            // value={prelimApplicationFormData.carriedInterest || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.carriedInterest?.message}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">Deal Sector</InputLabel>
                            {/* <Select
                                labelId="dealSector"
                                id="dealSector"
                                value={prelimApplicationFormData.dealSector || ''}
                                onChange={handleChange}
                                name="dealSector"
                            >

                                <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                                <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                                <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                            </Select> */}
                            <MasterData propertyType="dealSector"
                                propertyValue={prelimApplicationFormData.dealSector || 0}
                                onChange={handleSelectChange} propertyRequired="required" control={control} propertyTitle='Deal Sector' childToParentSelect={childToParentSelect} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="standard" sx={{ display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">Deal Sub Sector</InputLabel>
                            <Controller
                                name="dealSubsector"
                                control={control}
                                defaultValue={null}
                                render={({
                                    field: { onChange, value },
                                    fieldState: { error, invalid }
                                }) => (
                                    console.log(invalid && (prelimApplicationFormData.dealSubsector || 0 || '')),
                                    (
                                        <>
                                            <Select
                                                labelId="dealSubsector"
                                                id="dealSubsector"
                                                value={String(prelimApplicationFormData.dealSubsector || '')}
                                                onChange={handleChange}
                                                name="dealSubsector"
                                                error={invalid && ((prelimApplicationFormData.dealSubsector || '') == '') ? true : false}
                                            >

                                                {prelimApplicationFormData.dealSector &&
                                                    (dealSubSectorValues as any)[String(prelimApplicationFormData.dealSector || 0)] &&
                                                    (dealSubSectorValues as any)[String(prelimApplicationFormData.dealSector || 0)].values.map((item: string) => {
                                                        return <MenuItem key={item} value={item} selected={String(prelimApplicationFormData.dealSubsector || '') === item}>{item}</MenuItem>
                                                    })}
                                            </Select>
                                            {invalid && ((prelimApplicationFormData.dealSubsector || '') == '') ? <FormHelperText>
                                                <Typography variant="caption" color="error" sx={{ ml: '10px' }}>
                                                    <>Deal Sub Sector is required</>
                                                </Typography>
                                            </FormHelperText> : <></>}
                                        </>
                                    )
                                )}
                            />
                            {/* <MasterData propertyType="dealSubsector" 
                                propertyValue={prelimApplicationFormData.dealSubsector || 0}
                                onChange={handleSelectChange} propertyRequired="required" control={control} propertyTitle='Deal Sub Sector' childToParentSelect={childToParentSelect} /> */}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="description"
                            label="Sector Description(Stage of investment like pre revenue, pre growth, seed stage, series A, Series B etc)"
                            {...register("description")}
                            error={errors.description ? true : false}
                            // value={prelimApplicationFormData.description || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.description?.message}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            id="investmentStrategy"
                            label="Investment Strategy"
                            {...register("investmentStrategy")}
                            error={errors.investmentStrategy ? true : false}
                            // value={prelimApplicationFormData.investmentStrategy || ''}
                            // onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', ml: 2, mr: 2 }}
                        />
                        <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                            <>{errors.investmentStrategy?.message}</>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ backgroundColor: 'white', borderRadius: 1, ml: 2, mb: 2, mr: 2 }}>
                            <Card sx={{ display: 'flex', }}>
                                <CardContent sx={{ flex: 1 }}>
                                    <Grid container spacing={2} >
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'inline-flex' }}>
                                                <UploadIcon />
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>
                                                    Supporting Documents
                                                    <span style={{ fontWeight: "normal" }}>
                                                        (Max. file size 5 MB each)</span> </Typography>
                                            </Box>
                                        </Grid>
                                        {Number(prelimAppicationId) ?
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex' }}>
                                                    <div style={{ margin: '5px' }}>
                                                        <DocumentChip
                                                            label="Pvt. Placement Memorandum"
                                                            id={`sdPvtPlacementMemorandum${prelimAppicationId}`} />
                                                    </div>
                                                    <div style={{ margin: '5px' }}>
                                                        <DocumentChip
                                                            label="IM Agreement"
                                                            id={`sdImAgreement${prelimAppicationId}`} />
                                                    </div>
                                                    <div style={{ margin: '5px' }}>
                                                        <DocumentChip
                                                            label="Trust Deed"
                                                            id={`sdTrustDeal${prelimAppicationId}`} />
                                                    </div>
                                                    <div style={{ margin: '5px' }}>
                                                        <DocumentChip
                                                            label="SEBI Certificate"
                                                            id={`sdSEBICertificate${prelimAppicationId}`} />
                                                        {/* <DocumentChip 
                                                        label="SEBI Certificate" 
                                                        id="sdSEBICertificate"
                                                        onSuccess={handleDocumentUpload}
                                                        onDelete={handleDocumentDelete}
                                                        url={prelimApplicationFormData.sdSEBICertificate} /> */}
                                                        {/* <Chip label="SEBI Certificate" size="medium" sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} /> */}
                                                    </div>
                                                </Box>
                                            </Grid> : <Grid item xs={12}>Please save the form to upload documents</Grid>}
                                        <Grid item xs={12}>
                                            <Grid item xs={4}>
                                                <TextField
                                                    required
                                                    type="number"
                                                    id="sdDescription"
                                                    label="Capital raised till date (INR Crore)"
                                                    {...register("sdDescription")}
                                                    error={errors.sdDescription ? true : false}
                                                    // value={prelimApplicationFormData.sdDescription || ''}
                                                    // onChange={handleChange}
                                                    variant="standard"
                                                    sx={{ display: 'flex', ml: 2 }}
                                                    onKeyUp={(e) => {
                                                        if ((e.target as HTMLInputElement).value.length > 4) {
                                                            (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.substring(0, 4);
                                                        }
                                                    }}
                                                    inputProps={{ min: 0, max: 9999, step: 1 }}
                                                />
                                                <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                    <>{errors.sdDescription?.message}</>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mt: 5, flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Target Corpus</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdTargetCorpusDomestic"
                                                label="Domestic"
                                                {...register("sdTargetCorpusDomestic")}
                                                error={errors.sdTargetCorpusDomestic ? true : false}
                                                // value={prelimApplicationFormData.sdTargetCorpusDomestic || ''}
                                                // onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.sdTargetCorpusDomestic?.message}</>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdTargetCorpusOverseas"
                                                label="Overseas, if any"
                                                {...register("sdTargetCorpusOverseas")}
                                                error={errors.sdTargetCorpusOverseas ? true : false}
                                                // value={prelimApplicationFormData.sdTargetCorpusOverseas || ''}
                                                // onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex' }}
                                                onKeyUp={(e) => {
                                                    if ((e.target as HTMLInputElement).value.length > 4) {
                                                        (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.substring(0, 4);
                                                    }
                                                }}
                                                inputProps={{ min: 0, max: 9999, step: 1 }}
                                            />
                                            <Typography variant="caption" color="error">
                                                <>{errors.sdTargetCorpusOverseas?.message}</>
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdTotalTargetCorpus"
                                                label="Total Target Corpus (INR Crore)"
                                                {...register("sdTotalTargetCorpus")}
                                                error={errors.sdTotalTargetCorpus ? true : false}
                                                // value={prelimApplicationFormData.sdTotalTargetCorpus || ''}
                                                // onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', mr: 2 }}
                                                onKeyUp={(e) => {
                                                    if ((e.target as HTMLInputElement).value.length > 4) {
                                                        (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.substring(0, 4);
                                                    }
                                                }}
                                                inputProps={{ min: 0, max: 9999, step: 1 }}
                                            />
                                            <Typography variant="caption" color="error">
                                                <>{errors.sdTotalTargetCorpus?.message}</>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="subtitle2" sx={{ mt: 5, flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>First Closing</Typography>

                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControlLabel sx={{ mt: 5 }} control={<
                                                Switch checked={!!prelimApplicationFormData.firstClosing}
                                                onChange={handleToggle} />}
                                                label={prelimApplicationFormData.firstClosing ? "Yes" : "No"} />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdFirstClosingDomesticAmount"
                                                label={prelimApplicationFormData.firstClosing ? "Expected Domestic Amount" : "Domestic Amount"}
                                                {...register("sdFirstClosingDomesticAmount")}
                                                error={errors.sdFirstClosingDomesticAmount ? true : false}
                                                // value={prelimApplicationFormData.sdFirstClosingDomesticAmount || ''}
                                                // onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.sdFirstClosingDomesticAmount?.message}</>
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                <Stack spacing={3}>
                                                    <Controller
                                                        name="sdFirstClosingDomesticAmountDate"
                                                        control={control}
                                                        defaultValue={null}
                                                        render={({
                                                            field: { onChange, value },
                                                            fieldState: { error, invalid }
                                                        }) => (
                                                            // console.log(invalid),
                                                            (<DesktopDatePicker
                                                                inputFormat='DD/MM/YYYY'
                                                                label="Date"
                                                                value={prelimApplicationFormData.sdFirstClosingDomesticAmountDate || null}
                                                                minDate={Today.toString()}
                                                                onChange={(newValue) => {
                                                                    setValue('sdFirstClosingDomesticAmountDate', newValue);
                                                                    setDateValue("sdFirstClosingDomesticAmountDate", newValue);
                                                                }}
                                                                renderInput={(params) => <TextField
                                                                    helperText={(invalid && getValues("sdFirstClosingDomesticAmountDate") == null) ? <Typography variant="caption" {...register('sdFirstClosingDomesticAmountDate')} color="error">This value is required</Typography> : null} error={invalid} {...params} />}
                                                            />
                                                            )
                                                        )}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdFirstClosingOverseasAmount"
                                                label={prelimApplicationFormData.firstClosing ? "Expected Overseas Amount" : "Overseas Amount"}
                                                {...register("sdFirstClosingOverseasAmount")}
                                                error={errors.sdFirstClosingOverseasAmount ? true : false}
                                                // value={prelimApplicationFormData.sdFirstClosingOverseasAmount || ''}
                                                // onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex' }}
                                            />
                                            <Typography variant="caption" color="error">
                                                <>{errors.sdFirstClosingOverseasAmount?.message}</>
                                            </Typography>
                                        </Grid>



                                        <Grid item xs={3}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                                <Stack spacing={3}>
                                                    <Controller
                                                        name="sdFirstCorpusOverseasAmountDate"
                                                        control={control}
                                                        defaultValue={null}
                                                        render={({
                                                            field: { onChange, value },
                                                            fieldState: { error, invalid }
                                                        }) => (
                                                            // console.log(invalid),
                                                            (<DesktopDatePicker
                                                                inputFormat='DD/MM/YYYY'
                                                                label="Date"
                                                                value={prelimApplicationFormData.sdFirstCorpusOverseasAmountDate || null}
                                                                minDate={Today.toString()}
                                                                onChange={(newValue) => {
                                                                    setValue('sdFirstCorpusOverseasAmountDate', newValue);
                                                                    setDateValue("sdFirstCorpusOverseasAmountDate", newValue);
                                                                }}
                                                                renderInput={(params) => <TextField
                                                                    helperText={(invalid && getValues("sdFirstCorpusOverseasAmountDate") == null) ? <Typography variant="caption" {...register('sdFirstCorpusOverseasAmountDate')} color="error">This value is required</Typography> : null} error={invalid} {...params} />}
                                                            />
                                                            )
                                                        )}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid item xs={2} >
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disableElevation sx={{ textTransform: 'none', width: 200 }}
                                                    onClick={handleSubmit(onSubmit)}
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </Grid  >
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            // </form>
        );
    else
        return <div>Loading...</div>
}



export default PrelimApplicationData;
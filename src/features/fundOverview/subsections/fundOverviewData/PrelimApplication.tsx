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
        console.log('useEffect', prelimAppicationId, prelimApplicationState.prelimApplication)
        setPrelimApplicationFormData(prelimApplicationState.prelimApplication)

        reset(prelimApplicationState.prelimApplication);

        setPrelimApplicationId(String(prelimApplicationState.prelimApplication.id))
    }, [prelimApplicationState.prelimApplication, prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    const setDateValue = (key: String, value: any) => {
        let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };

        copiedValue[key as keyof IPrelimApplicationData] = value;

        setPrelimApplicationFormData(copiedValue)
    };

    const savePrelimApplicationForm = () => {
        if (prelimApplicationFormData.id) {
            dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, prelimApplicationFormData)));
        } else {
            dispatch(createPrelimApplicationAsync(wrapArgument(actionUid, prelimApplicationFormData)));
        }
    }

    const handleChange = (ev: any) => {
        ev.preventDefault();
        console.log('handle change', ev, ev.target.id, ev.target.value);

        let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };

        if (ev.target.id) {
            copiedValue[ev.target.id as keyof IPrelimApplicationData] =
                ev.target.id !== undefined ? ev.target.value : ev.target.value
        } else {
            copiedValue[ev.target.name as keyof IPrelimApplicationData] = ev.target.value
        }

        setValue(ev.target.id,ev.target.value);
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

    const dealSubSectorValues = {
        "26": {
            values: [
                "Other",
                "Blue Collar Outsourcing",
                "Equipment Rental",
                "Oil and Gas Services",
                "Specialised BPO or IT Services",
                "Testing and Inspection",
                "Transport Logistics",
                "Water Waste Management",
                "White Collar Outsourcing",
            ]
        },
        "27": {
            values: [
                "Other",
                "Apparel",
                "Education",
                "Food and Beverage Producers",
                "Food Retailers",                
                "General Retailers",
                "Healthcare",
                "Home and Personal Care",
                "Household Durables",
                "Leisure",
                "Restaurants",
            ]
        },
        "28": {
            values: [
                "Other",
                "Banking",
                "FS Infrastructure and Payments",
                "Specialty Credit",
                "Wealth and Distribution",
            ]
        },
        "29": {
            values: [
                "Other",
                "Construction and Building Equipment",
                "Construction and Building Materials",
                "Electronics", 
                "Farm and Agriculture",
                "Industrial Consumables", 
                "Medical Technology", 
                "Paper, Packaging and Print",
                "Power", 
                "Transportation Equipment", 
                "Water Waste Management", 
            ]
        },
        "30": {
            values: [
                "Other", "Distribution", "Renewables", "Non Renewables", "Transport"
            ]
        },
        "31": {
            values: [
                "Other", "Hospitality", "Industrial", "Office", "Residential", "Retail", 
            ]
        },
        "32": {
            values: [
                "Other", 
                "Agribusiness", 
                "Media", "Minerals, Oil and Gas", 
                "Regional or Sector Funds", 
                "Telecoms"
            ]
        }
    }

    console.log((dealSubSectorValues as any)[String(prelimApplicationFormData.dealSector || 0)]?.values, prelimApplicationFormData.dealSubsector);
    
    const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
    const htmlTagsNotAllowed = "Tags not allowed in input.";

    const validationSchema = Yup.object().shape({
        nameOfTheFund: Yup.string().required("Name of the Fund is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        sponsor: Yup.string().required("Sponsor is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        investmentManager: Yup.string().required("Investment Manager is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        // fundManager: Yup.string(),
        // dealType: Yup.string(),
        // impact: Yup.string(),
        // aifCategory: Yup.string(),
        dateOfFilingWithSEBI: Yup.string().required("This value is required").nullable(),
        // dealSector: Yup.string(),
        // dealSubsector: Yup.string().required("Deal Sub Sector is required"),
        nameOfTrustee: Yup.string().required("Name of Trustee is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        contributionSought: Yup.string().required("Contribution Sought is required").test("test-name", "Enter value that cannot exceed 25% of target corpus", function (value: any) {
            let sdTotalTargetCorpusVal = Number(prelimApplicationFormData.sdTotalTargetCorpus || '0');
            let contributionSoughtVal = Number(prelimApplicationFormData.contributionSought || '0');
            let sdTotalTargetCorpusValCalc = sdTotalTargetCorpusVal * 0.25; // Not more than 25%
            if (sdTotalTargetCorpusValCalc < contributionSoughtVal) {
              return false;
            }
            return true;
          }),
        termOfFund: Yup.string().required("Term of Fund is required"),
        commitmentPeriod: Yup.string().required("Commitment Period is required"),
        preferredReturn: Yup.string().required("Preferred Return is required"),
        managementFees: Yup.string().required("Management Fees is required"),
        carriedInterest: Yup.string().required("Carried Interest is required"),
        description: Yup.string().required("Description is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        investmentStrategy: Yup.string().required("Investment Strategy is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        sdDescription: Yup.string().required("Capital raised till date is required"),
        sdTargetCorpusDomestic: Yup.string().required("Domestic is required"),
        sdTargetCorpusOverseas: Yup.string().required("Overseas is required"),
        sdTotalTargetCorpus: Yup.string().required("Total Target Corpus is required"),
        sdGreenShoeTargetCorpusDomestic: Yup.string().required("Domestic (Green Shoe) is required"),
        sdGreenShoeTargetCorpusOverseas: Yup.string().required("Overseas (Green Shoe) is required"),
        sdGreenShoeTotalTargetCorpus: Yup.string().required("Total Target Corpus (Green Shoe) is required"),
        sdFirstClosingDomesticAmount: Yup.string().required("Domestic Amount is required"),
        sdFirstClosingOverseasAmount: Yup.string().required("Overseas Amount is required"),
        sdFirstClosingDomesticAmountDate: Yup.string().required("This value is required").nullable(),
        sdFirstCorpusOverseasAmountDate: Yup.string().required("This value is required").nullable(),
    });

    const {
        control,
        register,
        handleSubmit,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        // defaultValues: prelimApplicationFormData
    });

    console.log(prelimApplicationFormData);
    const onSubmit = (data: any) => {
        console.log(data);
        // setPrelimApplicationFormData(data);
        savePrelimApplicationForm();
    };
    
    console.log(getValues());

    if (prelimApplicationState.status.fetchStatus == FetchStatus.IDLE)
        return (
            // <form onSubmit={savePrelimApplicationForm}>
            <Box component="form">
                <Grid container spacing={2} >
                    <Grid item xs={4}>
                        <FormControl variant="standard" sx={{ display: 'flex', ml: 2 }}>
                            <InputLabel id="demo-simple-select-standard-label">Scheme</InputLabel>
                            <Select
                                labelId="scheme"
                                id="scheme"
                                value={String(prelimApplicationFormData.scheme || '')}
                                {...register("scheme")}
                                error={(errors.scheme && getValues("scheme") == '') ? true : false}
                                onChange={handleChange}
                                name="scheme"
                            >
                                <MenuItem key={"Fund of funds"} value={'0'} selected={String(prelimApplicationFormData.scheme || '') === '0'}>Fund of funds</MenuItem>
                                <MenuItem key={"Aspire for Start-ups"} value={'1'} selected={String(prelimApplicationFormData.scheme || '') === '1'}>Aspire for Start-ups</MenuItem>
                                <MenuItem key={"UP Start-up Fund"} value={'2'} selected={String(prelimApplicationFormData.scheme || '') === '2'}>UP Start-up Fund</MenuItem>
                            </Select>
                            <Typography variant="caption" color="error">
                            <>{(errors.scheme && getValues("scheme") == '')?errors.scheme.message : ''}</>
                            </Typography>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="nameOfTheFund"
                            label="Name of the Fund"
                            value={prelimApplicationFormData.nameOfTheFund || ''}
                            {...register("nameOfTheFund")}
                            error={errors.nameOfTheFund ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', ml: 2 }}
                        />
                        <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                            <>{errors.nameOfTheFund ?errors.nameOfTheFund.message : ''}</>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="sponsor"
                            label="Sponsor"
                            value={prelimApplicationFormData.sponsor || ''}
                            {...register("sponsor")}
                            error={errors.sponsor ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.sponsor?errors.sponsor.message : ''}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            id="investmentManager"
                            label="Investment Manager (IM)/AMC"
                            value={prelimApplicationFormData.investmentManager || ''}
                            {...register("investmentManager")}
                            error={errors.investmentManager ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                        <Typography variant="caption" color="error">
                           <>{errors.investmentManager?errors.investmentManager.message : ''}</>
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
                                onChange={handleSelectChange} />
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
                                onChange={handleSelectChange} />
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
                                onChange={handleSelectChange} />
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
                                onChange={handleSelectChange} />
                        </FormControl>

                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="nameOfTrustee"
                            label="Name Of The Trustee"
                            value={prelimApplicationFormData.nameOfTrustee || ''}
                            {...register("nameOfTrustee")}
                            error={errors.nameOfTrustee ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.nameOfTrustee?errors.nameOfTrustee.message : ''}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4} >
                        <Box sx={{ mr: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <Stack spacing={3}>
                                    <Controller
                                        name="dateOfFilingWithSEBI"
                                        control={control}
                                        // defaultValue={null}
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
                                                onChange={(newValue: any) => {
                                                    setValue('dateOfFilingWithSEBI', newValue);
                                                    setDateValue("dateOfFilingWithSEBI", newValue);
                                                }}
                                                renderInput={(params) => <TextField
                                                    helperText={(invalid && getValues("dateOfFilingWithSEBI") == null && (prelimApplicationFormData.dateOfFilingWithSEBI || '') == '') ? <Typography variant="caption" {...register('dateOfFilingWithSEBI')} color="error">This value is required</Typography> : null} error={invalid} {...params} />}
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
                            label="Contribution sought(₹ crores)"
                            value={prelimApplicationFormData.contributionSought || ''}
                            {...register("contributionSought")}
                            error={errors.contributionSought ? true : false}
                            onChange={handleChange}
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
                           <>{errors.contributionSought?errors.contributionSought.message : ''}</>
                       </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="termOfFund"
                            label="Term of the Fund (No. of months from first closing)"
                            {...register("termOfFund")}
                            error={errors.termOfFund && getValues("termOfFund") ==  '' ? true : false}
                            value={prelimApplicationFormData.termOfFund || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                            inputProps={{ min: 0 }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.termOfFund && getValues("termOfFund") ==  ''?errors.termOfFund.message : ''}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="commitmentPeriod"
                            label="Commitment Period (No. of months from first closing)"
                            value={prelimApplicationFormData.commitmentPeriod || ''}
                            {...register("commitmentPeriod")}
                            error={errors.commitmentPeriod && getValues("commitmentPeriod") ==  '' ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.commitmentPeriod && getValues("commitmentPeriod") ==  ''?errors.commitmentPeriod.message : ''}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="preferredReturn"
                            label="Preferred Return/Hurdle Rate p.a. Pre Tax(%)"
                            value={prelimApplicationFormData.preferredReturn || ''}
                            {...register("preferredReturn")}
                            error={errors.preferredReturn && getValues("preferredReturn") ==  '' ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', ml: 2 }}
                        />
                        <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                            <>{errors.preferredReturn && getValues("preferredReturn") ==  ''?errors.preferredReturn.message : ''}</>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="managementFees"
                            label="Management Fee(%)"
                            value={prelimApplicationFormData.managementFees || ''}
                            {...register("managementFees")}
                            error={errors.managementFees && getValues("managementFees") ==  '' ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.managementFees && getValues("managementFees") ==  ''?errors.managementFees.message : ''}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="carriedInterest"
                            label="Carried Interest(%)"
                            value={prelimApplicationFormData.carriedInterest || ''}
                            {...register("carriedInterest")}
                            error={errors.carriedInterest && getValues("carriedInterest") ==  '' ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.carriedInterest && getValues("carriedInterest") ==  ''?errors.carriedInterest.message : ''}</>
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
                                onChange={handleSelectChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="standard" sx={{ display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">Deal Sub Sector</InputLabel>
                            <Select
                                labelId="dealSubsector"
                                id="dealSubsector"
                                value={String(prelimApplicationFormData.dealSubsector || '')}
                                {...register("dealSubsector")}
                                error={(errors.dealSubsector && getValues("dealSubsector") == '') ? true : false}
                                onChange={handleChange}
                                name="dealSubsector"
                            >
                                {/* <MenuItem key={'test'} value={'test'} selected={String(prelimApplicationFormData.dealSubsector || '') === 'test'}>{'test'}</MenuItem> */}
                                {prelimApplicationFormData.dealSector &&
                                    (dealSubSectorValues as any)[String(prelimApplicationFormData.dealSector || 0)] &&
                                    (dealSubSectorValues as any)[String(prelimApplicationFormData.dealSector || 0)].values.map((item: string) => {
                                        return <MenuItem key={item} value={item} selected={String(prelimApplicationFormData.dealSubsector || '') === item}>{item}</MenuItem>
                                    })}
                            </Select>
                            <Typography variant="caption" color="error">
                            <>{(errors.dealSubsector && getValues("dealSubsector") == '')?errors.dealSubsector.message : ''}</>
                            </Typography>

                            {/* <MasterData propertyType="dealSubsector" 
                                propertyValue={prelimApplicationFormData.dealSubsector || 0}
                                onChange={handleSelectChange} /> */}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="description"
                            label="Sector Description(Stage of investment like pre revenue, pre growth, seed stage, series A, Series B etc)"
                            value={prelimApplicationFormData.description || ''}
                            {...register("description")}
                            error={errors.description ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                        <Typography variant="caption" color="error">
                            <>{errors.description?errors.description.message : ''}</>
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            id="investmentStrategy"
                            label="Investment Strategy"
                            value={prelimApplicationFormData.investmentStrategy || ''}
                            {...register("investmentStrategy")}
                            error={errors.investmentStrategy ? true : false}
                            onChange={handleChange}
                            variant="standard"
                            multiline
                            sx={{ display: 'flex', ml: 2, mr: 2 }}
                        />
                        <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                            <>{errors.investmentStrategy?errors.investmentStrategy.message : ''}</>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ backgroundColor: 'white', borderRadius: 1, ml: 2, mb: 2, mr: 2 }}>
                            <Card sx={{ display: 'flex', }}>
                                <CardContent sx={{ flex: 1 }}>
                                    <Grid container spacing={2} >
                                        <Grid item xs={12}>
                                            <Grid item xs={4}>
                                                <TextField
                                                    required
                                                    type="number"
                                                    id="sdDescription"
                                                    label="Capital raised till date (₹ Crore)"
                                                    value={prelimApplicationFormData.sdDescription || ''}
                                                    {...register("sdDescription")}
                                                    error={errors.sdDescription && getValues("sdDescription") == '' ? true : false}
                                                    onChange={handleChange}
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
                                                    <>{errors.sdDescription && getValues("sdDescription") == ''?errors.sdDescription.message : ''}</>
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
                                                label="Domestic (₹ Crore)"
                                                value={prelimApplicationFormData.sdTargetCorpusDomestic || ''}
                                                {...register("sdTargetCorpusDomestic")}
                                                error={errors.sdTargetCorpusDomestic && getValues("sdTargetCorpusDomestic") ==  '' ? true : false}
                                                onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.sdTargetCorpusDomestic && getValues("sdTargetCorpusDomestic") ==  ''?errors.sdTargetCorpusDomestic.message : ''}</>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdTargetCorpusOverseas"
                                                label="Overseas, if any (₹ Crore)"
                                                value={prelimApplicationFormData.sdTargetCorpusOverseas || ''}
                                                {...register("sdTargetCorpusOverseas")}
                                                error={errors.sdTargetCorpusOverseas && getValues("sdTargetCorpusOverseas") ==  '' ? true : false}
                                                onChange={handleChange}
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
                                                <>{errors.sdTargetCorpusOverseas && getValues("sdTargetCorpusOverseas") ==  ''?errors.sdTargetCorpusOverseas.message : ''}</>
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdTotalTargetCorpus"
                                                label="Total Target Corpus (₹ Crore)"
                                                value={prelimApplicationFormData.sdTotalTargetCorpus || ''}
                                                {...register("sdTotalTargetCorpus")}
                                                error={errors.sdTotalTargetCorpus && getValues("sdTotalTargetCorpus") ==  '' ? true : false}
                                                onChange={handleChange}
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
                                                <>{errors.sdTotalTargetCorpus && getValues("sdTotalTargetCorpus") ==  ''?errors.sdTotalTargetCorpus.message : ''}</>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mt: 5, flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Target Corpus (Green Shoe)</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdGreenShoeTargetCorpusDomestic"
                                                label="Domestic (₹ Crore)"
                                                value={prelimApplicationFormData.sdGreenShoeTargetCorpusDomestic || ''}
                                                {...register("sdGreenShoeTargetCorpusDomestic")}
                                                error={errors.sdGreenShoeTargetCorpusDomestic && getValues("sdGreenShoeTargetCorpusDomestic") ==  '' ? true : false}
                                                onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.sdGreenShoeTargetCorpusDomestic && getValues("sdGreenShoeTargetCorpusDomestic") ==  ''?errors.sdGreenShoeTargetCorpusDomestic.message : ''}</>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdGreenShoeTargetCorpusOverseas"
                                                label="Overseas, if any (₹ Crore)"
                                                value={prelimApplicationFormData.sdGreenShoeTargetCorpusOverseas || ''}
                                                {...register("sdGreenShoeTargetCorpusOverseas")}
                                                error={errors.sdGreenShoeTargetCorpusOverseas && getValues("sdGreenShoeTargetCorpusOverseas") ==  '' ? true : false}
                                                onChange={handleChange}
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
                                                <>{errors.sdGreenShoeTargetCorpusOverseas && getValues("sdGreenShoeTargetCorpusOverseas") ==  ''?errors.sdGreenShoeTargetCorpusOverseas.message : ''}</>
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdGreenShoeTotalTargetCorpus"
                                                label="Total Target Corpus (₹ Crore)"
                                                value={prelimApplicationFormData.sdGreenShoeTotalTargetCorpus || ''}
                                                {...register("sdGreenShoeTotalTargetCorpus")}
                                                error={errors.sdGreenShoeTotalTargetCorpus && getValues("sdGreenShoeTotalTargetCorpus") ==  '' ? true : false}
                                                onChange={handleChange}
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
                                                <>{errors.sdGreenShoeTotalTargetCorpus && getValues("sdGreenShoeTotalTargetCorpus") ==  ''?errors.sdGreenShoeTotalTargetCorpus.message : ''}</>
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
                                                label={prelimApplicationFormData.firstClosing ? "Domestic Amount (₹ Crore)" : "Expected Domestic Amount (₹ Crore)"}
                                                value={prelimApplicationFormData.sdFirstClosingDomesticAmount || ''}
                                                {...register("sdFirstClosingDomesticAmount")}
                                                error={errors.sdFirstClosingDomesticAmount && getValues("sdFirstClosingDomesticAmount") ==  '' ? true : false}
                                                onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                            <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                                                <>{errors.sdFirstClosingDomesticAmount && getValues("sdFirstClosingDomesticAmount") ==  ''?errors.sdFirstClosingDomesticAmount.message : ''}</>
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                <Stack spacing={3}>
                                                    <Controller
                                                        name="sdFirstClosingDomesticAmountDate"
                                                        control={control}
                                                        // defaultValue={null}
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
                                                                onChange={(newValue: any) => {
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
                                                label={prelimApplicationFormData.firstClosing ? "Overseas Amount (₹ Crore)" : "Expected Overseas Amount (₹ Crore)"}
                                                value={prelimApplicationFormData.sdFirstClosingOverseasAmount || ''}
                                                {...register("sdFirstClosingOverseasAmount")}
                                                error={errors.sdFirstClosingOverseasAmount && getValues("sdFirstClosingOverseasAmount") ==  '' ? true : false}
                                                onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex' }}
                                            />
                                            <Typography variant="caption" color="error">
                                                <>{errors.sdFirstClosingOverseasAmount && getValues("sdFirstClosingOverseasAmount") ==  ''?errors.sdFirstClosingOverseasAmount.message : ''}</>
                                            </Typography>
                                        </Grid>



                                        <Grid item xs={3}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                                <Stack spacing={3}>
                                                    <Controller
                                                        name="sdFirstCorpusOverseasAmountDate"
                                                        control={control}
                                                        // defaultValue={null}
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
                                                                onChange={(newValue: any) => {
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
                                                    // onClick={savePrelimApplicationForm}
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </Grid  >
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Card sx={{ display: 'flex', }}>
                                <CardContent sx={{ flex: 1 }}>
                                    <Grid container spacing={2} >
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'inline-flex' }}>
                                                <UploadIcon />
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ flex: 1, ml: '10px', mb: '10px', textAlign: "left", fontWeight: 'bold' }}>
                                                    Supporting Documents
                                                    <span style={{ fontWeight: "normal" }}>
                                                        (Max. file size 5 MB each)</span> </Typography>
                                            </Box>
                                            {Number(prelimAppicationId) ?
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs="auto">
                                                            <DocumentChip
                                                                label="Pvt. Placement Memorandum"
                                                                id={`sdPvtPlacementMemorandum${prelimAppicationId}`} /> 
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <DocumentChip
                                                                label="IM Agreement"
                                                                id={`sdImAgreement${prelimAppicationId}`} />
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <DocumentChip
                                                                label="Trust Deed"
                                                                id={`sdTrustDeal${prelimAppicationId}`} />
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <DocumentChip
                                                                label="SEBI Certificate"
                                                                id={`sdSEBICertificate${prelimAppicationId}`} />
                                                        </Grid>
                                                    </Grid>
                                                </Grid> : <Grid item xs={12}>Please save the form to upload documents</Grid>}

                                        </Grid>
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
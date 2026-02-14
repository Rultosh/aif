import { Box, Button, Card, CardContent, Chip, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
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

        if (prelimApplicationState.prelimApplication?.id) {
            setPrelimApplicationId(String(prelimApplicationState.prelimApplication.id));
        }
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

        setValue(ev.target.id || ev.target.name, ev.target.value);
        setPrelimApplicationFormData(copiedValue)
        // live update words for contribution field
        if (ev.target.id === 'contributionSought') {
            setContributionWords(numberToWordsIndian(ev.target.value));
        }
    };

    const [contributionWords, setContributionWords] = useState<string>('');

    const numberToWordsIndian = (input: any) => {
        if (input === null || input === undefined) return '';
        const str = String(input).replace(/[, ]+/g, '').trim();
        if (str === '') return '';
        const num = Number(str);
        if (Number.isNaN(num)) return '';
        if (num === 0) return 'Zero';

        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const upTo999 = (n: number) => {
            let word = '';
            if (n > 99) {
                word += ones[Math.floor(n / 100)] + ' Hundred';
                n = n % 100;
                if (n) word += ' ';
            }
            if (n > 19) {
                word += tens[Math.floor(n / 10)];
                if (n % 10) word += ' ' + ones[n % 10];
            } else if (n > 0) {
                word += ones[n];
            }
            return word;
        }

        let n = Math.floor(num);
        const parts: string[] = [];

        const crore = Math.floor(n / 10000000);
        if (crore) {
            parts.push(upTo999(crore) + ' Crore');
            n = n % 10000000;
        }

        const lakh = Math.floor(n / 100000);
        if (lakh) {
            parts.push(upTo999(lakh) + ' Lakh');
            n = n % 100000;
        }

        const thousand = Math.floor(n / 1000);
        if (thousand) {
            parts.push(upTo999(thousand) + ' Thousand');
            n = n % 1000;
        }

        if (n) {
            parts.push(upTo999(n));
        }

        const result = parts.join(' ').trim();
        return result ? result + ' only' : '';
    }

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

    console.log((dealSubSectorValues as any)[String(prelimApplicationFormData?.dealSector || 0)]?.values, prelimApplicationFormData?.dealSubsector);

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
    } = useForm<IPrelimApplicationData>({
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
            <Box component="form" sx={{ p: 0 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="investmentStrategy"
                            label="Investment Strategy"
                            placeholder="Enter the investment strategy..."
                            value={prelimApplicationFormData.investmentStrategy || ''}
                            {...register("investmentStrategy")}
                            error={!!errors.investmentStrategy}
                            helperText={errors.investmentStrategy?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            multiline
                            rows={3}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                },
                            }}
                        />
                    </Grid>
                    {/* <FormControl variant="standard" sx={{ display: 'flex', ml: 2 }}>
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
                                <MenuItem key={"Fund of funds"} value={"Fund of funds"} selected={String(prelimApplicationFormData.scheme || '') === "Fund of funds"}>Fund of funds for startups</MenuItem>
                                <MenuItem key={"Aspire for MSME"} value={"Aspire for MSME"} selected={String(prelimApplicationFormData.scheme || '') === "Aspire for MSME"}>Aspire for MSME</MenuItem>
                                <MenuItem key={"UP Start-up Fund"} value={"UP Start-up Fund"} selected={String(prelimApplicationFormData.scheme || '') === "UP Start-up Fund"}>UP Start-up Fund</MenuItem>
                                <MenuItem key={"Odisha Startup Fund"} value={"Odisha Startup Fund"} selected={String(prelimApplicationFormData.scheme || '') === "Odisha Startup Fund"}>Odisha Startup Fund</MenuItem>
                                <MenuItem key={"Bihar Startup Scale-up financing fund"} value={"Bihar Startup Scale-up financing fund"} selected={String(prelimApplicationFormData.scheme || '') === "Bihar Startup Scale-up financing fund"}>Bihar Startup Scale-Up Financing Fund</MenuItem>
                                <MenuItem key={"MSInS Fund of Funds for Startups"} value={"MSInS Fund of Funds for Startups"} selected={String(prelimApplicationFormData.scheme || '') === "MSInS Fund of Funds for Startups"}>MSInS Fund of Funds for Startups</MenuItem>
                            </Select>
                            <Typography variant="caption" color="error">
                            <>{(errors.scheme && getValues("scheme") == '')?errors.scheme.message : ''}</>
                            </Typography>
                        </FormControl> */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            id="nameOfTheFund"
                            label="Name of the Fund"
                            value={prelimApplicationFormData.nameOfTheFund || ''}
                            {...register("nameOfTheFund")}
                            error={!!errors.nameOfTheFund}
                            helperText={errors.nameOfTheFund?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            id="sponsor"
                            label="Sponsor"
                            value={prelimApplicationFormData.sponsor || ''}
                            {...register("sponsor")}
                            error={!!errors.sponsor}
                            helperText={errors.sponsor?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            id="investmentManager"
                            label="Investment Manager (IM)/AMC"
                            value={prelimApplicationFormData.investmentManager || ''}
                            {...register("investmentManager")}
                            error={!!errors.investmentManager}
                            helperText={errors.investmentManager?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                            <InputLabel id="fundManager-label" sx={{ backgroundColor: 'white', px: 0.5 }}>Fund Manager</InputLabel>
                            <MasterData propertyType="fundManager"
                                propertyValue={prelimApplicationFormData.fundManager || 0}
                                onChange={handleSelectChange} />
                        </FormControl>
                    </Grid>
                    {/* <Grid item xs={4}>
                        <FormControl variant="standard" sx={{ display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">Deal Type</InputLabel>
                            <MasterData propertyType="dealType"
                                propertyValue={prelimApplicationFormData.dealType || 0}
                                onChange={handleSelectChange} />
                        </FormControl>

                    </Grid>

                    <Grid item xs={4}>

                        <FormControl variant="standard" sx={{ display: 'flex' }}>
                            <InputLabel id="demo-simple-select-standard-label">Impact Fund</InputLabel>
                            <MasterData propertyType="impact"
                                propertyValue={prelimApplicationFormData.impact || 0}
                                onChange={handleSelectChange} />
                        </FormControl>

                    </Grid> */}

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                            <InputLabel id="aifCategory-label" sx={{ backgroundColor: 'white', px: 0.5 }}>AIF Category</InputLabel>
                            <MasterData propertyType="aifCategory"
                                propertyValue={prelimApplicationFormData.aifCategory || 0}
                                onChange={handleSelectChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            id="nameOfTrustee"
                            label="Name Of The Trustee"
                            value={prelimApplicationFormData.nameOfTrustee || ''}
                            {...register("nameOfTrustee")}
                            error={!!errors.nameOfTrustee}
                            helperText={errors.nameOfTrustee?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                name="dateOfFilingWithSEBI"
                                control={control}
                                render={({
                                    field: { onChange, value },
                                    fieldState: { error, invalid }
                                }) => (
                                    <DesktopDatePicker
                                        inputFormat="DD/MM/YYYY"
                                        disableFuture={true}
                                        label="Date of Approval of PPM by SEBI"
                                        value={prelimApplicationFormData.dateOfFilingWithSEBI || null}
                                        onChange={(newValue: any) => {
                                            setValue('dateOfFilingWithSEBI', newValue);
                                            setDateValue("dateOfFilingWithSEBI", newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                {...params}
                                                error={invalid}
                                                helperText={invalid ? "This value is required" : null}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="contributionSought"
                            label="Contribution sought (₹ Crore)"
                            value={prelimApplicationFormData.contributionSought || ''}
                            {...register("contributionSought")}
                            error={!!errors.contributionSought}
                            helperText={
                                errors.contributionSought
                                    ? (errors.contributionSought.message as string)
                                    : (prelimApplicationFormData?.contributionSought
                                        ? numberToWordsIndian(prelimApplicationFormData.contributionSought)
                                        : '')
                            }
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="termOfFund"
                            label="Term of the Fund (Months)"
                            {...register("termOfFund")}
                            error={!!errors.termOfFund}
                            helperText={errors.termOfFund?.message as string}
                            value={prelimApplicationFormData.termOfFund || ''}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="commitmentPeriod"
                            label="Commitment Period (Months)"
                            value={prelimApplicationFormData.commitmentPeriod || ''}
                            {...register("commitmentPeriod")}
                            error={!!errors.commitmentPeriod}
                            helperText={errors.commitmentPeriod?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="preferredReturn"
                            label="Preferred Return/Hurdle Rate p.a. (%)"
                            value={prelimApplicationFormData.preferredReturn || ''}
                            {...register("preferredReturn")}
                            error={!!errors.preferredReturn}
                            helperText={errors.preferredReturn?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="managementFees"
                            label="Management Fee (%)"
                            value={prelimApplicationFormData.managementFees || ''}
                            {...register("managementFees")}
                            error={!!errors.managementFees}
                            helperText={errors.managementFees?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="carriedInterest"
                            label="Carried Interest (%)"
                            value={prelimApplicationFormData.carriedInterest || ''}
                            {...register("carriedInterest")}
                            error={!!errors.carriedInterest}
                            helperText={errors.carriedInterest?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            id="dealSector"
                            label="Deal Sector"
                            value={prelimApplicationFormData.dealSector || ''}
                            {...register("dealSector")}
                            error={!!errors.dealSector}
                            helperText={errors.dealSector?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            id="dealSubsector"
                            label="Deal Sub Sector"
                            value={prelimApplicationFormData.dealSubsector || ''}
                            {...register("dealSubsector")}
                            error={!!errors.dealSubsector}
                            helperText={errors.dealSubsector?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            id="description"
                            label="Sector Description/Stage"
                            placeholder="e.g. Seed, Series A..."
                            value={prelimApplicationFormData.description || ''}
                            {...register("description")}
                            error={!!errors.description}
                            helperText={errors.description?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>

                    {/* <Grid item xs={12}>
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
                    </Grid> */}
                    <Grid item xs={12}>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#363062', mb: 3 }}>
                                Capital & Funding Details
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdDescription"
                                        label="Capital raised till date (₹ Crore)"
                                        value={prelimApplicationFormData.sdDescription || ''}
                                        {...register("sdDescription")}
                                        error={!!errors.sdDescription}
                                        helperText={errors.sdDescription?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }}>
                                        <Chip label="Target Corpus" sx={{ fontWeight: 700, backgroundColor: 'rgba(54, 48, 98, 0.05)', color: '#363062' }} />
                                    </Divider>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdTargetCorpusDomestic"
                                        label="Domestic (₹ Crore)"
                                        value={prelimApplicationFormData.sdTargetCorpusDomestic || ''}
                                        {...register("sdTargetCorpusDomestic")}
                                        error={!!errors.sdTargetCorpusDomestic}
                                        helperText={errors.sdTargetCorpusDomestic?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdTargetCorpusOverseas"
                                        label="Overseas (₹ Crore)"
                                        value={prelimApplicationFormData.sdTargetCorpusOverseas || ''}
                                        {...register("sdTargetCorpusOverseas")}
                                        error={!!errors.sdTargetCorpusOverseas}
                                        helperText={errors.sdTargetCorpusOverseas?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdTotalTargetCorpus"
                                        label="Total Target Corpus (₹ Crore)"
                                        value={prelimApplicationFormData.sdTotalTargetCorpus || ''}
                                        {...register("sdTotalTargetCorpus")}
                                        error={!!errors.sdTotalTargetCorpus}
                                        helperText={errors.sdTotalTargetCorpus?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }}>
                                        <Chip label="Target Corpus (Green Shoe)" sx={{ fontWeight: 700, backgroundColor: 'rgba(54, 48, 98, 0.05)', color: '#363062' }} />
                                    </Divider>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdGreenShoeTargetCorpusDomestic"
                                        label="Domestic (Green Shoe) (₹ Crore)"
                                        value={prelimApplicationFormData.sdGreenShoeTargetCorpusDomestic || ''}
                                        {...register("sdGreenShoeTargetCorpusDomestic")}
                                        error={!!errors.sdGreenShoeTargetCorpusDomestic}
                                        helperText={errors.sdGreenShoeTargetCorpusDomestic?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdGreenShoeTargetCorpusOverseas"
                                        label="Overseas (Green Shoe) (₹ Crore)"
                                        value={prelimApplicationFormData.sdGreenShoeTargetCorpusOverseas || ''}
                                        {...register("sdGreenShoeTargetCorpusOverseas")}
                                        error={!!errors.sdGreenShoeTargetCorpusOverseas}
                                        helperText={errors.sdGreenShoeTargetCorpusOverseas?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdGreenShoeTotalTargetCorpus"
                                        label="Total (Green Shoe) (₹ Crore)"
                                        value={prelimApplicationFormData.sdGreenShoeTotalTargetCorpus || ''}
                                        {...register("sdGreenShoeTotalTargetCorpus")}
                                        error={!!errors.sdGreenShoeTotalTargetCorpus}
                                        helperText={errors.sdGreenShoeTotalTargetCorpus?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 2,
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(54, 48, 98, 0.02)',
                                        border: '1px dashed rgba(54, 48, 98, 0.2)',
                                        mt: 2
                                    }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#363062' }}>
                                            First Closing Confirmed?
                                        </Typography>
                                        <FormControlLabel
                                            control={<Switch checked={!!prelimApplicationFormData.firstClosing} onChange={handleToggle} />}
                                            label={prelimApplicationFormData.firstClosing ? "Yes" : "No"}
                                            sx={{ mr: 0 }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdFirstClosingDomesticAmount"
                                        label={prelimApplicationFormData.firstClosing ? "Domestic Amount (₹ Crore)" : "Expected Domestic Amount (₹ Crore)"}
                                        value={prelimApplicationFormData.sdFirstClosingDomesticAmount || ''}
                                        {...register("sdFirstClosingDomesticAmount")}
                                        error={!!errors.sdFirstClosingDomesticAmount}
                                        helperText={errors.sdFirstClosingDomesticAmount?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Controller
                                            name="sdFirstClosingDomesticAmountDate"
                                            control={control}
                                            render={({ fieldState: { invalid } }) => (
                                                <DesktopDatePicker
                                                    inputFormat="DD/MM/YYYY"
                                                    label="Closing Date (Domestic)"
                                                    value={prelimApplicationFormData.sdFirstClosingDomesticAmountDate || null}
                                                    onChange={(newValue: any) => {
                                                        setValue('sdFirstClosingDomesticAmountDate', newValue);
                                                        setDateValue("sdFirstClosingDomesticAmountDate", newValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            {...params}
                                                            error={invalid}
                                                            helperText={invalid ? "This value is required" : null}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdFirstClosingOverseasAmount"
                                        label={prelimApplicationFormData.firstClosing ? "Overseas Amount (₹ Crore)" : "Expected Overseas Amount (₹ Crore)"}
                                        value={prelimApplicationFormData.sdFirstClosingOverseasAmount || ''}
                                        {...register("sdFirstClosingOverseasAmount")}
                                        error={!!errors.sdFirstClosingOverseasAmount}
                                        helperText={errors.sdFirstClosingOverseasAmount?.message as string}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Controller
                                            name="sdFirstCorpusOverseasAmountDate"
                                            control={control}
                                            render={({ fieldState: { invalid } }) => (
                                                <DesktopDatePicker
                                                    inputFormat="DD/MM/YYYY"
                                                    label="Closing Date (Overseas)"
                                                    value={prelimApplicationFormData.sdFirstCorpusOverseasAmountDate || null}
                                                    onChange={(newValue: any) => {
                                                        setValue('sdFirstCorpusOverseasAmountDate', newValue);
                                                        setDateValue("sdFirstCorpusOverseasAmountDate", newValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            {...params}
                                                            error={invalid}
                                                            helperText={invalid ? "This value is required" : null}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            onClick={handleSubmit(onSubmit)}
                                            sx={{
                                                backgroundColor: '#363062',
                                                px: 6,
                                                py: 1.5,
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                '&:hover': {
                                                    backgroundColor: '#2a254d'
                                                }
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ mt: 5 }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#363062', mb: 3 }}>
                                Supporting Documents
                            </Typography>

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
                                            <DocumentChip label="Pvt. Placement Memorandum" id={`sdPvtPlacementMemorandum${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="IM Agreement" id={`sdImAgreement${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="Trust Deed" id={`sdTrustDeal${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="SEBI Certificate" id={`sdSEBICertificate${prelimAppicationId}`} />
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                                        Please save the form to upload documents.
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box >
            // </form>
        );
    else
        return <div>Loading...</div>
}



export default PrelimApplicationData;

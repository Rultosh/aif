import { Box, Button, Card, CardContent, Chip, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { clearPrelimApplication, createPrelimApplicationAsync, getPrelimApplicationData, PrelimApplicationState, selectPrelimApplication, updatePrelimApplicationAsync } from "./prelimApplicationDataSlice";
import { defaultIPrelimApplicationData, IPrelimApplicationData } from "./IPrelimApplicationData";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { FetchStatus } from "../../../../lib/api-status/IStatus";
import { useNavigate, useParams } from "react-router-dom";
import DocumentChip from "../../../../components/DocumentChip";
import MasterData from "../../../../components/master-data/MasterData";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormHelperText from '@mui/material/FormHelperText';
import dayjs, { Dayjs } from "dayjs";

interface PrelimApplicationProps {
    prelimApplicationId: String | undefined,
    setPrelimApplicationId: (id: String | undefined) => void;
    onSaveSuccess?: () => void;
}

const PrelimApplicationData = forwardRef((props: PrelimApplicationProps, ref) => {
    const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
    const [prelimApplicationFormData, setPrelimApplicationFormData] = useState(prelimApplicationState.prelimApplication);
    const [actionUid] = useState(uuid());
    const [prelimAppicationId, setPrelimApplicationId] = useState(props.prelimApplicationId);
    const [firstClosingSwitch, setfirstClosingSwitch] = useState(false);

    const MIN_DATE = dayjs("2020-01-01");

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

    const savePrelimApplicationForm = async () => {
        // console.log("onSubmit called", prelimApplicationFormData);
        if (prelimApplicationFormData.id) {
            await dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, prelimApplicationFormData)));
            if (props.onSaveSuccess) {
                props.onSaveSuccess();
            }
        } else {
            dispatch(createPrelimApplicationAsync(wrapArgument(actionUid, prelimApplicationFormData)));
        }
    };

    const handleChange = (ev: any) => {
        ev.preventDefault();

        let value = ev.target.value;
        const id = ev.target.id || ev.target.name;

        if (monthFields.includes(id)) {
            value = value.replace(/[^0-9]/g, '');
        }

        if (percentageFields.includes(id)) {
            if (value !== '') {
                const numVal = parseFloat(value);
                if (numVal < 0) value = '0';
                if (numVal > 100) value = '100';
                if (value.includes('.')) {
                    const parts = value.split('.');
                    if (parts[1].length > 2) {
                        value = parts[0] + '.' + parts[1].slice(0, 2);
                    }
                }
            }
        }

        if (numericFields.includes(id) && !monthFields.includes(id) && !percentageFields.includes(id)) {
            if (value.includes('.')) {
                const parts = value.split('.');
                if (parts[1].length > 2) {
                    value = parts[0] + '.' + parts[1].slice(0, 2);
                }
            }
        }

        let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };

        if (ev.target.id) {
            copiedValue[ev.target.id as keyof IPrelimApplicationData] = value
        } else {
            copiedValue[ev.target.name as keyof IPrelimApplicationData] = value
        }

        setValue((ev.target.id || ev.target.name) as any, value);

        if (id === 'sdTargetCorpusDomestic' || id === 'sdTargetCorpusOverseas') {
            const domestic = id === 'sdTargetCorpusDomestic' ? value : (copiedValue.sdTargetCorpusDomestic || 0);
            const overseas = id === 'sdTargetCorpusOverseas' ? value : (copiedValue.sdTargetCorpusOverseas || 0);
            const total = (parseFloat(domestic as string) || 0) + (parseFloat(overseas as string) || 0);
            copiedValue.sdTotalTargetCorpus = total;
            setValue('sdTotalTargetCorpus', total as any);
        }

        if (id === 'sdGreenShoeTargetCorpusDomestic' || id === 'sdGreenShoeTargetCorpusOverseas') {
            const domestic = id === 'sdGreenShoeTargetCorpusDomestic' ? value : (copiedValue.sdGreenShoeTargetCorpusDomestic || 0);
            const overseas = id === 'sdGreenShoeTargetCorpusOverseas' ? value : (copiedValue.sdGreenShoeTargetCorpusOverseas || 0);
            const total = (parseFloat(domestic as string) || 0) + (parseFloat(overseas as string) || 0);
            copiedValue.sdGreenShoeTotalTargetCorpus = total;
            setValue('sdGreenShoeTotalTargetCorpus', total as any);
        }

        setPrelimApplicationFormData(copiedValue)
        // live update words for contribution field
        if (ev.target.id === 'contributionSought') {
            const numValue = parseFloat(value) || 0;
            setContributionWords(numberToWordsIndian(numValue * 10000000));
        }
    };

    const [contributionWords, setContributionWords] = useState<string>('');

    const numberToWordsIndian = (input: any) => {
        if (input === null || input === undefined) return '';
        const str = String(input).replace(/[, ]+/g, '').trim();
        if (str === '') return '';
        const num = Math.floor(Number(str));
        if (Number.isNaN(num)) return '';
        if (num === 0) return 'Zero';

        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const convert = (n: number): string => {
            if (n < 20) return ones[n];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
            if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
            if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
            if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
            return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
        }

        const result = convert(num).trim();
        return result ? result + ' Rupees only' : '';
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

    const percentageFields = [
        'preferredReturn', 'targetReturnIRR', 'managementFees',
        'carriedInterest', 'hurdleCarryInterestRate'
    ];

    const monthFields = [
        'termOfFund', 'commitmentPeriod'
    ];

    const numericFields = [
        'contributionSought',
        'sdDescription', 'sdTargetCorpusDomestic', 'sdTargetCorpusOverseas',
        'sdTotalTargetCorpus', 'sdGreenShoeTargetCorpusDomestic',
        'sdGreenShoeTargetCorpusOverseas', 'sdGreenShoeTotalTargetCorpus',
        'sdFirstClosingDomesticAmount', 'sdFirstClosingOverseasAmount',
        'fundSetupCost',
        ...percentageFields,
        ...monthFields
    ];

    const numericSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&.Mui-readOnly, & .MuiInputBase-input[readOnly]': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }
        },
    };

    const handleBlur = (ev: any) => {
        const id = ev.target.id || ev.target.name;
        let value = ev.target.value;

        if (monthFields.includes(id)) {
            return; // No formatting for months
        }

        if (numericFields.includes(id) && value !== '') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                const formattedValue = numValue.toFixed(2);
                setValue(id as any, formattedValue);
                if (id === 'contributionSought') {
                    setContributionWords(numberToWordsIndian(parseFloat(formattedValue) * 10000000));
                }

                const updateTotals = (valId: string, totalId: string, domesticId: string, overseasId: string) => {
                    const values = getValues();
                    const domestic = valId === domesticId ? formattedValue : (values[domesticId as keyof IPrelimApplicationData] || 0);
                    const overseas = valId === overseasId ? formattedValue : (values[overseasId as keyof IPrelimApplicationData] || 0);
                    const total = (parseFloat(domestic as string) || 0) + (parseFloat(overseas as string) || 0);
                    const formattedTotal = total.toFixed(2);
                    setValue(totalId as any, formattedTotal as any);
                    setPrelimApplicationFormData(prev => ({
                        ...prev,
                        [valId]: Number(formattedValue),
                        [totalId]: Number(formattedTotal)
                    }));
                };

                if (id === 'sdTargetCorpusDomestic' || id === 'sdTargetCorpusOverseas') {
                    updateTotals(id, 'sdTotalTargetCorpus', 'sdTargetCorpusDomestic', 'sdTargetCorpusOverseas');
                } else if (id === 'sdGreenShoeTargetCorpusDomestic' || id === 'sdGreenShoeTargetCorpusOverseas') {
                    updateTotals(id, 'sdGreenShoeTotalTargetCorpus', 'sdGreenShoeTargetCorpusDomestic', 'sdGreenShoeTargetCorpusOverseas');
                } else {
                    setPrelimApplicationFormData(prev => ({
                        ...prev,
                        [id]: Number(formattedValue)
                    }));
                }
            }
        }
    };

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
        termOfFund: Yup.number().typeError("Term of Fund must be a number").required("Term of Fund is required").min(0, "Negative values not allowed"),
        commitmentPeriod: Yup.number().typeError("Commitment Period must be a number").required("Commitment Period is required").min(0, "Negative values not allowed"),
        preferredReturn: Yup.number().typeError("Preferred Return must be a number").required("Preferred Return is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        managementFees: Yup.number().typeError("Management Fees must be a number").required("Management Fees is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        carriedInterest: Yup.number().typeError("Carried Interest must be a number").required("Carried Interest is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        description: Yup.string().required("Description is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        investmentStrategy: Yup.string().required("Investment Strategy is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        sdDescription: Yup.string().required("Capital raised till date is required"),
        sdTargetCorpusDomestic: Yup.number().typeError("Domestic must be a number").required("Domestic is required").min(0, "Negative values not allowed"),
        sdTargetCorpusOverseas: Yup.number().typeError("Overseas must be a number").required("Overseas is required").min(0, "Negative values not allowed"),
        sdTotalTargetCorpus: Yup.number().required("Total Target Corpus is required").min(100, "Value less than Rs. 100 crores shall not be allowed"),
        sdGreenShoeTargetCorpusDomestic: Yup.number().typeError("Domestic (Green Shoe) must be a number").required("Domestic (Green Shoe) is required").min(0, "Negative values not allowed"),
        sdGreenShoeTargetCorpusOverseas: Yup.number().typeError("Overseas (Green Shoe) must be a number").required("Overseas (Green Shoe) is required").min(0, "Negative values not allowed"),
        sdGreenShoeTotalTargetCorpus: Yup.number().typeError("Total Target Corpus (Green Shoe) must be a number").required("Total Target Corpus (Green Shoe) is required").min(0, "Negative values not allowed"),
        sdFirstClosingDomesticAmount: Yup.number().typeError("Domestic Amount must be a number").required("Domestic Amount is required").min(0, "Negative values not allowed"),
        sdFirstClosingOverseasAmount: Yup.number().typeError("Overseas Amount must be a number").required("Overseas Amount is required").min(0, "Negative values not allowed"),
        sdFirstClosingDomesticAmountDate: Yup.string().required("This value is required").nullable(),
        sdFirstCorpusOverseasAmountDate: Yup.string().required("This value is required").nullable(),
        aifCategoryType: Yup.string().required("AIF Category Type is required"),
        targetReturnIRR: Yup.number().typeError("Target Return must be a number").required("Target Return is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        fundSetupCost: Yup.number().typeError("Fund set up cost must be a number").required("Fund set up cost is required").min(0, "Negative values not allowed"),
        hurdleCarryInterestRate: Yup.string().required("Hurdle and carry interest rate is required"),
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
                            maxRows={4}
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
                        <FormControl component="fieldset" fullWidth>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>AIF Category Type</Typography>
                            <Controller
                                name="aifCategoryType"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        {...field}
                                        row
                                        value={prelimApplicationFormData.aifCategoryType || ''}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleChange({
                                                preventDefault: () => { },
                                                target: { name: 'aifCategoryType', value: e.target.value }
                                            });
                                        }}
                                    >
                                        <FormControlLabel value="1" control={<Radio size="small" />} label="Equity oriented AIF" />
                                        <FormControlLabel value="2" control={<Radio size="small" />} label="Debt oriented AIF" />
                                    </RadioGroup>
                                )}
                            />
                            {errors.aifCategoryType && (
                                <FormHelperText error>{errors.aifCategoryType.message as string}</FormHelperText>
                            )}
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
                                rules={{
                                    required: "This value is required",
                                    validate: (value: Dayjs | null) => {
                                        if (!value) return true;
                                        return value.isBefore(MIN_DATE)
                                            ? "Date cannot be before 01/01/2020"
                                            : true;
                                    }
                                }}
                                render={({ field, fieldState }) => (
                                    <DesktopDatePicker
                                        label="Date of Approval of PPM by SEBI"
                                        inputFormat="DD/MM/YYYY"
                                        disableFuture
                                        minDate={MIN_DATE}
                                        value={field.value || null}
                                        onChange={(newValue: Dayjs | null) => {
                                            if (newValue && newValue.isBefore(MIN_DATE)) return;

                                            field.onChange(newValue);
                                            setDateValue("dateOfFilingWithSEBI", newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px'
                                                    }
                                                }}
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
                                        ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.contributionSought)) * 10000000)
                                        : '')
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
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
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
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
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
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
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="targetReturnIRR"
                            label="Target Return in the fund (IRR in %)"
                            value={prelimApplicationFormData.targetReturnIRR || ''}
                            {...register("targetReturnIRR")}
                            error={!!errors.targetReturnIRR}
                            helperText={errors.targetReturnIRR?.message as string}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
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
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="fundSetupCost"
                            label="Fund set up cost"
                            value={prelimApplicationFormData.fundSetupCost || ''}
                            {...register("fundSetupCost")}
                            error={!!errors.fundSetupCost}
                            helperText={errors.fundSetupCost?.message as string}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="otherExpenses"
                            label="Other expenses"
                            value={prelimApplicationFormData.otherExpenses || ''}
                            {...register("otherExpenses")}
                            error={!!errors.otherExpenses}
                            helperText={errors.otherExpenses?.message as string}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
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
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="hurdleCarryInterestRate"
                            label="Justification for hurdle and carried interest rate"
                            value={prelimApplicationFormData.hurdleCarryInterestRate || ''}
                            {...register("hurdleCarryInterestRate")}
                            error={!!errors.hurdleCarryInterestRate}
                            helperText={errors.hurdleCarryInterestRate?.message as string}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={numericSx}
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
                                        helperText={
                                            errors.sdDescription
                                                ? (errors.sdDescription.message as string)
                                                : (prelimApplicationFormData?.sdDescription
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdDescription)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
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
                                        helperText={
                                            errors.sdTargetCorpusDomestic
                                                ? (errors.sdTargetCorpusDomestic.message as string)
                                                : (prelimApplicationFormData?.sdTargetCorpusDomestic
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdTargetCorpusDomestic)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
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
                                        helperText={
                                            errors.sdTargetCorpusOverseas
                                                ? (errors.sdTargetCorpusOverseas.message as string)
                                                : (prelimApplicationFormData?.sdTargetCorpusOverseas
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdTargetCorpusOverseas)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
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
                                        helperText={
                                            errors.sdTotalTargetCorpus
                                                ? (errors.sdTotalTargetCorpus.message as string)
                                                : (prelimApplicationFormData?.sdTotalTargetCorpus
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdTotalTargetCorpus)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
                                        InputProps={{ readOnly: true }}
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
                                        helperText={
                                            errors.sdGreenShoeTargetCorpusDomestic
                                                ? (errors.sdGreenShoeTargetCorpusDomestic.message as string)
                                                : (prelimApplicationFormData?.sdGreenShoeTargetCorpusDomestic
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdGreenShoeTargetCorpusDomestic)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
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
                                        helperText={
                                            errors.sdGreenShoeTargetCorpusOverseas
                                                ? (errors.sdGreenShoeTargetCorpusOverseas.message as string)
                                                : (prelimApplicationFormData?.sdGreenShoeTargetCorpusOverseas
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdGreenShoeTargetCorpusOverseas)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
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
                                        helperText={
                                            errors.sdGreenShoeTotalTargetCorpus
                                                ? (errors.sdGreenShoeTotalTargetCorpus.message as string)
                                                : (prelimApplicationFormData?.sdGreenShoeTotalTargetCorpus
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdGreenShoeTotalTargetCorpus)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
                                        InputProps={{ readOnly: true }}
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

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdFirstClosingDomesticAmount"
                                        label={prelimApplicationFormData.firstClosing ? "Domestic Amount (₹ Crore)" : "Expected Domestic Amount (₹ Crore)"}
                                        value={prelimApplicationFormData.sdFirstClosingDomesticAmount || ''}
                                        {...register("sdFirstClosingDomesticAmount")}
                                        error={!!errors.sdFirstClosingDomesticAmount}
                                        helperText={
                                            errors.sdFirstClosingDomesticAmount
                                                ? (errors.sdFirstClosingDomesticAmount.message as string)
                                                : (prelimApplicationFormData?.sdFirstClosingDomesticAmount
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdFirstClosingDomesticAmount)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
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
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="sdFirstClosingOverseasAmount"
                                        label={prelimApplicationFormData.firstClosing ? "Overseas Amount (₹ Crore)" : "Expected Overseas Amount (₹ Crore)"}
                                        value={prelimApplicationFormData.sdFirstClosingOverseasAmount || ''}
                                        {...register("sdFirstClosingOverseasAmount")}
                                        error={!!errors.sdFirstClosingOverseasAmount}
                                        helperText={
                                            errors.sdFirstClosingOverseasAmount
                                                ? (errors.sdFirstClosingOverseasAmount.message as string)
                                                : (prelimApplicationFormData?.sdFirstClosingOverseasAmount
                                                    ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.sdFirstClosingOverseasAmount)) * 10000000)
                                                    : '')
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={numericSx}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} md={4}>
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
                                </Grid> */}

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
                                                border: '1px solid #2a254d',
                                                '&:hover': {
                                                    backgroundColor: '#ffffff',
                                                    color: '#2a254d',
                                                    border: '1px solid #2a254d'
                                                }
                                            }}
                                        >
                                            Save and Continue
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
                                            <DocumentChip label="Private Placement Memorandum" id={`sdPvtPlacementMemorandum${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="Latest Investor Presentation" id={`sdLatestInvestorPresentation${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="IM Agreement" id={`sdImAgreement${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="Trust Deed" id={`sdTrustDeal${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="SEBI Registration Certificate" id={`sdSEBICertificate${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="Shareholding Pattern of Sponsor/IM" id={`sdShareholdingPattern${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="Policy of Carry" id={`sdPolicyOfCarry${prelimAppicationId}`} />
                                        </Grid>
                                        <Grid item xs="auto">
                                            <DocumentChip label="Contribution Agreement" id={`sdContributionAgreement${prelimAppicationId}`} />
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
});



export default PrelimApplicationData;

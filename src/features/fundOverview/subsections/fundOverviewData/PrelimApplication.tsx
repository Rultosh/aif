import { Box, Button, Card, CardContent, Chip, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, Switch, TextField, Typography, Autocomplete } from "@mui/material";
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
import { useAsyncError, useNavigate, useParams } from "react-router-dom";
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

    const [fundManager] = useState(prelimApplicationFormData.fundManager);

    const MIN_DATE = dayjs("2020-01-01");

    const dispatch = useAppDispatch()

    const dealSectorOptions = [
        "Automobile And Auto Components",
        "Capital Goods",
        "Chemicals",
        "Construction & Construction Materials",
        "Consumer Services",
        "Fast Moving Consumer Goods",
        "Financial Services",
        "Healthcare",
        "Information Technology",
        "Metals & Mining",
        "Oil, Gas & Consumable Fuels",
        "Power",
        "Realty",
        "Services",
        "Telecommunication",
        "Textiles"
    ];

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

    const savePrelimApplicationForm = async (data: IPrelimApplicationData) => {
        // console.log("onSubmit called", data);
        if (data.id) {
            await dispatch(updatePrelimApplicationAsync(wrapArgument(actionUid, data)));
            if (props.onSaveSuccess) {
                props.onSaveSuccess();
            }
        } else {
            const resultAction = await dispatch(createPrelimApplicationAsync(wrapArgument(actionUid, data)));
            if (createPrelimApplicationAsync.fulfilled.match(resultAction)) {
                if (props.onSaveSuccess) {
                    props.onSaveSuccess();
                }
            }
        }
    };

    const handleChange = (ev: any) => {
        if (ev.preventDefault) {
            ev.preventDefault();
        }

        let value = ev.target.value;
        const id = ev.target.id || ev.target.name;

        if (id === 'termOfFund') {
            value = value.replace(/[^0-9]/g, '');
            if (value !== '' && parseInt(value) > 200) {
                value = '200';
            }
        }

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
            if (id === 'contributionSought') {
                value = value.replace(/[^0-9.]/g, '');
                const dotCount = (value.match(/\./g) || []).length;
                if (dotCount > 1) {
                    const parts = value.split('.');
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
                if (value !== '' && !isNaN(parseFloat(value))) {
                    if (parseFloat(value) > 10000) {
                        value = '10000';
                    }
                }
            }

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
    };

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

        if (num !== undefined && convert(num) != undefined) {
            const result = convert(num).trim();
            return result ? result + ' Rupees only' : '';
        } else {
            return ''
        }
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
        'preferredReturn', 'otherExpenses', 'targetReturnIRR', 'managementFees',
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
        fundManager: Yup.string().required("Fund Manager is required").nullable(),
        // dealType: Yup.string(),
        // impact: Yup.string(),
        aifCategory: Yup.string().required("AIF Category is required").nullable(),
        dateOfFilingWithSEBI: Yup.mixed().required("This value is required").test("min-date", "Date cannot be before 01/01/2020", (value) => {
            if (!value) return true;
            const dateValue = dayjs(value);
            return dateValue.isValid() && !dateValue.isBefore(dayjs("2020-01-01"));
        }).nullable(),
        dealSector: Yup.string().required("Deal Sector is required").nullable(),
        dealSubsector: Yup.string().required("Deal Sub Sector is required").nullable(),
        nameOfTrustee: Yup.string().required("Name of Trustee is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        contributionSought: Yup.string().required("Contribution Sought is required").test("test-name", "Enter value that cannot exceed 25% of target corpus", function (value: any) {
            let sdTotalTargetCorpusVal = Number(prelimApplicationFormData.sdTotalTargetCorpus || '0');
            let contributionSoughtVal = Number(value || '0');
            let sdTotalTargetCorpusValCalc = sdTotalTargetCorpusVal * 0.25; // Not more than 25%
            if (sdTotalTargetCorpusValCalc < contributionSoughtVal) {
                return false;
            }
            return true;
        }).test("max-value", "Value cannot exceed 10000", (value) => {
            if (!value) return true;
            return parseFloat(value) <= 10000;
        }).nullable(),
        termOfFund: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Term of Fund must be a number").required("Term of Fund is required").min(0, "Negative values not allowed").max(200, "Term of Fund cannot exceed 200"),
        commitmentPeriod: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Commitment Period must be a number").required("Commitment Period is required").min(0, "Negative values not allowed"),
        preferredReturn: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Preferred Return must be a number").required("Preferred Return is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        managementFees: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Management Fees must be a number").required("Management Fees is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        carriedInterest: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Carried Interest must be a number").required("Carried Interest is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        description: Yup.string().required("Description is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        // investmentStrategy: Yup.string().required("Investment Strategy is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
        sdDescription: Yup.string().required("Capital raised till date is required").nullable(),
        sdTargetCorpusDomestic: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Domestic must be a number").required("Domestic is required").min(0, "Negative values not allowed"),
        sdTargetCorpusOverseas: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Overseas must be a number").required("Overseas is required").min(0, "Negative values not allowed"),
        sdTotalTargetCorpus: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).required("Total Target Corpus is required").min(100, "Value less than Rs. 100 crores shall not be allowed"),
        sdGreenShoeTargetCorpusDomestic: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Domestic (Green Shoe) must be a number").required("Domestic (Green Shoe) is required").min(0, "Negative values not allowed"),
        sdGreenShoeTargetCorpusOverseas: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Overseas (Green Shoe) must be a number").required("Overseas (Green Shoe) is required").min(0, "Negative values not allowed"),
        sdGreenShoeTotalTargetCorpus: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Total Target Corpus (Green Shoe) must be a number").required("Total Target Corpus (Green Shoe) is required").min(0, "Negative values not allowed"),
        sdFirstClosingDomesticAmount: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Domestic Amount must be a number").required("Domestic Amount is required").min(0, "Negative values not allowed"),
        sdFirstClosingOverseasAmount: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Overseas Amount must be a number").required("Overseas Amount is required").min(0, "Negative values not allowed"),
        sdFirstClosingDomesticAmountDate: Yup.string().required("This value is required").nullable(),
        // sdFirstCorpusOverseasAmountDate: Yup.string().required("This value is required").nullable(),
        aifCategoryType: Yup.string().required("AIF Category Type is required").nullable(),
        targetReturnIRR: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Target Return must be a number").required("Target Return is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        fundSetupCost: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Fund set up cost must be a number").required("Fund set up cost is required").min(0, "Negative values not allowed"),
        otherExpenses: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).typeError("Other Expenses must be a number").required("Other Expenses is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100"),
        justificationForHurdleCarryInterestRate: Yup.string().required("Justification for Hurdle and carry interest rate is required").nullable(),
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

    const onSubmit = (data: IPrelimApplicationData) => {
        console.log(data);
        savePrelimApplicationForm(data);
    };

    // errors && console.log('errors', JSON.stringify(errors));

    useImperativeHandle(ref, () => ({
        submit: async () => {
            let isValid = false;
            await handleSubmit(
                (data) => {
                    console.log(data);
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
                    {/* <Grid item xs={12}>
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
                    </Grid> */}
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        {/* <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                            <InputLabel id="fundManager-label" sx={{ backgroundColor: 'white', px: 0.5 }}>Fund Manager</InputLabel>
                            <MasterData propertyType="fundManager"
                                propertyValue={prelimApplicationFormData.fundManager || 0}
                                onChange={handleSelectChange} />
                        </FormControl> */}
                        <FormControl fullWidth variant="outlined" error={!!errors.fundManager} sx={{ display: 'flex', borderRadius: '8px' }}>
                            <InputLabel id="fundManager-label"
                                sx={{ backgroundColor: 'white', px: 0.5, borderRadius: '8px' }}
                            >Fund Manager Experience</InputLabel>
                            <Controller
                                name="fundManager"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="fundManager-label"
                                        id="fundManager"
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleChange({
                                                preventDefault: () => { },
                                                target: { name: 'fundManager', value: e.target.value }
                                            });
                                        }}
                                    >
                                        <MenuItem value={"First Time Fund Manager"}>First Time Fund Manager</MenuItem>
                                        <MenuItem value={"Two Funds Managed"}>Two Funds Managed</MenuItem>
                                        <MenuItem value={"More Than Two Funds Managed"}>More Than Two Funds Managed</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.fundManager && (
                                <FormHelperText>{errors.fundManager.message as string}</FormHelperText>
                            )}
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
                        {/* <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                            <InputLabel id="aifCategory-label" sx={{ backgroundColor: 'white', px: 0.5 }}>AIF Category</InputLabel>
                            <MasterData propertyType="aifCategory"
                                propertyValue={prelimApplicationFormData.aifCategory || 0}
                                onChange={handleSelectChange} />
                        </FormControl> */}
                        <FormControl fullWidth variant="outlined" error={!!errors.aifCategory} sx={{ display: 'flex', borderRadius: '8px' }}>
                            <InputLabel id="aifCategory-label"
                                sx={{ backgroundColor: 'white', px: 0.5, borderRadius: '8px' }}>AIF Category</InputLabel>
                            <Controller
                                name="aifCategory"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="aifCategory-label"
                                        id="aifCategory"
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleChange({
                                                preventDefault: () => { },
                                                target: { name: 'aifCategory', value: e.target.value }
                                            });
                                        }}
                                    >
                                        <MenuItem value={"Category I"}>Category I</MenuItem>
                                        <MenuItem value={"Category II"}>Category II</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.aifCategory && (
                                <FormHelperText>{errors.aifCategory.message as string}</FormHelperText>
                            )}
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
                                        <FormControlLabel value="Equity Oriented AIF" control={<Radio size="small" />} label="Equity Oriented AIF" />
                                        <FormControlLabel value="Debt Oriented AIF" control={<Radio size="small" />} label="Debt Oriented AIF" />
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
                            label="Name Of the Trustee"
                            value={prelimApplicationFormData.nameOfTrustee || ''}
                            {...register("nameOfTrustee")}
                            error={!!errors.nameOfTrustee}
                            helperText={errors.nameOfTrustee?.message as string}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                            id="contributionSought"
                            label="Contribution Sought (₹ Crore)"
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
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="targetReturnIRR"
                            label="Target Return in the Fund (IRR in %)"
                            value={prelimApplicationFormData.targetReturnIRR || ''}
                            {...register("targetReturnIRR")}
                            error={!!errors.targetReturnIRR}
                            helperText={errors.targetReturnIRR?.message as string}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="fundSetupCost"
                            label="Fund Set Up Cost (₹ Crore)"
                            value={prelimApplicationFormData.fundSetupCost || ''}
                            {...register("fundSetupCost")}
                            error={!!errors.fundSetupCost}
                            helperText={
                                errors.fundSetupCost
                                    ? (errors.fundSetupCost.message as string)
                                    : (prelimApplicationFormData?.fundSetupCost
                                        ? numberToWordsIndian(parseFloat(String(prelimApplicationFormData.fundSetupCost)) * 10000000)
                                        : '')
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            id="otherExpenses"
                            label="Other Expenses (%)"
                            value={prelimApplicationFormData.otherExpenses || ''}
                            {...register("otherExpenses")}
                            error={!!errors.otherExpenses}
                            helperText={errors.otherExpenses?.message as string}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            id="justificationForHurdleCarryInterestRate"
                            label="Justification For Hurdle and Carried Interest Rate"
                            value={prelimApplicationFormData.justificationForHurdleCarryInterestRate || ''}
                            {...register("justificationForHurdleCarryInterestRate")}
                            error={!!errors.justificationForHurdleCarryInterestRate}
                            helperText={errors.justificationForHurdleCarryInterestRate?.message as string}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        {/* <FormControl variant="outlined" sx={{ display: 'flex', borderRadius: '8px' }}>
                            <InputLabel id="demo-simple-select-standard-label"
                                sx={{ backgroundColor: 'white', px: 0.5, borderRadius: '8px' }}
                            >Deal Sector</InputLabel>
                            <Select
                                labelId="dealSector"
                                id="dealSector"
                                value={prelimApplicationFormData.dealSector || ""}
                                onChange={handleChange}
                                name="dealSector"
                            // defaultValue={prelimApplicationFormData.dealSector || ""}
                            >
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Automobile And Auto Components"} 
                                key={"Automobile And Auto Components"} value={"Automobile And Auto Components"}>Automobile And Auto Components</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Capital Goods"} 
                                key={"Capital Goods"} value={"Capital Goods"}>Capital Goods</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Chemicals"} 
                                key={"Chemicals"} value={"Chemicals"}>Chemicals</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Construction & Construction Materials"} 
                                key={"Construction & Construction Materials"} value={"Construction & Construction Materials"}>Construction & Construction Materials</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Consumer Services"} 
                                key={"Consumer Services"} value={"Consumer Services"}>Consumer Services</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Fast Moving Consumer Goods"} 
                                key={"Fast Moving Consumer Goods"} value={"Fast Moving Consumer Goods"}>Fast Moving Consumer Goods</MenuItem>
                                <MenuItem
                                // selected={prelimApplicationFormData.dealSector === "Financial Services"}
                                key={"Financial Services"}
                                value={"Financial Services"}>
                                    Financial Services
                                </MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Healthcare"}
                                key={"Healthcare"} value={"Healthcare"}>Healthcare</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Information Technology"}
                                key={"Information Technology"} 
                                value={"Information Technology"}>
                                    Information Technology
                                </MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Metals & Mining"} 
                                key={"Metals & Mining"} value={"Metals & Mining"}>Metals & Mining</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Oil, Gas & Consumable Fuels"} 
                                key={"Oil, Gas & Consumable Fuels"} value={"Oil, Gas & Consumable Fuels"}>Oil, Gas & Consumable Fuels</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Power"} 
                                key={"Power"} value={"Power"}>Power</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Realty"} 
                                key={"Realty"} value={"Realty"}>Realty</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Services"} 
                                key={"Services"} value={"Services"}>Services</MenuItem>
                                <MenuItem
                                // selected={prelimApplicationFormData.dealSector === "Telecommunication"}
                                key={"Telecommunication"} value={"Telecommunication"}>Telecommunication</MenuItem>
                                <MenuItem 
                                // selected={prelimApplicationFormData.dealSector === "Textiles"} 
                                key={"Textiles"} value={"Textiles"}>Textiles</MenuItem>
                            </Select>
                        </FormControl> */}
                        <FormControl fullWidth>
                            <Controller
                                name="dealSector"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={dealSectorOptions}
                                        value={(field.value as any) || null}
                                        onChange={(event, newValue) => {
                                            field.onChange(newValue);
                                            handleChange({
                                                target: {
                                                    name: "dealSector",
                                                    value: newValue || ""
                                                }
                                            } as any);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Deal Sector"
                                                variant="outlined"
                                                error={!!errors.dealSector}
                                                helperText={errors.dealSector?.message}
                                                sx={{
                                                    borderRadius: "8px",
                                                    backgroundColor: "white"
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </FormControl>
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
                            onChange={(e) => {
                                handleChange(e);
                            }}
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                        label="Capital Raised Till Date (₹ Crore)"
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                                                    label="Closing Date"
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
                                        sx={{ ...numericSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                </Grid>
            </Box >
        );
    else if (prelimApplicationState.status.fetchStatus === FetchStatus.FAILED)
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                    Failed to load data
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {prelimApplicationState.status.message || "An unexpected error occurred while fetching application data."}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (Number(prelimAppicationId)) {
                            dispatch(getPrelimApplicationData(
                                wrapArgument(actionUid, Number(prelimAppicationId))
                            ))
                        }
                    }}
                >
                    Retry
                </Button>
            </Box>
        );
    else
        return <Box sx={{ p: 3, textAlign: 'center' }}><Typography>Loading...</Typography></Box>
});



export default PrelimApplicationData;

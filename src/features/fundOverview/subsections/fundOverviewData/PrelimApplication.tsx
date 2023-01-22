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
                            value={prelimApplicationFormData.nameOfTheFund || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', ml: 2 }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            id="sponsor"
                            label="Sponsor"
                            value={prelimApplicationFormData.sponsor || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            id="investmentManager"
                            label="Investment Manager (IM)/AMC"
                            value={prelimApplicationFormData.investmentManager || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
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
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                    </Grid>

                    <Grid item xs={4} >
                        <Box sx={{ mr: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <Stack spacing={3}>
                                    <DesktopDatePicker
                                        disableFuture={true}
                                        label="Date of Filling PPM with SEBI"
                                        value={prelimApplicationFormData.dateOfFilingWithSEBI || null}
                                        minDate={Today.toString()}
                                        onChange={(newValue) => {
                                            setDateValue("dateOfFilingWithSEBI", newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
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
                            value={prelimApplicationFormData.contributionSought || ''}
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
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="termOfFund"
                            label="Term of the Fund (No. of months from final closing)"
                            value={prelimApplicationFormData.termOfFund || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="commitmentPeriod"
                            label="Commitment Period (No. of months from first closing)"
                            value={prelimApplicationFormData.commitmentPeriod || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="preferredReturn"
                            label="Preferred Return/Hurdle Rate p.a. Per Tax(%)"
                            value={prelimApplicationFormData.preferredReturn || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', ml: 2 }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="managementFees"
                            label="Management Fee(%)"
                            value={prelimApplicationFormData.managementFees || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex' }}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            id="carriedInterest"
                            label="Carried Interest(%)"
                            value={prelimApplicationFormData.carriedInterest || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
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
                                onChange={handleChange}
                                name="dealSubsector"
                            >

                                {prelimApplicationFormData.dealSector && 
                                    (dealSubSectorValues as any)[String(prelimApplicationFormData.dealSector || 0)]  && 
                                    (dealSubSectorValues as any)[String(prelimApplicationFormData.dealSector || 0)].values.map((item : string) => {
                                        return <MenuItem key={item} value={item} selected={String(prelimApplicationFormData.dealSubsector || '') === item}>{item}</MenuItem>
                                    })}
                            </Select>

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
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', mr: 2 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            id="investmentStrategy"
                            label="Investment Strategy"
                            value={prelimApplicationFormData.investmentStrategy || ''}
                            onChange={handleChange}
                            variant="standard"
                            sx={{ display: 'flex', ml: 2, mr: 2 }}
                        />
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
                                                    value={prelimApplicationFormData.sdDescription || ''}
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
                                                value={prelimApplicationFormData.sdTargetCorpusDomestic || ''}
                                                onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdTargetCorpusOverseas"
                                                label="Overseas, if any"
                                                value={prelimApplicationFormData.sdTargetCorpusOverseas || ''}
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
                                        </Grid>

                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdTotalTargetCorpus"
                                                label="Total Target Corpus (INR Crore)"
                                                value={prelimApplicationFormData.sdTotalTargetCorpus || ''}
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
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mt: 5, flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Target Corpus (Green Shoe)</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdGreenShoeTargetCorpusDomestic"
                                                label="Domestic"
                                                value={prelimApplicationFormData.sdGreenShoeTargetCorpusDomestic || ''}
                                                onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdGreenShoeTargetCorpusOverseas"
                                                label="Overseas, if any"
                                                value={prelimApplicationFormData.sdGreenShoeTargetCorpusOverseas || ''}
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
                                        </Grid>

                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                type="number"
                                                id="sdGreenShoeTotalTargetCorpus"
                                                label="Total Target Corpus (INR Crore)"
                                                value={prelimApplicationFormData.sdGreenShoeTotalTargetCorpus || ''}
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
                                                value={prelimApplicationFormData.sdFirstClosingDomesticAmount || ''}
                                                onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                        </Grid>

                                        <Grid item xs={3}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                <Stack spacing={3}>
                                                    <DesktopDatePicker
                                                        label="Date"
                                                        value={prelimApplicationFormData.sdFirstClosingDomesticAmountDate || null}
                                                        minDate={Today.toString()}
                                                        onChange={(newValue) => {
                                                            setDateValue("sdFirstClosingDomesticAmountDate", newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
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
                                                value={prelimApplicationFormData.sdFirstClosingOverseasAmount || ''}
                                                onChange={handleChange}
                                                variant="standard"
                                                sx={{ display: 'flex' }}
                                            />
                                        </Grid>



                                        <Grid item xs={3}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                                <Stack spacing={3}>
                                                    <DesktopDatePicker
                                                        label="Date"
                                                        value={prelimApplicationFormData.sdFirstCorpusOverseasAmountDate || null}
                                                        minDate={Today.toString()}
                                                        onChange={(newValue) => {
                                                            setDateValue("sdFirstCorpusOverseasAmountDate", newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
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
                                                    onClick={savePrelimApplicationForm}
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
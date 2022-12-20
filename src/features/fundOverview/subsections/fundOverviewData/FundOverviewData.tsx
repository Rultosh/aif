import { Box, Button, Card, CardContent, Chip, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveFormData, submitResults, fetchResults } from './fundOverviewDataSlice'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'




interface fundOverviewData {
    NameOfTheFund: string,
    sponcer: string,
    investmentManager: string,
    fundManager: string,
    dealType: string,
    impact: string,
    aifCategory: string,
    nameOfTheTrustee: string,
    contribution: string,
    term: string,
    commitment: string,
    returnPercent: string,
    fees: string,
    carriedInterest: string,
    dealSector: string,
    dealSubSector: string,
    description: string,
    investmentStrategy: string,
    supportingDescription: string,
    domestic: string,
    overseas: string,
    totalCorpus: string,
    domesticAmount: string,
    overseasAmount: string,
}


const initialState = {} as fundOverviewData

type resultSchema = {
    id: string,
    value: string
}


export const FundOverviewData = () => {
    const fetchedData = useAppSelector(state => state.fundData.formData);
    const [formValue, setFormValue] = useState({} as fundOverviewData);



    const [value, setValue] = useState<Dayjs | null>(
        //dayjs('2014-08-18T21:11:54'),
    );
    const dispatch = useAppDispatch()

    const handleChangeDate = (newValue: Dayjs | null) => {
        setValue(newValue);
    };

    useEffect(() => {
        // dispatch(fetchQuestions())
        if (Object.keys(fetchedData).length === 0) {
            dispatch(fetchResults())
            console.log("in use effect,", fetchedData);
        } else {
            updateStateValues()
        }
        //setFormValue(fetchedData);
    }, [fetchedData])

    function updateStateValues() {
        console.log("in use updateStateValues,", fetchedData);
        setFormValue(fetchedData)
    }


    const handleChange = (ev: any) => {

        ev.preventDefault();
        console.log('checking state value', value)
        //const ev = (e.target as HTMLInputElement);

        let copiedValue = { ...formValue };
        if (ev.target.id !== undefined) {
            copiedValue[ev.target.id as keyof typeof initialState] = ev.target.value;
        } else {
            copiedValue[ev.target.name as keyof typeof initialState] = ev.target.value;
        }

        setFormValue(copiedValue);
    };

    function handleClick() {
        console.log(formValue);
        // dispatch(saveFormData(state))
        //dispatch(submitResults(formValue));
    }

    function handleSubmitForm() {
        console.log(formValue);
        // dispatch(saveFormData(state))
        dispatch(submitResults(formValue));
    }



    return (
        <Box>
            <Grid container spacing={2} >
                <Grid item xs={4}>
                    <TextField
                        required
                        id="NameOfTheFund"
                        label="Name of the Fund"
                        defaultValue={formValue.nameOfTheTrustee === undefined ? " " : formValue["NameOfTheFund"]}
                        value={formValue["NameOfTheFund"]}
                        variant="standard"
                        onChange={handleChange}

                        sx={{ display: 'flex', ml: 2 }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        id="sponcer"
                        label="Sponcer"
                        defaultValue={formValue["sponcer"] === undefined ? " " : formValue["sponcer"]}
                        value={formValue["sponcer"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex' }}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        required
                        id="investmentManager"
                        label="Investment Manager (IM)/AMC"
                        defaultValue={formValue["investmentManager"] === undefined ? " " : formValue["investmentManager"]}
                        value={formValue["investmentManager"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', mr: 2 }}
                    />
                </Grid>

                <Grid item xs={4}>
                    <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                        <InputLabel id="demo-simple-select-standard-label">Fund Manager</InputLabel>
                        <Select
                            labelId="fundManager"
                            id="fundManager"
                            value={formValue["fundManager"]}
                            onChange={handleChange}
                            name="fundManager"
                            defaultValue={formValue["fundManager"] === undefined ? " " : formValue["fundManager"]}
                        >

                            <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                            <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                            <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                        </Select>
                    </FormControl>
                    {/*<TextField
                        required
                        id="FundManager"
                        label="Fund Manager"
                        defaultValue={formValue["FundManager"] === undefined ? " " : formValue["FundManager"]}
                        value={formValue["FundManager"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', ml: 2 }}
    /> */}
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant="standard" sx={{ display: 'flex' }}>
                        <InputLabel id="demo-simple-select-standard-label">Deal Type</InputLabel>
                        <Select
                            labelId="dealType"
                            id="dealType"
                            value={formValue["dealType"]}
                            onChange={handleChange}
                            name="dealType"
                            defaultValue={formValue["dealType"] === undefined ? " " : formValue["dealType"]}
                        >

                            <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                            <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                            <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                        </Select>
                    </FormControl>
                    {/*
                    <TextField
                        required
                        id="dealType"
                        label="Deal Type"
                        defaultValue={formValue["dealType"] === undefined ? " " : formValue["dealType"]}
                        value={formValue["dealType"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex' }}
/> */}
                </Grid>

                <Grid item xs={4}>

                <FormControl variant="standard" sx={{ display: 'flex' }}>
                        <InputLabel id="demo-simple-select-standard-label">Impact</InputLabel>
                        <Select
                            labelId="impact"
                            id="impact"
                            value={formValue["impact"]}
                            onChange={handleChange}
                            name="impact"
                            defaultValue={formValue["impact"] === undefined ? " " : formValue["impact"]}
                        >

                            <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                            <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                            <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                        </Select>
                    </FormControl>
                   {/*} <TextField
                        required
                        id="impact"
                        label="Impact"
                        defaultValue={formValue["impact"] === undefined ? " " : formValue["impact"]}
                        value={formValue["impact"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', mr: 2 }}
/> */}
                </Grid>

                <Grid item xs={4}>

                <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                        <InputLabel id="demo-simple-select-standard-label">AIF Category</InputLabel>
                        <Select
                            labelId="aifCategory"
                            id="aifCategory"
                            value={formValue["aifCategory"]}
                            onChange={handleChange}
                            name="aifCategory"
                            defaultValue={formValue["aifCategory"] === undefined ? " " : formValue["aifCategory"]}
                        >

                            <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                            <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                            <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                        </Select>
                    </FormControl>
                   {/*} <TextField
                        required
                        id="aifCategory"
                        label="AIF Category"
                        defaultValue={formValue["aifCategory"] === undefined ? " " : formValue["aifCategory"]}
                        value={formValue["aifCategory"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', ml: 2 }}
/> */}
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        id="nameOfTheTrustee"
                        label="Name Of The Trustee"
                        defaultValue={formValue["nameOfTheTrustee"] === undefined ? " " : formValue["nameOfTheTrustee"]}
                        value={formValue["nameOfTheTrustee"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex' }}
                    />
                </Grid>

                <Grid item xs={4} >
                    <Box sx={{ mr: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <Stack spacing={3}>
                                <DesktopDatePicker
                                    label="Date"
                                    value={value}
                                    minDate={dayjs('2017-01-01')}
                                    onChange={(newValue) => {
                                        setValue(newValue);
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
                        id="contribution"
                        label="Contribution sought(INR crores)"
                        defaultValue={formValue["contribution"] === undefined ? " " : formValue["contribution"]}
                        value={formValue["contribution"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', ml: 2 }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        id="term"
                        label="Term of the Fund"
                        defaultValue={formValue["term"] === undefined ? " " : formValue["term"]}
                        value={formValue["term"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex' }}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        required
                        id="commitment"
                        label="Commitment Period"
                        defaultValue={formValue["commitment"] === undefined ? " " : formValue["commitment"]}
                        value={formValue["commitment"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', mr: 2 }}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        required
                        id="returnPercent"
                        label="preferred Return/Hurdle Rate p.a. per tax(%)"
                        defaultValue={formValue["returnPercent"] === undefined ? " " : formValue["returnPercent"]}
                        value={formValue["returnPercent"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', ml: 2 }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        id="fees"
                        label="Management Fee(%)"
                        defaultValue={formValue["fees"] === undefined ? " " : formValue["fees"]}
                        value={formValue["fees"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex' }}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        required
                        id="carriedInterest"
                        label="Carried Interest(%)"
                        defaultValue={formValue["carriedInterest"] === undefined ? " " : formValue["carriedInterest"]}
                        value={formValue["carriedInterest"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', mr: 2 }}
                    />
                </Grid>

                <Grid item xs={4}>
                <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                        <InputLabel id="demo-simple-select-standard-label">Deal Sector</InputLabel>
                        <Select
                            labelId="dealSector"
                            id="dealSector"
                            value={formValue["dealSector"]}
                            onChange={handleChange}
                            name="dealSector"
                            defaultValue={formValue["dealSector"] === undefined ? " " : formValue["dealSector"]}
                        >

                            <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                            <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                            <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                        </Select>
                    </FormControl>
                    {/*<TextField
                        required
                        id="dealSector"
                        label="Deal Sector"
                        defaultValue={formValue["dealSector"] === undefined ? " " : formValue["dealSector"]}
                        value={formValue["dealSector"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', ml: 2 }}
                                />*/}
                </Grid>
                <Grid item xs={4}>
                <FormControl variant="standard" sx={{ display: 'flex' }}>
                        <InputLabel id="demo-simple-select-standard-label">Deal Sub Sector</InputLabel>
                        <Select
                            labelId="dealSubSector"
                            id="dealSubSector"
                            value={formValue["dealSubSector"]}
                            onChange={handleChange}
                            name="dealSubSector"
                            defaultValue={formValue["dealSubSector"] === undefined ? " " : formValue["dealSubSector"]}
                        >

                            <MenuItem key={"Fund of funds"} value={"Fund of funds Sampath"}>Fund of funds Sampath</MenuItem>
                            <MenuItem key={"Asipre for Start-ups"} value={"Asipre for Start-ups Sampath"}>Asipre for Start-ups Sampath</MenuItem>
                            <MenuItem key={"Up Start-up Fund"} value={"Up Start-up Fund Sampath"}>Up Start-up Fund Sampath</MenuItem>
                        </Select>
                    </FormControl>
                    {/*<TextField
                        required
                        id="dealSubSector"
                        label="Deal Sub Sector"
                        defaultValue={formValue["dealSubSector"] === undefined ? " " : formValue["dealSubSector"]}
                        value={formValue["dealSubSector"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex' }}
                            />*/}
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        required
                        id="description"
                        label="Description"
                        defaultValue={formValue["description"] === undefined ? " " : formValue["description"]}
                        value={formValue["description"]}
                        variant="standard"
                        onChange={handleChange}
                        sx={{ display: 'flex', mr: 2 }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        required
                        id="investmentStrategy"
                        label="Investment Strategy"
                        defaultValue={formValue["investmentStrategy"] === undefined ? " " : formValue["investmentStrategy"]}
                        value={formValue["investmentStrategy"]}
                        variant="standard"
                        onChange={handleChange}
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
                                            <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Supporting Documents<span style={{ fontWeight: "normal" }}>(Max. file size 5 MB each)</span> </Typography>

                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Grid item xs={12}>
                                                <Chip onClick={handleClick} label="Pvt. Placement Memorandum" size="medium" sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Chip label="IM Agreement" size="medium" sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Chip label="Trust Deal" size="medium" sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Chip label="SEBI Certificate" size="medium" sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} />
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                id="supportingDescription"
                                                label="Description"
                                                defaultValue={formValue["supportingDescription"] === undefined ? " " : formValue["supportingDescription"]}
                                                value={formValue["supportingDescription"]}
                                                variant="standard"
                                                sx={{ display: 'flex', ml: 2 }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mt: 5, flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Target Corpus</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            required
                                            id="domestic"
                                            label="Domestic"
                                            defaultValue={formValue["domestic"] === undefined ? " " : formValue["domestic"]}
                                            value={formValue["domestic"]}
                                            variant="standard"
                                            onChange={handleChange}
                                            sx={{ display: 'flex', ml: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            required
                                            id="overseas"
                                            label="Overseas, if any"
                                            defaultValue={formValue["overseas"] === undefined ? " " : formValue["overseas"]}
                                            value={formValue["overseas"]}
                                            variant="standard"
                                            onChange={handleChange}
                                            sx={{ display: 'flex' }}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField
                                            required
                                            id="totalCorpus"
                                            label="Total Target Corpus (INR Crore)"
                                            defaultValue={formValue["totalCorpus"] === undefined ? " " : formValue["totalCorpus"]}
                                            value={formValue["totalCorpus"]}
                                            variant="standard"
                                            onChange={handleChange}
                                            sx={{ display: 'flex', mr: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="subtitle2" sx={{ mt: 5, flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>First Closing</Typography>

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel sx={{ mt: 5 }} control={<Switch />} label="No" />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            required
                                            id="domesticAmount"
                                            label="Domestic Amount"
                                            defaultValue={formValue["domesticAmount"] === undefined ? " " : formValue["domesticAmount"]}
                                            value={formValue["domesticAmount"]}
                                            variant="standard"
                                            onChange={handleChange}
                                            sx={{ display: 'flex', ml: 2 }}
                                        />
                                    </Grid>

                                    <Grid item xs={3}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <Stack spacing={3}>
                                                <DesktopDatePicker
                                                    label="Date"
                                                    value={value}
                                                    minDate={dayjs('2017-01-01')}
                                                    onChange={(newValue) => {
                                                        setValue(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField
                                            required
                                            id="overseasAmount"
                                            label="Overseas Amount"
                                            defaultValue={formValue["overseasAmount"] === undefined ? " " : formValue["overseasAmount"]}
                                            value={formValue["overseasAmount"]}
                                            variant="standard"
                                            onChange={handleChange}
                                            sx={{ display: 'flex' }}
                                        />
                                    </Grid>



                                    <Grid item xs={3}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                            <Stack spacing={3}>
                                                <DesktopDatePicker
                                                    label="Date"
                                                    value={value}
                                                    minDate={dayjs('2017-01-01')}
                                                    onChange={(newValue) => {
                                                        setValue(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={6} >
                                        <Box display="flex"
                                            justifyContent="center"
                                            alignItems="center">
                                            <Button variant="contained" disableElevation sx={{ textTransform: 'none', width: 200 }} onClick={handleSubmitForm}>
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
    );
}



export default FundOverviewData;

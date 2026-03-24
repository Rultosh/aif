import { Box, Button, Card, CardContent, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Typography, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react"
import { createInvestmentPastAsync, updateInvestmentPastAsync } from './investmentPastSlice'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentPast, IInvestmentPast } from "./IInvestmentPast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import UploadComponents from "../../../../DetailedApplicationComponent/subsections/uploadComponents";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { PrelimApplicationState, selectPrelimApplication } from "../prelimApplicationDataSlice";

interface InvestmentPastModelProps {
  investmentPastFormData: IInvestmentPast,
  prelimApplicationId: Number | undefined,
  open: boolean,
  handleClose: () => void;
}

export const InvestmentPastModel = (props: InvestmentPastModelProps) => {

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

  const [actionUid] = useState(uuid())
  const [investmentPastFormData, setInvestmentPastFormData] = useState(defaultInvestmentPast)

  const dispatch = useAppDispatch();

  const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
  const aifCategoryType = prelimApplicationState.prelimApplication?.aifCategoryType || 'Equity Oriented AIF';

  function handleSubmitForm() {
    console.log("Saving investment Past", investmentPastFormData)
    if (investmentPastFormData.id) {
      dispatch(
        updateInvestmentPastAsync(
          wrapArgument(actionUid, investmentPastFormData)
        )
      )
    } else {
      dispatch(
        createInvestmentPastAsync(
          wrapArgument(actionUid, investmentPastFormData)
        )
      )
    }
    handleCloseModal();
  }

  const handleCloseModal = () => {
    reset();
    props.handleClose();
  }

  useEffect(() => {
    const data = { ...props.investmentPastFormData, prelimApplicationId: props.prelimApplicationId };
    setInvestmentPastFormData(data)
    reset(data);
  }, [props.investmentPastFormData, props.open])

  const handleChange = (ev: any) => {
    ev.preventDefault?.();
    let value = ev.target.value;
    const name = ev.target.name || ev.target.id;

    if (name === 'grossIrr') {
      if (value !== '') {
        // Strip any non-digit/dot characters (disallow minus)
        value = String(value).replace(/[^0-9.]/g, '');
        if (value.includes('.')) {
          const parts = value.split('.');
          if (parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
          }
          value = parts[0] + '.' + parts[1];
        }
      }
    }

    if (name === 'amountInvested' || name === 'shareholdingInvestee') {
      value = value.replace(/[^0-9.]/g, '');
      const dotCount = (value.match(/\./g) || []).length;
      if (dotCount > 1) {
        const parts = value.split('.');
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      // limit to two decimal places while typing
      if (value.includes('.')) {
        const parts = value.split('.');
        if (parts[1].length > 2) {
          parts[1] = parts[1].slice(0, 2);
        }
        value = parts[0] + '.' + parts[1];
      }
      if (value !== '' && !isNaN(parseFloat(value))) {
        const numValue = parseFloat(value);
        if (name === 'amountInvested' && numValue > 10000) {
          value = '10000.00';
        } else if (name === 'shareholdingInvestee' && numValue > 100) {
          value = '100';
        }
      }
    }

    if (name === 'moic') {
      // Allow only digits and a single dot
      value = value.replace(/[^0-9.]/g, '');
      const dotCount = (value.match(/\./g) || []).length;
      if (dotCount > 1) {
        const parts = value.split('.');
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      // Limit to two decimal places
      if (value.includes('.')) {
        const parts = value.split('.');
        if (parts[1].length > 2) {
          parts[1] = parts[1].slice(0, 2);
        }
        value = parts[0] + '.' + parts[1];
      }
    }

    let copiedValue: IInvestmentPast = { ...investmentPastFormData };
    copiedValue[name as keyof IInvestmentPast] = value;

    setValue(name as any, value);
    setInvestmentPastFormData(copiedValue)
  };

  const handleBlur = (ev: any) => {
    const name = ev.target.name || ev.target.id;
    let value = ev.target.value;

    if (name === 'grossIrr' && value !== '') {
      let numValue = parseFloat(String(value).replace(/[^0-9.]/g, ''));
      if (isNaN(numValue)) return;
      if (numValue < 0) numValue = Math.abs(numValue);
      const formattedValue = numValue.toFixed(2);
      setValue(name as any, formattedValue);
      setInvestmentPastFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }

    if (name === 'amountInvested' && value !== '') {
      // Ensure max value and two decimal places on blur
      let numValue = parseFloat(String(value).replace(/,/g, ''));
      if (isNaN(numValue)) return;
      if (numValue > 10000) numValue = 10000;
      const formattedValue = numValue.toFixed(2);
      setValue(name as any, formattedValue);
      setInvestmentPastFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    maxHeight: '80vh',
    overflowY: 'auto' as 'auto',
    outline: 'none'
  };

  const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
  const htmlTagsNotAllowed = "Tags not allowed in input.";
  const freeformRegx = /^[a-zA-Z0-9_\.\-, _()/]+$/;
  const validationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    sector: Yup.string().required("Sector is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    briefProfile: Yup.string().required("Business Introduction is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    dateOfInvestment: Yup.date()
      .nullable()
      .transform((curr, orig) => orig === '' ? null : curr)
      .typeError("Please enter a valid date")
      .required("Investment Date is required"),
    amountInvested: Yup.string().transform((val) => (isNaN(val) ? undefined : val)).required("Deal Size is required").test("max-value", "Value cannot exceed 10000", (value) => {
      if (!value) return true;
      return parseFloat(value) <= 10000;
    }).nullable(),
    currentStatus: Yup.string().required("Current Status is required").nullable(),
    instrumentType: Yup.string().required("Instrument Type is required").nullable(),
    shareholdingInvestee: aifCategoryType === 'Equity Oriented AIF'
      ? Yup.number().transform((value, originalValue) => (originalValue === "" ? undefined : value)).typeError("Must be a number").required("Shareholding in investee company is required").test("max-value", "Value cannot exceed 100", (value) => {
        if (!value) return true;
        return parseFloat(String(value)) <= 100;
      }).nullable()
      : Yup.string().nullable(),
    moic: Yup.string().required("MOIC is required").nullable().matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Only numbers and up to 2 decimal places are allowed"),
    grossIrr: Yup.number().transform((value, originalValue) => (originalValue === "" ? undefined : value)).typeError("Must be a number").required("Gross IRR is required").nullable(),
    timeTakenFromSourcingToClosure: Yup.number().transform((value, originalValue) => (originalValue === "" ? undefined : value)).typeError("Must be a number").required("Time taken from sourcing to closure is required").min(0, "Time cannot be negative").nullable(),
    // conflictOfInterest: Yup.string().required("Conflict of Interest is required").nullable(),
    stakeOfEmployee: Yup.string().nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    investmentStageFundingRound: Yup.string().required("Investment Stage / Funding Round is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    investmentStageDealSourced: Yup.string().required("Deal Sourced Information is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
  });

  const {
    control,
    setValue,
    getValues,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    setInvestmentPastFormData(data);
    handleSubmitForm();
  };

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

  const sectorOptions = [
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
  console.log(investmentPastFormData)

  return <Modal
    open={props.open}
    onClose={handleCloseModal}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#000080' }}>Details Of Current Investment</Typography>
      <Box component="form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="nameOfCompany"
              label="Name Of the Investee Company"
              value={investmentPastFormData.nameOfCompany || ''}
              {...register("nameOfCompany")}
              error={!!errors.nameOfCompany}
              helperText={errors.nameOfCompany?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dateOfInvestment"
                control={control}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <DesktopDatePicker
                    label="Investment Date"
                    inputFormat="DD/MM/YYYY"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      setInvestmentPastFormData(prev => ({ ...prev, dateOfInvestment: newValue }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={invalid}
                        helperText={error?.message || null}
                        sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
              id="sector"
              label="Sector"
              value={investmentPastFormData.sector || ''}
              {...register("sector")}
              error={!!errors.sector}
              helperText={errors.sector?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Controller
                name="sector"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={sectorOptions}
                    value={(field.value as any) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue);
                      handleChange({
                        target: {
                          name: "sector",
                          value: newValue || ""
                        }
                      } as any);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sector"
                        variant="outlined"
                        error={!!errors.sector}
                        helperText={errors.sector?.message as string}
                        sx={{
                          ...fieldSx,
                          backgroundColor: "white"
                        }}

                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </Grid> */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              type="text"
              id="amountInvested"
              label="Deal Size / Amount Invested (₹ Crore)"
              value={investmentPastFormData.amountInvested || ''}
              {...register("amountInvested")}
              error={!!errors.amountInvested}
              helperText={
                errors.amountInvested
                  ? (errors.amountInvested.message as string)
                  : (investmentPastFormData?.amountInvested
                    ? numberToWordsIndian(parseFloat(String(investmentPastFormData.amountInvested)) * 10000000)
                    : '')
              }
              variant="outlined"
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="briefProfile"
              label="Business Introduction & Basis For the Valuation Of Company"
              value={investmentPastFormData.briefProfile || ''}
              variant="outlined"
              multiline
              maxRows={4}
              {...register("briefProfile")}
              error={!!errors.briefProfile}
              helperText={errors.briefProfile?.message as string}
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              inputProps={{ maxLength: 1000 }}
            />
          </Grid>

          {aifCategoryType === 'Equity Oriented AIF' && (<Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              type="text"
              id="shareholdingInvestee"
              label="Shareholding In the Investee Company (%)"
              value={investmentPastFormData.shareholdingInvestee || ''}
              {...register("shareholdingInvestee")}
              error={!!errors.shareholdingInvestee}
              helperText={errors.shareholdingInvestee?.message as string}
              variant="outlined"
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
            />
          </Grid>
          )}
          <Grid item xs={12} md={aifCategoryType === 'Equity Oriented AIF' ? 4 : 6}>
            <FormControl fullWidth variant="outlined" error={!!errors.currentStatus} sx={fieldSx}>
              <InputLabel id="currentStatus-label" sx={{
                '&.Mui-focused': { color: '#FF671F' }
              }}>Current Status</InputLabel>
              <Controller
                name="currentStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="currentStatus-label"
                    label="Current Status"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e);
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Partially Exited">Partially Exited</MenuItem>
                    <MenuItem value="Exited">Exited</MenuItem>
                    <MenuItem value="Write-Off">Write-Off</MenuItem>
                  </Select>
                )}
              />
              {errors.currentStatus && <FormHelperText>{errors.currentStatus.message as string}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={aifCategoryType === 'Equity Oriented AIF' ? 4 : 6}>
            <TextField
              required
              fullWidth
              id="instrumentType"
              label="Instrument Type"
              value={investmentPastFormData.instrumentType || ''}
              {...register("instrumentType")}
              error={!!errors.instrumentType}
              helperText={errors.instrumentType?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="moic"
              label="MOIC"
              value={investmentPastFormData.moic || ''}
              {...register("moic")}
              error={!!errors.moic}
              helperText={errors.moic?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              type="number" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              id="grossIrr"
              label="Gross IRR (%)"
              value={investmentPastFormData.grossIrr || ''}
              {...register("grossIrr")}
              error={!!errors.grossIrr}
              helperText={errors.grossIrr?.message as string}
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              fullWidth
              id="stakeOfEmployee"
              label="Was There Any Stake Of Any Employee/Relative Of AMC/Fund In Said Investee Company?"
              value={investmentPastFormData.stakeOfEmployee || ''}
              variant="outlined"
              multiline
              maxRows={4}
              {...register("stakeOfEmployee")}
              error={!!errors.stakeOfEmployee}
              helperText={errors.stakeOfEmployee?.message as string}
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="investmentStageFundingRound"
              label="What Is the Funding Stage Or Round Of Investment In the Said Investee Company?"
              value={investmentPastFormData.investmentStageFundingRound || ''}
              variant="outlined"
              multiline
              maxRows={4}
              {...register("investmentStageFundingRound")}
              error={!!errors.investmentStageFundingRound}
              helperText={errors.investmentStageFundingRound?.message as string}
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              inputProps={{ maxLength: 1000 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="investmentStageDealSourced"
              label="How Was the Deal Sourced Either Through Investment Banks, Networking, Direct etc."
              value={investmentPastFormData.investmentStageDealSourced || ''}
              variant="outlined"
              multiline
              maxRows={4}
              {...register("investmentStageDealSourced")}
              error={!!errors.investmentStageDealSourced}
              helperText={errors.investmentStageDealSourced?.message as string}
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              inputProps={{ maxLength: 1000 }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              fullWidth
              type="number" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              id="timeTakenFromSourcingToClosure"
              label="Time Taken From Sourcing To Closure (In Months)"
              inputProps={{ min: 0 }}
              value={investmentPastFormData.timeTakenFromSourcingToClosure || ''}
              {...register("timeTakenFromSourcingToClosure")}
              error={!!errors.timeTakenFromSourcingToClosure}
              helperText={errors.timeTakenFromSourcingToClosure?.message as string}
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#363062' }}>
              Conflict Of Interest, If Any:
            </Typography>
            <TextField
              fullWidth
              id="conflictOfInterest"
              label="Was There Any Stake Of Any Employee/Relative Of AMC In Said Investee Company?"
              value={investmentPastFormData.conflictOfInterest || ''}
              variant="outlined"
              multiline
              maxRows={4}
              {...register("conflictOfInterest")}
              error={!!errors.conflictOfInterest}
              helperText={errors.conflictOfInterest?.message as string}
              onChange={handleChange}
              sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              inputProps={{ maxLength: 1000 }}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Supporting Documents</Typography>
            <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Investment Committee Note*</Typography>
              <UploadComponents id={`sdInvestmentCommitteeNote${investmentPastFormData.id || uuid()}`} signed={false} />
            </Box>
          </Grid> */}

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={handleCloseModal} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{
              borderRadius: '8px', textTransform: 'none', backgroundColor: '#FF671F',
              '&:hover': {
                border: '1px solid #FF671F',
                color: '#FF671F',
                backgroundColor: 'rgb(255 103 30 / 19%)'
              }
            }} >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Modal>
}
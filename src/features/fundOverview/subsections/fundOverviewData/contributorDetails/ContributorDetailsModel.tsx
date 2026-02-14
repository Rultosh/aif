import { Box, Button, Card, CardContent, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { createContributorDetailsAsync, updateContributorDetailsAsync } from './contributorDetailsSlice'
import { useAppDispatch } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultContributorDetails, IContributorDetails } from "./IContributorDetails";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UploadComponents from "../../../../DetailedApplicationComponent/subsections/uploadComponents";


interface ContrinutorDetailsModelProps {
  contributorDetailsFormData: IContributorDetails,
  prelimApplicationId: Number | undefined,
  open: boolean,
  handleClose: () => void;
}

export const ContributorDetailsModel = (props: ContrinutorDetailsModelProps) => {

  const [actionUid] = useState(uuid())
  const [contributorDetailsFormData, setContributorDetailsFormData] = useState(defaultContributorDetails)

  const dispatch = useAppDispatch();

  function handleSubmitForm() {
    console.log("Saving contributorDetailsFormData", contributorDetailsFormData)
    if (contributorDetailsFormData.id) {
      dispatch(
        updateContributorDetailsAsync(
          wrapArgument(actionUid, contributorDetailsFormData)
        )
      )
    } else {
      console.log(contributorDetailsFormData)
      dispatch(
        createContributorDetailsAsync(
          wrapArgument(actionUid, contributorDetailsFormData)
        )
      )
      // setContributorDetailsFormData({ ...props.contributorDetailsFormData, prelimApplicationId: props.prelimApplicationId })
    }
    handleCloseModal();
  }

  const handleCloseModal = () => {
    reset();
    props.handleClose();
  }

  useEffect(() => {
    const data = { ...props.contributorDetailsFormData, prelimApplicationId: props.prelimApplicationId };
    setContributorDetailsFormData(data)
    reset(data);
  }, [props.contributorDetailsFormData, props.open])

  const percentageFields = ['percentOfCorpus', 'percentOfActualCorpusRaisedPrev'];

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let value = ev.target.value;
    const name = ev.target.name || ev.target.id;

    if (percentageFields.includes(name)) {
      if (value !== '') {
        const numVal = parseFloat(value);
        if (numVal > 100) value = '100';
        if (value.includes('.')) {
          const parts = value.split('.');
          if (parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].slice(0, 2);
          }
        }
      }
    }

    let copiedValue: IContributorDetails = { ...contributorDetailsFormData };
    copiedValue[name as keyof IContributorDetails] = value;

    setValue(name as any, value);
    setContributorDetailsFormData(copiedValue)
  };

  const handleBlur = (ev: any) => {
    const name = ev.target.name || ev.target.id;
    let value = ev.target.value;

    if (percentageFields.includes(name) && value !== '') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const formattedValue = numValue.toFixed(2);
        setValue(name as any, formattedValue);
        setContributorDetailsFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      }
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    amount: Yup.string().required("Amount is required"),
    percentOfCorpus: Yup.string().required("Percent Of Corpus is required"),
    contributionType: Yup.string().required("Contribution Type is required"),
    categoryOfContributor: Yup.string().required("Category of Contributor is required"),
    dateOfCommitment: Yup.string().required("Date of commitment is required").nullable(),
    isFirstTimeContributing: Yup.string().required("This field is required"),
    amountContributedPrev: Yup.string().when('isFirstTimeContributing', {
      is: 'No',
      then: Yup.string().required("Amount Contributed is required"),
    }),
    percentOfActualCorpusRaisedPrev: Yup.string().when('isFirstTimeContributing', {
      is: 'No',
      then: Yup.string().required("% of Actual Corpus raised is required"),
    }),
  });

  const {
    control,
    setValue,
    getValues,
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const isFirstTime = watch("isFirstTimeContributing");

  const onSubmit = (data: any) => {
    console.log(data);
    setContributorDetailsFormData(data);
    handleSubmitForm();
  };

  const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '8px' } };

  return <Modal
    open={props.open}
    onClose={handleCloseModal}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#363062' }}>Details of Contributor to the Fund</Typography>
      <Box component="form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              id="name"
              label="Name"
              value={contributorDetailsFormData.name || ''}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              type='number'
              id="amount"
              label="Amount (₹ Crore)"
              value={contributorDetailsFormData.amount || ''}
              {...register("amount")}
              error={!!errors.amount}
              helperText={errors.amount?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <TextField
            type="number"
            required
            fullWidth
            id="percentOfCorpus"
            label="% of Corpus"
            value={contributorDetailsFormData.percentOfCorpus || ''}
            {...register("percentOfCorpus")}
            error={!!errors.percentOfCorpus}
            helperText={errors.percentOfCorpus?.message as string}
            variant="outlined"
            onChange={handleChange}
            onBlur={handleBlur}
            sx={fieldSx}
          />
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined" error={!!errors.contributionType} sx={fieldSx}>
              <InputLabel id="contributionType-label">Type</InputLabel>
              <Controller
                name="contributionType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="contributionType-label"
                    label="Type"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e);
                    }}
                  >
                    <MenuItem value="Foreign">Foreign</MenuItem>
                    <MenuItem value="Domestic">Domestic</MenuItem>
                  </Select>
                )}
              />
              {errors.contributionType && <FormHelperText>{errors.contributionType.message as string}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined" error={!!errors.categoryOfContributor} sx={fieldSx}>
              <InputLabel id="categoryOfContributor-label">Category of Contributor</InputLabel>
              <Controller
                name="categoryOfContributor"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="categoryOfContributor-label"
                    label="Category of Contributor"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e);
                    }}
                  >
                    <MenuItem value="Institutional Investor">Institutional Investor</MenuItem>
                    <MenuItem value="Family offices/High Net worth Individual (HNI)">Family offices/High Net worth Individual (HNI)</MenuItem>
                  </Select>
                )}
              />
              {errors.categoryOfContributor && <FormHelperText>{errors.categoryOfContributor.message as string}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dateOfCommitment"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DesktopDatePicker
                    label="Date of commitment to the fund"
                    inputFormat="DD/MM/YYYY"
                    disableFuture
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      setContributorDetailsFormData(prev => ({ ...prev, dateOfCommitment: newValue }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        sx={fieldSx}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!errors.isFirstTimeContributing}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Whether the contributor is first time contributing in the fund of the IM</Typography>
              <Controller
                name="isFirstTimeContributing"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    onChange={(e) => {
                      field.onChange(e);
                      setContributorDetailsFormData(prev => ({ ...prev, isFirstTimeContributing: e.target.value }));
                    }}
                  >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
              {errors.isFirstTimeContributing && <FormHelperText>{errors.isFirstTimeContributing.message as string}</FormHelperText>}
            </FormControl>
          </Grid>

          {isFirstTime === 'No' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="amountContributedPrev"
                  label="Amount Contributed in previous funds"
                  value={contributorDetailsFormData.amountContributedPrev || ''}
                  {...register("amountContributedPrev")}
                  error={!!errors.amountContributedPrev}
                  helperText={errors.amountContributedPrev?.message as string}
                  variant="outlined"
                  onChange={handleChange}
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="percentOfActualCorpusRaisedPrev"
                  label="% of Actual Corpus raised in previous funds"
                  value={contributorDetailsFormData.percentOfActualCorpusRaisedPrev || ''}
                  {...register("percentOfActualCorpusRaisedPrev")}
                  error={!!errors.percentOfActualCorpusRaisedPrev}
                  helperText={errors.percentOfActualCorpusRaisedPrev?.message as string}
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={fieldSx}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Supporting Documents</Typography>
            <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Letter of Intent for each contributor*</Typography>
              <UploadComponents id={`sdLetterOfIntent${contributorDetailsFormData.id || uuid()}`} signed={false} />
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={handleCloseModal} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{ borderRadius: '8px', textTransform: 'none', backgroundColor: '#363062', '&:hover': { backgroundColor: '#2a254d' } }} >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Modal>
}

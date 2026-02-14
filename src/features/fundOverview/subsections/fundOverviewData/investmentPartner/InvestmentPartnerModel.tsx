import { Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { createInvestmentTeamsPartnerLevelAsync, updateInvestmentTeamsPartnerLevelAsync } from './investmentPartnerSlice'
import { useAppDispatch } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentPartner, IInvestmentPartner } from "./IInvestmentPartner";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import UploadComponents from "../../../../DetailedApplicationComponent/subsections/uploadComponents";


interface InvestmentPartnerModelProps {
  investmentPartnerFormData: IInvestmentPartner,
  prelimApplicationId: Number | undefined,
  open: boolean,
  handleClose: () => void;
}

export const InvestmentPartnerModel = (props: InvestmentPartnerModelProps) => {

  const [actionUid] = useState(uuid())
  const [investmentPartnerFormData, setInvestmentPartnerFormData] = useState(defaultInvestmentPartner)

  const dispatch = useAppDispatch();

  function handleSubmitForm() {
    console.log("Saving investment partner", investmentPartnerFormData)
    if (investmentPartnerFormData.id) {
      dispatch(
        updateInvestmentTeamsPartnerLevelAsync(
          wrapArgument(actionUid, investmentPartnerFormData)
        )
      )
    } else {
      dispatch(
        createInvestmentTeamsPartnerLevelAsync(
          wrapArgument(actionUid, investmentPartnerFormData)
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
    const data = { ...props.investmentPartnerFormData, prelimApplicationId: props.prelimApplicationId };
    setInvestmentPartnerFormData(data)
    reset(data);
  }, [props.investmentPartnerFormData, props.open])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let value = ev.target.value;
    const name = ev.target.name || ev.target.id;

    if (name === 'yearsWorkedTogether') {
      value = value.replace(/[^0-9]/g, '');
    }

    let copiedValue: IInvestmentPartner = { ...investmentPartnerFormData };
    copiedValue[name as keyof IInvestmentPartner] = value;

    setValue(name as any, value);
    setInvestmentPartnerFormData(copiedValue)
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
    designation: Yup.string().required("Designation is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    age: Yup.string().required("Age is required"),
    qualification: Yup.string().required("Qualification is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    description: Yup.string().required("Brief details of VC/PE Experience is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    vcpeExperience: Yup.string().required("VC/PE Experience is required"),
    areaOfExpertise: Yup.string().required("Area of Expertise is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    yearsWorkedTogether: Yup.number().transform((val) => (isNaN(val) ? undefined : val)).required("This field is required"),
    legalCasesPending: Yup.string().test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
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
    setInvestmentPartnerFormData(data);
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
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#363062' }}>Details Of Investment Team (At Partner Level)</Typography>
      <Box component="form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="name"
              label="Name"
              value={investmentPartnerFormData.name || ''}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="designation"
              label="Designation"
              value={investmentPartnerFormData.designation || ''}
              {...register("designation")}
              error={!!errors.designation}
              helperText={errors.designation?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              required
              fullWidth
              type="number"
              id="age"
              label="Age"
              value={investmentPartnerFormData.age || ''}
              {...register("age")}
              error={!!errors.age}
              helperText={errors.age?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              required
              fullWidth
              id="qualification"
              label="Qualification"
              value={investmentPartnerFormData.qualification || ''}
              {...register("qualification")}
              error={!!errors.qualification}
              helperText={errors.qualification?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" error={!!errors.vcpeExperience} sx={fieldSx}>
              <InputLabel id="vcpeExperience-label">VC/PE Experience in investing</InputLabel>
              <Controller
                name="vcpeExperience"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="vcpeExperience-label"
                    label="VC/PE Experience in investing"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e);
                    }}
                  >
                    <MenuItem value="0-5 years">0-5 years</MenuItem>
                    <MenuItem value="5-10 years">5-10 years</MenuItem>
                    <MenuItem value="10-15 years">10-15 years</MenuItem>
                    <MenuItem value="15+ years">15+ years</MenuItem>
                  </Select>
                )}
              />
              {errors.vcpeExperience && <FormHelperText>{errors.vcpeExperience.message as string}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="description"
              label="Brief details of VC/PE Experience"
              value={investmentPartnerFormData.description || ''}
              variant="outlined"
              multiline
              rows={3}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message as string}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="areaOfExpertise"
              label="Area of Expertise"
              value={investmentPartnerFormData.areaOfExpertise || ''}
              {...register("areaOfExpertise")}
              error={!!errors.areaOfExpertise}
              helperText={errors.areaOfExpertise?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              type="number"
              id="yearsWorkedTogether"
              label="No. of years worked together among partners"
              value={investmentPartnerFormData.yearsWorkedTogether || ''}
              {...register("yearsWorkedTogether")}
              error={!!errors.yearsWorkedTogether}
              helperText={errors.yearsWorkedTogether?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            // inputProps={{ step: "1", onKeyDown: (e) => (e.key === '.' || e.key === 'e') && e.preventDefault() }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="legalCasesPending"
              label="Details of Legal cases pending if any in court of law"
              value={investmentPartnerFormData.legalCasesPending || ''}
              {...register("legalCasesPending")}
              error={!!errors.legalCasesPending}
              helperText={errors.legalCasesPending?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Supporting Documents</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Resume/CV/Bio-Data</Typography>
                  <UploadComponents id={`sdPartnerResume${investmentPartnerFormData.id || uuid()}`} signed={false} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Experience supporting document</Typography>
                  <UploadComponents id={`sdPartnerExperience${investmentPartnerFormData.id || uuid()}`} signed={false} />
                </Box>
              </Grid>
            </Grid>
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

import { Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { createInvestmentTeamsAssociateLevelAsync, updateInvestmentTeamsAssociateLevelAsync } from './investmentAssociateSlice'
import { useAppDispatch } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentAssociate, IInvestmentAssociate } from "./IInvestmentAssociate";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import UploadComponents from "../../../../DetailedApplicationComponent/subsections/uploadComponents";

interface InvestmentAssociateModelProps {
  investmentAssociateFormData: IInvestmentAssociate,
  prelimApplicationId: Number | undefined,
  open: boolean,
  handleClose: () => void;
}

export const InvestmentAssociateModel = (props: InvestmentAssociateModelProps) => {

  const [actionUid] = useState(uuid())
  const [investmentAssociateFormData, setInvestmentAssociateFormData] = useState(defaultInvestmentAssociate)

  const dispatch = useAppDispatch();

  function handleSubmitForm() {
    console.log("Saving investment Associate", investmentAssociateFormData)
    if (investmentAssociateFormData.id) {
      dispatch(
        updateInvestmentTeamsAssociateLevelAsync(
          wrapArgument(actionUid, investmentAssociateFormData)
        )
      )
    } else {
      dispatch(
        createInvestmentTeamsAssociateLevelAsync(
          wrapArgument(actionUid, investmentAssociateFormData)
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
    const data = { ...props.investmentAssociateFormData, prelimApplicationId: props.prelimApplicationId };
    setInvestmentAssociateFormData(data)
    reset(data);
  }, [props.investmentAssociateFormData, props.open])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let value = ev.target.value;
    const name = ev.target.name || ev.target.id;

    let copiedValue: IInvestmentAssociate = { ...investmentAssociateFormData };
    copiedValue[name as keyof IInvestmentAssociate] = value;

    setValue(name as any, value);
    setInvestmentAssociateFormData(copiedValue)
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
    investmentExperience: Yup.string().required("Investment Experience is required"),
    description: Yup.string().required("Description is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    areaOfExpertise: Yup.string().required("Area of Expertise is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
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
    setInvestmentAssociateFormData(data);
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
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#363062' }}>Details of Investment Team (At Associate Level)</Typography>
      <Box component="form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="name"
              label="Name"
              value={investmentAssociateFormData.name || ''}
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
              value={investmentAssociateFormData.designation || ''}
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
              value={investmentAssociateFormData.age || ''}
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
              value={investmentAssociateFormData.qualification || ''}
              {...register("qualification")}
              error={!!errors.qualification}
              helperText={errors.qualification?.message as string}
              variant="outlined"
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" error={!!errors.investmentExperience} sx={fieldSx}>
              <InputLabel id="investmentExperience-label">Investment Experience</InputLabel>
              <Controller
                name="investmentExperience"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="investmentExperience-label"
                    label="Investment Experience"
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
              {errors.investmentExperience && <FormHelperText>{errors.investmentExperience.message as string}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="description"
              label="Brief details of VC/PE Experience"
              value={investmentAssociateFormData.description || ''}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message as string}
              variant="outlined"
              multiline
              rows={3}
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
              value={investmentAssociateFormData.areaOfExpertise || ''}
              {...register("areaOfExpertise")}
              error={!!errors.areaOfExpertise}
              helperText={errors.areaOfExpertise?.message as string}
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
                  <UploadComponents id={`sdAssociateResume${investmentAssociateFormData.id || uuid()}`} signed={false} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Experience supporting document</Typography>
                  <UploadComponents id={`sdAssociateExperience${investmentAssociateFormData.id || uuid()}`} signed={false} />
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
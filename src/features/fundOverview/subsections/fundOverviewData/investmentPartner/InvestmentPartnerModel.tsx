import { Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Stack, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useState, useEffect } from "react"
import { createInvestmentTeamsPartnerLevelAsync, updateInvestmentTeamsPartnerLevelAsync } from './investmentPartnerSlice'
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentPartner, IInvestmentPartner } from "./IInvestmentPartner";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import UploadComponents from "../../../../DetailedApplicationComponent/subsections/uploadComponents";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getAllInvestmentResponsibleAsLeadsAsnyc, selectInvestmentResponsibleAsLeads, createInvestmentResponsibleAsLeadAsync, updateInvestmentResponsibleAsLeadAsync, deleteInvestmentResponsibleAsLeadAsync } from "../../profile-new/investmentResponsibleAsLead/investmentResponsibleAsLeadSlice";
import { IInvestmentResponsibleAsLead, defaultIIInvestmentResponsibleAsLead } from "../../profile-new/investmentResponsibleAsLead/IInvestmentResponsibleAsLead";
import Moment from 'moment';


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

  async function handleSubmitForm(data: IInvestmentPartner) {
    console.log("Saving investment partner", data)
    if (data.id) {
      return await dispatch(
        updateInvestmentTeamsPartnerLevelAsync(
          wrapArgument(actionUid, data)
        )
      )
    } else {
      return await dispatch(
        createInvestmentTeamsPartnerLevelAsync(
          wrapArgument(actionUid, data)
        )
      )
    }
  }

  const handleCloseModal = () => {
    reset();
    props.handleClose();
  }

  const investmentsAsLead = useAppSelector(selectInvestmentResponsibleAsLeads);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<IInvestmentResponsibleAsLead>(defaultIIInvestmentResponsibleAsLead);

  useEffect(() => {
    const data = { ...props.investmentPartnerFormData, prelimApplicationId: props.prelimApplicationId };
    setInvestmentPartnerFormData(data)
    reset(data);

    if (data.id) {
      dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(data.id))));
    }
  }, [props.investmentPartnerFormData, props.open])

  const handleOpenInvestmentForm = (investment?: IInvestmentResponsibleAsLead) => {
    if (investment) {
      setEditingInvestment(investment);
      investmentReset(investment);
    } else {
      setEditingInvestment({ ...defaultIIInvestmentResponsibleAsLead, teamMemberId: Number(investmentPartnerFormData.id) });
      investmentReset({ ...defaultIIInvestmentResponsibleAsLead, teamMemberId: Number(investmentPartnerFormData.id) });
    }
    setShowInvestmentForm(true);
  };

  const handleCloseInvestmentForm = () => {
    setShowInvestmentForm(false);
    setEditingInvestment(defaultIIInvestmentResponsibleAsLead);
  };

  const investmentValidationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name of company is required").nullable(),
    amountInvested: Yup.number().typeError("Must be a number").required("Amount is required"),
    dateOfInvestment: Yup.string().required("Date is required").nullable(),
    exitOrWriteOff: Yup.string().required("Required").nullable(),
    irrPercent: Yup.string().required("IRR % is required").nullable(),
    comment: Yup.string().required("Comment is required").nullable()
  });

  const {
    control: investmentControl,
    register: investmentRegister,
    handleSubmit: investmentHandleSubmit,
    setValue: investmentSetValue,
    reset: investmentReset,
    formState: { errors: investmentErrors },
  } = useForm({
    resolver: yupResolver(investmentValidationSchema),
  });

  const onInvestmentSubmit = (data: any) => {
    const payload = { ...data, teamMemberId: Number(investmentPartnerFormData.id) };
    if (payload.id) {
      dispatch(updateInvestmentResponsibleAsLeadAsync(wrapArgument(actionUid, payload))).then(() => {
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(investmentPartnerFormData.id))));
      });
    } else {
      dispatch(createInvestmentResponsibleAsLeadAsync(wrapArgument(actionUid, payload))).then(() => {
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(investmentPartnerFormData.id))));
      });
    }
    handleCloseInvestmentForm();
  };

  const handleDeleteInvestment = (investment: IInvestmentResponsibleAsLead) => {
    if (window.confirm("Are you sure you want to delete this investment?")) {
      dispatch(deleteInvestmentResponsibleAsLeadAsync(wrapArgument(actionUid, investment))).then(() => {
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(investmentPartnerFormData.id))));
      });
    }
  };

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

  const onSubmit = async (data: any) => {
    let hasIdOnAction = data.id;
    console.log('hasIdOnAction', hasIdOnAction, data.id);
    const result = await handleSubmitForm(data);

    if (result && result.payload) {
      const savedData = result.payload as IInvestmentPartner;
      setInvestmentPartnerFormData(savedData);
      reset(savedData);

      if (hasIdOnAction) {
        handleCloseModal();
      } else {
        // New record saved, id is now available, UI will update automatically
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(savedData.id))));
      }
    }
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
              maxRows={4}
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

          {investmentPartnerFormData.id && <><Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#363062' }}>Investments responsible for (as Lead and Non-Lead)</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleOpenInvestmentForm()}
                // disabled={!investmentPartnerFormData.id}
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none', borderRadius: '8px' }}
              >
                Add Investment
              </Button>
            </Box>

            <Collapse in={showInvestmentForm}>
              <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>{editingInvestment.id ? 'Edit Investment' : 'Add New Investment'}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name of company"
                      size="small"
                      {...investmentRegister("nameOfCompany")}
                      error={!!investmentErrors.nameOfCompany}
                      helperText={investmentErrors.nameOfCompany?.message as string}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Amount invested (₹ Crore)"
                      size="small"
                      {...investmentRegister("amountInvested")}
                      error={!!investmentErrors.amountInvested}
                      helperText={investmentErrors.amountInvested?.message as string}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="dateOfInvestment"
                        control={investmentControl}
                        render={({ field }) => (
                          <DesktopDatePicker
                            label="Date of investment"
                            inputFormat="DD/MM/YYYY"
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                error={!!investmentErrors.dateOfInvestment}
                                helperText={investmentErrors.dateOfInvestment?.message as string}
                                sx={fieldSx}
                              />
                            )}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Exited/Write off"
                      size="small"
                      {...investmentRegister("exitOrWriteOff")}
                      error={!!investmentErrors.exitOrWriteOff}
                      helperText={investmentErrors.exitOrWriteOff?.message as string}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="dateofExitorWriteOff"
                        control={investmentControl}
                        render={({ field }) => (
                          <DesktopDatePicker
                            label="Date of exit"
                            inputFormat="DD/MM/YYYY"
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            renderInput={(params) => (
                              <TextField {...params} size="small" fullWidth sx={fieldSx} />
                            )}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="IRR Percent"
                      size="small"
                      {...investmentRegister("irrPercent")}
                      error={!!investmentErrors.irrPercent}
                      helperText={investmentErrors.irrPercent?.message as string}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Comment"
                      size="small"
                      {...investmentRegister("comment")}
                      error={!!investmentErrors.comment}
                      helperText={investmentErrors.comment?.message as string}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={handleCloseInvestmentForm} size="small" sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button onClick={investmentHandleSubmit(onInvestmentSubmit)} variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#363062' }}>Save</Button>
                  </Grid>
                </Grid>
              </Paper>
            </Collapse>

            <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name of company</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount invested (₹ Crore)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date of investment</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Exited/Write off	</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date of exit	</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>IRR Percent</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {investmentsAsLead.data[String(investmentPartnerFormData.id)]?.investmentsAsLead?.length ? (
                    investmentsAsLead.data[String(investmentPartnerFormData.id)]?.investmentsAsLead?.map((inv: IInvestmentResponsibleAsLead) => (
                      <TableRow key={inv.id}>
                        <TableCell>{inv.nameOfCompany}</TableCell>
                        <TableCell>{inv.amountInvested}</TableCell>
                        <TableCell>{inv.dateOfInvestment ? Moment(inv.dateOfInvestment).format("DD/MM/YYYY") : '-'}</TableCell>
                        <TableCell>{inv.exitOrWriteOff}</TableCell>
                        <TableCell>{inv.dateofExitorWriteOff && Moment(inv.dateofExitorWriteOff).format("DD/MM/YYYY")}</TableCell>
                        <TableCell>{inv.irrPercent}</TableCell>
                        <TableCell>{inv.comment}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleOpenInvestmentForm(inv)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteInvestment(inv)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 2, color: 'text.secondary' }}>
                        {/* {!investmentPartnerFormData.id ? "Save partner details first to add investments" : "No investments added yet"} */}
                        {"No investments added yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
            </Grid></>}

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={handleCloseModal} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            {!investmentPartnerFormData.id && <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{ borderRadius: '8px', textTransform: 'none', backgroundColor: '#363062', '&:hover': { backgroundColor: '#2a254d' } }} >
              Save
            </Button>}
            {investmentPartnerFormData.id && <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{ borderRadius: '8px', textTransform: 'none', backgroundColor: '#363062', '&:hover': { backgroundColor: '#2a254d' } }} >
              Submit
            </Button>}
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Modal>
}

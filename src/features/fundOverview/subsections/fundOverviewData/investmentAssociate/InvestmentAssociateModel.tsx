import { Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Stack, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useState, useEffect } from "react"
import { createInvestmentTeamsAssociateLevelAsync, updateInvestmentTeamsAssociateLevelAsync } from './investmentAssociateSlice'
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentAssociate, IInvestmentAssociate } from "./IInvestmentAssociate";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import UploadComponents from "../../../../DetailedApplicationComponent/subsections/uploadComponents";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getAllInvestmentResponsibleAsLeadsAsnyc, selectInvestmentResponsibleAsLeads, createInvestmentResponsibleAsLeadAsync, updateInvestmentResponsibleAsLeadAsync, deleteInvestmentResponsibleAsLeadAsync } from "../../profile-new/investmentResponsibleAsLead/investmentResponsibleAsLeadSlice";
import { IInvestmentResponsibleAsLead, defaultIIInvestmentResponsibleAsLead } from "../../profile-new/investmentResponsibleAsLead/IInvestmentResponsibleAsLead";
import Moment from 'moment';

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

  async function handleSubmitForm(data: IInvestmentAssociate) {
    console.log("Saving investment Associate", data)
    if (data.id) {
      return await dispatch(
        updateInvestmentTeamsAssociateLevelAsync(
          wrapArgument(actionUid, data)
        )
      )
    } else {
      return await dispatch(
        createInvestmentTeamsAssociateLevelAsync(
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
    const data = { ...props.investmentAssociateFormData, prelimApplicationId: props.prelimApplicationId };
    setInvestmentAssociateFormData(data)
    reset(data);

    if (data.id) {
      dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(data.id))));
    }
  }, [props.investmentAssociateFormData, props.open])

  const handleOpenInvestmentForm = (investment?: IInvestmentResponsibleAsLead) => {
    if (investment) {
      setEditingInvestment(investment);
      investmentReset(investment);
    } else {
      setEditingInvestment({ ...defaultIIInvestmentResponsibleAsLead, teamMemberId: Number(investmentAssociateFormData.id) });
      investmentReset({ ...defaultIIInvestmentResponsibleAsLead, teamMemberId: Number(investmentAssociateFormData.id) });
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
    const payload = { ...data, teamMemberId: Number(investmentAssociateFormData.id) };
    if (payload.id) {
      dispatch(updateInvestmentResponsibleAsLeadAsync(wrapArgument(actionUid, payload))).then(() => {
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(investmentAssociateFormData.id))));
      });
    } else {
      dispatch(createInvestmentResponsibleAsLeadAsync(wrapArgument(actionUid, payload))).then(() => {
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(investmentAssociateFormData.id))));
      });
    }
    handleCloseInvestmentForm();
  };

  const handleDeleteInvestment = (investment: IInvestmentResponsibleAsLead) => {
    if (window.confirm("Are you sure you want to delete this investment?")) {
      dispatch(deleteInvestmentResponsibleAsLeadAsync(wrapArgument(actionUid, investment))).then(() => {
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(investmentAssociateFormData.id))));
      });
    }
  };

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

  const onSubmit = async (data: any) => {
    let hasIdOnAction = data.id;
    console.log('hasIdOnAction', hasIdOnAction, data.id);
    const result = await handleSubmitForm(data);

    if (result && result.payload) {
      const savedData = result.payload as IInvestmentAssociate;
      setInvestmentAssociateFormData(savedData);
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
              maxRows={4}
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

          {investmentAssociateFormData.id && <><Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#363062' }}>Investments responsible for (as Lead and Non-Lead)</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleOpenInvestmentForm()}
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
                  {investmentsAsLead.data[String(investmentAssociateFormData.id)]?.investmentsAsLead?.length ? (
                    investmentsAsLead.data[String(investmentAssociateFormData.id)]?.investmentsAsLead?.map((inv: IInvestmentResponsibleAsLead) => (
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
                      <TableCell colSpan={8} align="center" sx={{ py: 2, color: 'text.secondary' }}>
                        {"No investments added yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid></>}

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={handleCloseModal} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            {!investmentAssociateFormData.id && <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{ borderRadius: '8px', textTransform: 'none', backgroundColor: '#363062', '&:hover': { backgroundColor: '#2a254d' } }} >
              Save
            </Button>}
            {investmentAssociateFormData.id && <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{ borderRadius: '8px', textTransform: 'none', backgroundColor: '#363062', '&:hover': { backgroundColor: '#2a254d' } }} >
              Submit
            </Button>}
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Modal>
}
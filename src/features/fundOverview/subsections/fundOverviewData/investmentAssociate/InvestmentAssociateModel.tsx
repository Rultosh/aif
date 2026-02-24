import { Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
import { getAllInvestmentResponsibleAsNonLeadsAsnyc, selectInvestmentResponsibleAsNonLeads, createInvestmentResponsibleAsNonLeadAsync, updateInvestmentResponsibleAsNonLeadAsync, deleteInvestmentResponsibleAsNonLeadAsync } from "../../profile-new/investmentResponsibleAsNonLead/investmentResponsibleAsNonLeadSlice";
import { IInvestmentResponsibleAsNonLead, defaultIIInvestmentResponsibleAsNonLead } from "../../profile-new/investmentResponsibleAsNonLead/IInvestmentResponsibleAsNonLead";
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
  const investmentsAsNonLead = useAppSelector(selectInvestmentResponsibleAsNonLeads);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showNonLeadForm, setShowNonLeadForm] = useState(false);
  const [editingLeadInvestment, setEditingLeadInvestment] = useState<IInvestmentResponsibleAsLead>(defaultIIInvestmentResponsibleAsLead);
  const [editingNonLeadInvestment, setEditingNonLeadInvestment] = useState<IInvestmentResponsibleAsNonLead>(defaultIIInvestmentResponsibleAsNonLead);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'lead' | 'non-lead' | null>(null);

  useEffect(() => {
    const data = { ...props.investmentAssociateFormData, prelimApplicationId: props.prelimApplicationId };
    setInvestmentAssociateFormData(data)
    reset(data);

    if (data.id) {
      dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(data.id))));
      dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(data.id))));
    }
  }, [props.investmentAssociateFormData, props.open])

  const handleOpenLeadForm = (investment?: IInvestmentResponsibleAsLead) => {
    if (investment) {
      setEditingLeadInvestment(investment);
      leadReset(investment);
    } else {
      const emptyLead = {
        nameOfCompany: '',
        amountInvested: '',
        dateOfInvestment: null,
        exitOrWriteOff: '',
        dateofExitorWriteOff: null,
        irrPercent: '',
        moic: '',
        comment: '',
        teamMemberId: Number(investmentAssociateFormData.id)
      };
      setEditingLeadInvestment(emptyLead as any);
      leadReset(emptyLead as any);
    }
    setShowLeadForm(true);
  };

  const handleOpenNonLeadForm = (investment?: IInvestmentResponsibleAsNonLead) => {
    if (investment) {
      setEditingNonLeadInvestment(investment);
      nonLeadReset(investment);
    } else {
      const emptyNonLead = {
        nameOfCompany: '',
        amountInvested: '',
        dateOfInvestment: null,
        exitOrWriteOff: '',
        dateofExitorWriteOff: null,
        irrPercent: '',
        moic: '',
        comment: '',
        teamMemberId: Number(investmentAssociateFormData.id)
      };
      setEditingNonLeadInvestment(emptyNonLead as any);
      nonLeadReset(emptyNonLead as any);
    }
    setShowNonLeadForm(true);
  };

  const handleCloseLeadForm = () => {
    setShowLeadForm(false);
    setEditingLeadInvestment(defaultIIInvestmentResponsibleAsLead);
  };

  const handleCloseNonLeadForm = () => {
    setShowNonLeadForm(false);
    setEditingNonLeadInvestment(defaultIIInvestmentResponsibleAsNonLead);
  };

  const investmentValidationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name of company is required").nullable(),
    amountInvested: Yup.number().typeError("Must be a number").required("Amount is required"),
    dateOfInvestment: Yup.string().required("Date is required").nullable(),
    exitOrWriteOff: Yup.string().required("Required").nullable(),
    moic: Yup.string().required("MOIC is required").nullable(),
    irrPercent: Yup.number().typeError("Must be a number").required("IRR % is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100").nullable(),
    comment: Yup.string().required("Comment is required").nullable()
  });

  const {
    control: leadControl,
    register: leadRegister,
    handleSubmit: leadHandleSubmit,
    setValue: leadSetValue,
    reset: leadReset,
    formState: { errors: leadErrors },
  } = useForm({
    resolver: yupResolver(investmentValidationSchema),
  });

  const {
    control: nonLeadControl,
    register: nonLeadRegister,
    handleSubmit: nonLeadHandleSubmit,
    setValue: nonLeadSetValue,
    reset: nonLeadReset,
    formState: { errors: nonLeadErrors },
  } = useForm({
    resolver: yupResolver(investmentValidationSchema),
  });

  const onLeadSubmit = (data: any) => {
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
    handleCloseLeadForm();
  };

  const onNonLeadSubmit = (data: any) => {
    const payload = { ...data, teamMemberId: Number(investmentAssociateFormData.id) };
    if (payload.id) {
      dispatch(updateInvestmentResponsibleAsNonLeadAsync(wrapArgument(actionUid, payload))).then(() => {
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(investmentAssociateFormData.id))));
      });
    } else {
      dispatch(createInvestmentResponsibleAsNonLeadAsync(wrapArgument(actionUid, payload))).then(() => {
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(investmentAssociateFormData.id))));
      });
    }
    handleCloseNonLeadForm();
  };

  const handleDeleteLead = (investment: IInvestmentResponsibleAsLead) => {
    setItemToDelete(investment);
    setDeleteType('lead');
    setDeleteConfirmOpen(true);
  };

  const handleDeleteNonLead = (investment: IInvestmentResponsibleAsNonLead) => {
    setItemToDelete(investment);
    setDeleteType('non-lead');
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteType === 'lead') {
      dispatch(deleteInvestmentResponsibleAsLeadAsync(wrapArgument(actionUid, itemToDelete))).then(() => {
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(investmentAssociateFormData.id))));
      });
    } else if (deleteType === 'non-lead') {
      dispatch(deleteInvestmentResponsibleAsNonLeadAsync(wrapArgument(actionUid, itemToDelete))).then(() => {
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(investmentAssociateFormData.id))));
      });
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    setDeleteType(null);
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
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(savedData.id))));
      }
    }
  };

  const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '8px' } };

  return (
    <Modal
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" error={!!errors.investmentExperience} sx={fieldSx}>
                <InputLabel id="investmentExperience-label" shrink={true}>Investment Experience</InputLabel>
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
                label="Brief Details Of VC/PE Experience"
                value={investmentAssociateFormData.description || ''}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message as string}
                variant="outlined"
                multiline
                maxRows={4}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="areaOfExpertise"
                label="Area Of Expertise"
                value={investmentAssociateFormData.areaOfExpertise || ''}
                {...register("areaOfExpertise")}
                error={!!errors.areaOfExpertise}
                helperText={errors.areaOfExpertise?.message as string}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
                    <Typography variant="body2" sx={{ mb: 1 }}>Experience Supporting Document</Typography>
                    <UploadComponents id={`sdAssociateExperience${investmentAssociateFormData.id || uuid()}`} signed={false} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {investmentAssociateFormData.id && <><Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#363062' }}>Investments Responsible As Lead</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenLeadForm()}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Add Investment
                </Button>
              </Box>

              <Collapse in={showLeadForm}>
                <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>{editingLeadInvestment.id ? 'Edit Investment' : 'Add New Investment'}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Name Of Company"
                        size="small"
                        {...leadRegister("nameOfCompany")}
                        error={!!leadErrors.nameOfCompany}
                        helperText={leadErrors.nameOfCompany?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Amount Invested (₹ Crore)"
                        size="small"
                        {...leadRegister("amountInvested")}
                        error={!!leadErrors.amountInvested}
                        helperText={leadErrors.amountInvested?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="dateOfInvestment"
                          control={leadControl}
                          render={({ field }) => (
                            <DesktopDatePicker
                              label="Date Of Investment"
                              inputFormat="DD/MM/YYYY"
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={!!leadErrors.dateOfInvestment}
                                  helperText={leadErrors.dateOfInvestment?.message as string}
                                  InputLabelProps={{ shrink: true }}
                                  sx={fieldSx}
                                />
                              )}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Exited/Write Off"
                        size="small"
                        {...leadRegister("exitOrWriteOff")}
                        error={!!leadErrors.exitOrWriteOff}
                        helperText={leadErrors.exitOrWriteOff?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="dateofExitorWriteOff"
                          control={leadControl}
                          render={({ field }) => (
                            <DesktopDatePicker
                              label="Date Of Exit"
                              inputFormat="DD/MM/YYYY"
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={!!leadErrors.dateofExitorWriteOff}
                                  helperText={leadErrors.dateofExitorWriteOff?.message as string}
                                  InputLabelProps={{ shrink: true }}
                                  sx={fieldSx}
                                />
                              )}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="IRR (%)"
                        size="small"
                        {...leadRegister("irrPercent")}
                        error={!!leadErrors.irrPercent}
                        helperText={leadErrors.irrPercent?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="MOIC"
                        size="small"
                        {...leadRegister("moic")}
                        error={!!leadErrors.moic}
                        helperText={leadErrors.moic?.message as string}
                        InputLabelProps={{ shrink: true }}
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
                        {...leadRegister("comment")}
                        error={!!leadErrors.comment}
                        helperText={leadErrors.comment?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button onClick={handleCloseLeadForm} size="small" sx={{ textTransform: 'none' }}>Cancel</Button>
                      <Button onClick={leadHandleSubmit(onLeadSubmit)} variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#363062' }}>Save</Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Collapse>

              <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: 'none', mb: 4 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name Of Company</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount Invested (₹ Crore)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date Of Investment</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Exited/Write Off	</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date Of Exit	</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>IRR (%)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>MOIC</TableCell>
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
                          <TableCell>{inv.moic || '-'}</TableCell>
                          <TableCell>{inv.comment}</TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleOpenLeadForm(inv)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteLead(inv)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 2, color: 'text.secondary' }}>
                          {"No investments added yet"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#363062' }}>Investments Responsible As Non-Lead</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenNonLeadForm()}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Add Investment
                </Button>
              </Box>

              <Collapse in={showNonLeadForm}>
                <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>{editingNonLeadInvestment.id ? 'Edit Investment' : 'Add New Investment'}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Name Of Company"
                        size="small"
                        {...nonLeadRegister("nameOfCompany")}
                        error={!!nonLeadErrors.nameOfCompany}
                        helperText={nonLeadErrors.nameOfCompany?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Amount Invested (₹ Crore)"
                        size="small"
                        {...nonLeadRegister("amountInvested")}
                        error={!!nonLeadErrors.amountInvested}
                        helperText={nonLeadErrors.amountInvested?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="dateOfInvestment"
                          control={nonLeadControl}
                          render={({ field }) => (
                            <DesktopDatePicker
                              label="Date Of Investment"
                              inputFormat="DD/MM/YYYY"
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={!!nonLeadErrors.dateOfInvestment}
                                  helperText={nonLeadErrors.dateOfInvestment?.message as string}
                                  InputLabelProps={{ shrink: true }}
                                  sx={fieldSx}
                                />
                              )}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Exited/Write Off"
                        size="small"
                        {...nonLeadRegister("exitOrWriteOff")}
                        error={!!nonLeadErrors.exitOrWriteOff}
                        helperText={nonLeadErrors.exitOrWriteOff?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="dateofExitorWriteOff"
                          control={nonLeadControl}
                          render={({ field }) => (
                            <DesktopDatePicker
                              label="Date Of Exit"
                              inputFormat="DD/MM/YYYY"
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={!!nonLeadErrors.dateofExitorWriteOff}
                                  helperText={nonLeadErrors.dateofExitorWriteOff?.message as string}
                                  InputLabelProps={{ shrink: true }}
                                  sx={fieldSx}
                                />
                              )}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="IRR (%)"
                        size="small"
                        {...nonLeadRegister("irrPercent")}
                        error={!!nonLeadErrors.irrPercent}
                        helperText={nonLeadErrors.irrPercent?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="MOIC"
                        size="small"
                        {...nonLeadRegister("moic")}
                        error={!!nonLeadErrors.moic}
                        helperText={nonLeadErrors.moic?.message as string}
                        InputLabelProps={{ shrink: true }}
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
                        {...nonLeadRegister("comment")}
                        error={!!nonLeadErrors.comment}
                        helperText={nonLeadErrors.comment?.message as string}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button onClick={handleCloseNonLeadForm} size="small" sx={{ textTransform: 'none' }}>Cancel</Button>
                      <Button onClick={nonLeadHandleSubmit(onNonLeadSubmit)} variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#363062' }}>Save</Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Collapse>

              <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name Of Company</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount Invested (₹ Crore)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date Of Investment</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Exited/Write Off	</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date Of Exit	</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>IRR (%)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>MOIC</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {investmentsAsNonLead.data[String(investmentAssociateFormData.id)]?.investmentsAsNonLead?.length ? (
                      investmentsAsNonLead.data[String(investmentAssociateFormData.id)]?.investmentsAsNonLead?.map((inv: IInvestmentResponsibleAsNonLead) => (
                        <TableRow key={inv.id}>
                          <TableCell>{inv.nameOfCompany}</TableCell>
                          <TableCell>{inv.amountInvested}</TableCell>
                          <TableCell>{inv.dateOfInvestment ? Moment(inv.dateOfInvestment).format("DD/MM/YYYY") : '-'}</TableCell>
                          <TableCell>{inv.exitOrWriteOff}</TableCell>
                          <TableCell>{inv.dateofExitorWriteOff && Moment(inv.dateofExitorWriteOff).format("DD/MM/YYYY")}</TableCell>
                          <TableCell>{inv.irrPercent}</TableCell>
                          <TableCell>{inv.moic || '-'}</TableCell>
                          <TableCell>{inv.comment}</TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleOpenNonLeadForm(inv)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteNonLead(inv)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 2, color: 'text.secondary' }}>
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
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}
        >
          <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 'bold' }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography id="delete-dialog-description">
              Are you sure you want to delete this investment record? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDeleteConfirmOpen(false)} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained" autoFocus sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
}
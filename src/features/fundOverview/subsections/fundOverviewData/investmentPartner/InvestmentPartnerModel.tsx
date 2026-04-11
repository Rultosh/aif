import { Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
import { getAllInvestmentResponsibleAsNonLeadsAsnyc, selectInvestmentResponsibleAsNonLeads, createInvestmentResponsibleAsNonLeadAsync, updateInvestmentResponsibleAsNonLeadAsync, deleteInvestmentResponsibleAsNonLeadAsync } from "../../profile-new/investmentResponsibleAsNonLead/investmentResponsibleAsNonLeadSlice";
import { IInvestmentResponsibleAsNonLead, defaultIIInvestmentResponsibleAsNonLead } from "../../profile-new/investmentResponsibleAsNonLead/IInvestmentResponsibleAsNonLead";
import Moment from 'moment';
import DocumentChip from "../../../../../components/DocumentChip";
import { useParams } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';


interface InvestmentPartnerModelProps {
  investmentPartnerFormData: IInvestmentPartner,
  prelimApplicationId: Number | undefined,
  open: boolean,
  handleClose: () => void;
}

export const InvestmentPartnerModel = (props: InvestmentPartnerModelProps) => {
  const { id } = useParams();

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
  const investmentsAsNonLead = useAppSelector(selectInvestmentResponsibleAsNonLeads);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showNonLeadForm, setShowNonLeadForm] = useState(false);
  const [editingLeadInvestment, setEditingLeadInvestment] = useState<IInvestmentResponsibleAsLead>(defaultIIInvestmentResponsibleAsLead);
  const [editingNonLeadInvestment, setEditingNonLeadInvestment] = useState<IInvestmentResponsibleAsNonLead>(defaultIIInvestmentResponsibleAsNonLead);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'lead' | 'non-lead' | null>(null);

  useEffect(() => {
    const data = { ...props.investmentPartnerFormData, prelimApplicationId: props.prelimApplicationId };
    setInvestmentPartnerFormData(data)
    reset(data);

    if (data.id) {
      dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(data.id))));
      dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(data.id))));
    }
  }, [props.investmentPartnerFormData, props.open])

  const handleOpenLeadForm = (investment?: IInvestmentResponsibleAsLead) => {
    if (investment) {
      setEditingLeadInvestment(investment);
      leadReset(investment);
    } else {
      const emptyLead = {
        nameOfCompany: '',
        amountInvested: '',
        dateOfInvestment: null,
        // exitOrWriteOff: '',
        dateofExitorWriteOff: null,
        irrPercent: '',
        moic: '',
        comment: '',
        howWasTheDealSourced: '',
        addressOfCompany: '',
        teamMemberId: Number(investmentPartnerFormData.id)
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
        // exitOrWriteOff: '',
        dateofExitorWriteOff: null,
        irrPercent: '',
        moic: '',
        comment: '',
        howWasTheDealSourced: '',
        addressOfCompany: '',
        teamMemberId: Number(investmentPartnerFormData.id)
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
  const freeformRegx = /^[a-zA-Z0-9_\.\-, _()/\*\+&@]+$/;
  const investmentValidationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name of company is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    amountInvested: Yup.number().typeError("Must be a number").required("Amount is required").min(0, "Amount cannot be negative"),
    dateOfInvestment: Yup.date()
      .nullable()
      .transform((curr, orig) => orig === '' ? null : curr)
      .typeError("Please enter a valid date")
      .required("Date of investment is required"),
    dateofExitorWriteOff: Yup.date()
      .nullable()
      .transform((curr, orig) => orig === '' ? null : curr)
      .typeError("Please enter a valid date")
      .required("Date of exit or write off is required"),
    // exitOrWriteOff: Yup.string().required("Required").nullable(),
    moic: Yup.string().required("MOIC is required").nullable().matches(freeformRegx, "No Spl. charactors accepted, except (, . - _)"),
    irrPercent: Yup.number().typeError("Must be a number").required("IRR % is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100").nullable(),
    comment: Yup.string().required("Comment on the Exit/Write off Process is required").nullable(),
    howWasTheDealSourced: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted, except (, . - _)"),
    addressOfCompany: Yup.string().required("Address of company is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)")
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
    mode: "all",
  });

  console.log("Submit Error", leadErrors);

  const {
    control: nonLeadControl,
    register: nonLeadRegister,
    handleSubmit: nonLeadHandleSubmit,
    setValue: nonLeadSetValue,
    reset: nonLeadReset,
    formState: { errors: nonLeadErrors },
  } = useForm({
    resolver: yupResolver(investmentValidationSchema),
    mode: "all",
  });

  console.log("Submit Error", leadErrors);

  const onLeadSubmit = (data: any) => {
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
    handleCloseLeadForm();
  };

  const onNonLeadSubmit = (data: any) => {
    const payload = { ...data, teamMemberId: Number(investmentPartnerFormData.id) };
    if (payload.id) {
      dispatch(updateInvestmentResponsibleAsNonLeadAsync(wrapArgument(actionUid, payload))).then(() => {
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(investmentPartnerFormData.id))));
      });
    } else {
      dispatch(createInvestmentResponsibleAsNonLeadAsync(wrapArgument(actionUid, payload))).then(() => {
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(investmentPartnerFormData.id))));
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
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(investmentPartnerFormData.id))));
      });
    } else if (deleteType === 'non-lead') {
      dispatch(deleteInvestmentResponsibleAsNonLeadAsync(wrapArgument(actionUid, itemToDelete))).then(() => {
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(investmentPartnerFormData.id))));
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

    if (name === 'yearsWorkedTogether') {
      value = value.replace(/[^0-9.]/g, '');
    }

    let copiedValue: IInvestmentPartner = { ...investmentPartnerFormData };
    copiedValue[name as keyof IInvestmentPartner] = value;

    setValue(name as any, value, { shouldValidate: true });
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
    title: Yup.string()
      .matches(/^[A-Za-z. ]*$/, 'Please enter valid title')
      .required("Title is required")
      .nullable(),
    name: Yup.string().required("Name is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted, except (, . - _)"),
    designation: Yup.string().required("Designation is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted, except (, . - _)"),
    age: Yup.number()
      .typeError("Age must be a number")
      .min(0, "Age cannot be negative")
      .max(100, "Age cannot be greater than 100")
      .required("Age is required")
      .nullable(),
    qualification: Yup.string().required("Qualification is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted, except (, . - _)"),
    description: Yup.string().required("Brief details of AIF Business Experience is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted, except (, . - _)"),
    vcpeExperience: Yup.string().required("Experience in AIF Business is required").nullable(),
    areaOfExpertise: Yup.string().required("Area of Expertise is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted, except (, . - _)"),
    yearsWorkedTogether: Yup.number().transform((val) => (isNaN(val) ? undefined : val))
      .min(0, "Years worked together cannot be negative").required("No. Of Years Worked Together Among Partners is required"),
    legalCasesPending: Yup.string().required("Details Of Legal Cases Pending If Any In Court Of Law is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted, except (, . - _)"),
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
    mode: "all",
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
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(savedData.id))));
      }
    }
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

  return (
    <Modal
      open={props.open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#000080' }}>Details of Investment Team (At KMP Level)</Typography>
        <Box component="form">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <FormControl sx={{
                ...fieldSx,
                width: '120px',
                '& .MuiOutlinedInput-root': {
                  ...fieldSx['& .MuiOutlinedInput-root'],
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }
              }} error={!!errors.title}>
                <InputLabel id="title-label" sx={{
                  '&.Mui-focused': { color: '#FF671F' }
                }}>Title</InputLabel>
                <Select
                  required
                  labelId="title-label"
                  id="title"
                  // name="title"
                  label="Title"
                  value={investmentPartnerFormData.title || ""}
                  {...register("title")}
                  onChange={handleChange}
                >
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
                </Select>
                {errors.title && <FormHelperText>{errors.title.message as string}</FormHelperText>}
              </FormControl>
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
                InputLabelProps={{ shrink: true, required: true }}
                sx={{
                  ...fieldSx,
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    ...fieldSx['& .MuiOutlinedInput-root'],
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    ml: '-1px'
                  }, '& .MuiFormLabel-asterisk': { display: 'none' }
                }}
                inputProps={{ maxLength: 200 }}
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
                InputLabelProps={{ shrink: true, required: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                required
                fullWidth
                type="number" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                id="age"
                label="Age"
                inputProps={{ min: 0 }}
                value={investmentPartnerFormData.age || ''}
                {...register("age")}
                error={!!errors.age}
                helperText={errors.age?.message as string}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true, required: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                InputLabelProps={{ shrink: true, required: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" error={!!errors.vcpeExperience} sx={fieldSx}>
                <InputLabel id="vcpeExperience-label" sx={{
                  '&.Mui-focused': { color: '#FF671F' }
                }}>Experience in AIF Business</InputLabel>
                <Controller
                  name="vcpeExperience"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="vcpeExperience-label"
                      label="Experience in AIF Business"
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
                label="Brief Details Of AIF Business Experience"
                value={investmentPartnerFormData.description || ''}
                variant="outlined"
                multiline
                maxRows={4}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message as string}
                onChange={handleChange}
                InputLabelProps={{ shrink: true, required: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                inputProps={{ maxLength: 1000 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                maxRows={4}
                id="areaOfExpertise"
                label="Area Of Expertise"
                value={investmentPartnerFormData.areaOfExpertise || ''}
                {...register("areaOfExpertise")}
                error={!!errors.areaOfExpertise}
                helperText={errors.areaOfExpertise?.message as string}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true, required: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                inputProps={{ maxLength: 1000 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                id="yearsWorkedTogether"
                label="No. Of Years Worked Together Among Partners"
                inputProps={{ min: 0 }}
                value={investmentPartnerFormData.yearsWorkedTogether || ''}
                {...register("yearsWorkedTogether")}
                error={!!errors.yearsWorkedTogether}
                helperText={errors.yearsWorkedTogether?.message as string}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true, required: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
              // inputProps={{ step: "1", onKeyDown: (e) => (e.key === '.' || e.key === 'e') && e.preventDefault() }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                id="legalCasesPending"
                label="Details Of Legal Cases Pending If Any In Court Of Law"
                value={investmentPartnerFormData.legalCasesPending || ''}
                {...register("legalCasesPending")}
                error={!!errors.legalCasesPending}
                helperText={errors.legalCasesPending?.message as string}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true, required: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                inputProps={{ maxLength: 1000 }}
              />
            </Grid>

            {investmentPartnerFormData.id && <>
              {/* <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#363062' }}>Investments Responsible As Lead</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenLeadForm()}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#000080',
                    color: '#fff',
                    '&:hover': {
                      border: '1px solid #000080',
                      color: '#000080',
                      backgroundColor: 'rgb(208 208 237)'
                    }
                  }}
                >
                  Add Investment
                </Button>
              </Box>

              <Collapse in={showLeadForm}>
                <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>{editingLeadInvestment.id ? 'Edit Investment' : 'Add Investment'}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Name Of Company"
                        size="small"
                        {...leadRegister("nameOfCompany")}
                        error={!!leadErrors.nameOfCompany}
                        helperText={leadErrors.nameOfCompany?.message as string}
                        InputLabelProps={{ shrink: true, required: true }}
                        sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        inputProps={{ maxLength: 200 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        required
                        fullWidth
                        type="number" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        label="Amount Invested (₹ Crore)"
                        size="small"
                        inputProps={{ min: 0 }}
                        {...leadRegister("amountInvested")}
                        error={!!leadErrors.amountInvested}
                        helperText={leadErrors.amountInvested?.message as string}
                        InputLabelProps={{ shrink: true, required: true }}
                        sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="dateOfInvestment"
                          control={leadControl}
                          render={({ field, fieldState: { invalid, error } }) => (
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
                                  error={invalid}
                                  helperText={error?.message || null}
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                                />
                              )}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="dateofExitorWriteOff"
                          control={leadControl}
                          render={({ field, fieldState: { invalid, error } }) => (
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
                                  error={invalid}
                                  helperText={error?.message || null}
                                  InputLabelProps={{ shrink: true, required: true }}
                                  sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                        label="IRR (%)"
                        size="small"
                        {...leadRegister("irrPercent")}
                        error={!!leadErrors.irrPercent}
                        helperText={leadErrors.irrPercent?.message as string}
                        InputLabelProps={{ shrink: true, required: true }}
                        sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        required
                        fullWidth
                        label="MOIC"
                        size="small"
                        {...leadRegister("moic")}
                        error={!!leadErrors.moic}
                        helperText={leadErrors.moic?.message as string}
                        InputLabelProps={{ shrink: true, required: true }}
                        sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        inputProps={{ maxLength: 200 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        maxRows={4}
                        label="Address Of Company"
                        size="small"
                        {...leadRegister("addressOfCompany")}
                        error={!!leadErrors.addressOfCompany}
                        helperText={leadErrors.addressOfCompany?.message as string}
                        InputLabelProps={{ shrink: true, required: true }}
                        sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        inputProps={{ maxLength: 1000 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        maxRows={4}
                        label="Comment on the Exit/Write off Process"
                        size="small"
                        {...leadRegister("comment")}
                        error={!!leadErrors.comment}
                        helperText={leadErrors.comment?.message as string}
                        InputLabelProps={{ shrink: true, required: true }}
                        sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        inputProps={{ maxLength: 1000 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        maxRows={4}
                        label="How was the deal sourced either through Investment Banks, Networking, direct etc"
                        size="small"
                        {...leadRegister("howWasTheDealSourced")}
                        error={!!leadErrors.howWasTheDealSourced}
                        helperText={leadErrors.howWasTheDealSourced?.message as string}
                        InputLabelProps={{ shrink: true, required: true }}
                        sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                        inputProps={{ maxLength: 1000 }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button onClick={handleCloseLeadForm} size="small" sx={{ textTransform: 'none' }}>Cancel</Button>
                      <Button onClick={leadHandleSubmit(onLeadSubmit)} variant="contained" size="small" sx={{
                        textTransform: 'none',
                        backgroundColor: '#FF671F',
                        '&:hover': {
                          border: '1px solid #FF671F',
                          color: '#FF671F',
                          backgroundColor: 'rgb(255 103 30 / 19%)'
                        }
                      }}>Save</Button>
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Date Of Exit	</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>IRR (%)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>MOIC</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Comment on the Exit/Write off Process</TableCell>
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
                          {"No Investments Added Yet"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid> */}

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Details of investments undertaken by the Partner in the past 10 years</Typography>

                <Box sx={{
                  p: 2,
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '16px',
                  backgroundColor: '#fafafa'
                }}>
                  {Number(id) ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        href="/vcf/templates/Details of investments undertaken by the Partner in the past 10 years.xlsx"
                        size="small"
                        startIcon={<DownloadIcon />}
                        sx={{
                          textTransform: 'none',
                          borderRadius: '6px',
                          borderColor: 'rgba(54, 48, 98, 0.3)',
                          color: '#363062',
                          '&:hover': { borderColor: '#363062', backgroundColor: 'rgba(54, 48, 98, 0.05)' },
                          mb: '17px'
                        }}
                      >
                        Download Template
                      </Button>
                      <span style={{ marginTop: '10px' }}>
                        <DocumentChip label="Upload Document" validationTitle="Details of investments undertaken by the Partner in the past 10 years" id={`docDetailsOfInvestmentsUndertakenByThePartnerInThePast10Years${investmentPartnerFormData.id}`} required />
                      </span>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                      Please save the form to upload documents.
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Supporting Documents</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>Resume/CV/Experience</Typography>
                      <UploadComponents id={`sdPartnerResume${props.prelimApplicationId || uuid()}`} signed={false} required />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </>}

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button onClick={handleCloseModal} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
                Cancel
              </Button>
              {!investmentPartnerFormData.id && <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: '#FF671F',
                '&:hover': {
                  border: '1px solid #FF671F',
                  color: '#FF671F',
                  backgroundColor: 'rgb(255 103 30 / 19%)'
                }
              }} >
                Save
              </Button>}
              {investmentPartnerFormData.id && <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: '#FF671F',
                '&:hover': {
                  border: '1px solid #FF671F',
                  color: '#FF671F',
                  backgroundColor: 'rgb(255 103 30 / 19%)'
                }
              }} >
                Save
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
    </Modal >
  );
}

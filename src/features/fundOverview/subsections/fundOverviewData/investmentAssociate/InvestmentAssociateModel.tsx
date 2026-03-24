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

  async function handleSubmitForm(data: IInvestmentAssociate, shouldClose: boolean = false) {
    console.log("Saving investment Associate", data)
    let response: any;
    if (data.id) {
      response = await dispatch(
        updateInvestmentTeamsAssociateLevelAsync(
          wrapArgument(actionUid, data)
        )
      )
    } else {
      response = await dispatch(
        createInvestmentTeamsAssociateLevelAsync(
          wrapArgument(actionUid, data)
        )
      )
    }

    if (response && response.type.endsWith('/fulfilled')) {
      const savedData = response.payload as IInvestmentAssociate;
      const combinedData = { ...data, ...savedData };
      setInvestmentAssociateFormData(combinedData);
      reset(combinedData);

      if (!data.id) {
        // New record saved, id is now available
        dispatch(getAllInvestmentResponsibleAsLeadsAsnyc(wrapArgument(actionUid, Number(savedData.id))));
        dispatch(getAllInvestmentResponsibleAsNonLeadsAsnyc(wrapArgument(actionUid, Number(savedData.id))));
      }

      if (shouldClose) {
        handleCloseModal();
      }
    }
  }

  const handleCloseModal = () => {
    reset(defaultInvestmentAssociate);
    setInvestmentAssociateFormData(defaultInvestmentAssociate);
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
        howWasTheDealSourced: '',
        addressOfCompany: '',
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
        howWasTheDealSourced: '',
        addressOfCompany: '',
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
  const freeformRegx = /^[a-zA-Z0-9_\.\-, _()/]+$/;
  const investmentValidationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name of company is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    amountInvested: Yup.number().typeError("Must be a number").required("Amount is required"),
    dateOfInvestment: Yup.string().required("Date of investment is required").nullable(),
    dateofExitorWriteOff: Yup.string().required("Date of exit or write off is required").nullable(),
    exitOrWriteOff: Yup.string().required("Required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    moic: Yup.string().required("MOIC is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    irrPercent: Yup.number().typeError("Must be a number").required("IRR % is required").min(0, "Negative values not allowed").max(100, "Percentage cannot exceed 100").nullable(),
    comment: Yup.string().required("Comment is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    howWasTheDealSourced: Yup.string().required("This field is required").nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
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
    title: Yup.string()
      .matches(/^[A-Za-z. ]*$/, 'Please enter valid title')
      .required("Title is required")
      .nullable(),
    name: Yup.string().required("Name is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    designation: Yup.string().required("Designation is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    age: Yup.number()
      .typeError("Age must be a number")
      .min(0, "Age cannot be negative")
      .max(100, "Age cannot be greater than 100")
      .required("Age is required")
      .nullable(),
    qualification: Yup.string().required("Qualification is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    investmentExperience: Yup.string().required("Experience in AIF Business is required").nullable(),
    description: Yup.string().required("Brief Details Of AIF Business Experience is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
    areaOfExpertise: Yup.string().required("Area of Expertise is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable().matches(freeformRegx, "No Spl. charactors accepted,except (, . - _)"),
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
    const isUpdate = !!investmentAssociateFormData.id;
    console.log('Submitting investment associate. isUpdate:', isUpdate, 'ID:', investmentAssociateFormData.id, 'data:', data);

    // Pass shouldClose based on whether it's an update
    await handleSubmitForm(data, isUpdate);
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
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#000080' }}>Details of Investment Team Members (Other than KMP) – Maximum 5 Senior Members</Typography>
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
                  value={investmentAssociateFormData.title || ""}
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
                value={investmentAssociateFormData.name || ''}
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message as string}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
                value={investmentAssociateFormData.designation || ''}
                {...register("designation")}
                error={!!errors.designation}
                helperText={errors.designation?.message as string}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
                value={investmentAssociateFormData.age || ''}
                {...register("age")}
                error={!!errors.age}
                helperText={errors.age?.message as string}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
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
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" error={!!errors.investmentExperience} sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}>
                <InputLabel id="investmentExperience-label" sx={{
                  '&.Mui-focused': { color: '#FF671F' }
                }}>Experience in AIF Business</InputLabel>
                <Controller
                  name="investmentExperience"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="investmentExperience-label"
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
                {errors.investmentExperience && <FormHelperText>{errors.investmentExperience.message as string}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                label="Brief Details Of AIF Business Experience"
                value={investmentAssociateFormData.description || ''}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message as string}
                variant="outlined"
                multiline
                maxRows={4}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                inputProps={{ maxLength: 1000 }}
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
                multiline
                maxRows={4}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ ...fieldSx, '& .MuiFormLabel-asterisk': { display: 'none' } }}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            {investmentAssociateFormData.id && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Supporting Documents</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>Resume/CV/Experience</Typography>
                      <UploadComponents id={`sdAssociateResumeCvExperience${props.prelimApplicationId}`} signed={false} />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            )}

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
                {investmentAssociateFormData.id ? "Save" : "Save"}
              </Button>
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
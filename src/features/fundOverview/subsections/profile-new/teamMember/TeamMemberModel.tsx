import { Card, CardContent, Typography, Grid, Box, Button, Modal, TextField, Stack, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react"
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import { createTeamMemberAsync, updateTeamMemberAsync } from "./teamMemberSlice";
import { defaultTeamMember, ITeamMember } from "./ITeamMember";
import uuid from "react-uuid";
import { useAppDispatch } from "../../../../../app/hooks";
import { useParams } from "react-router-dom";
import { Today } from "@mui/icons-material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormHelperText from '@mui/material/FormHelperText';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface TeamMemberModelProps {
  teamMember: ITeamMember,
  open: boolean,
  onClose: (open: boolean) => void,
}

export const TeamMemberModel = (props: TeamMemberModelProps) => {
  const { id } = useParams();
  const [open, setOpen] = useState(props.open);
  const [actionId] = useState(uuid());
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    //setTeamMember(defaultTeamMember)
    setTeamMember(props.teamMember)
    setOpen(false);
    props.onClose(false);
  }
  const [teamMember, setTeamMember] = useState(props.teamMember)

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let copiedValue = { ...teamMember };
    if (ev.target.id !== undefined) {
      copiedValue[ev.target.id as keyof ITeamMember] = ev.target.value;
    } else {
      copiedValue[ev.target.name as keyof ITeamMember] = ev.target.value;
    }
    setValue(ev.target.name, ev.target.value);
    setTeamMember(copiedValue);
  };

  const setDateValue = (key: String, value: any) => {
    let copiedValue: ITeamMember = { ...teamMember };

    copiedValue[key as keyof ITeamMember] = value;

    setTeamMember(copiedValue)
  };


  useEffect(() => {
    console.log(id);
    if (props.open) handleOpen();
    if (!teamMember.prelimApplicationId && id) {
      setTeamMember({ ...teamMember, prelimApplicationId: Number(id) })
    }
    reset(props.teamMember)
  }, [props.open])

  function handleSubmitForm() {
    console.log(teamMember.id)
    if (!teamMember.id) {
      dispatch(
        createTeamMemberAsync(
          wrapArgument(
            actionId, teamMember
          )
        )
      )
    } else {
      dispatch(
        updateTeamMemberAsync(
          wrapArgument(
            actionId, teamMember
          )
        )
      )
    }

    handleClose();
  }
    
  const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
  const htmlTagsNotAllowed = "Tags not allowed in input.";
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    dob: Yup.string().required("Date of Birth is required").nullable(),
    dateofJoiningAMC: Yup.string().required("Date of Joining is required").nullable(),
    location: Yup.string().required("Location is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    yearsOfRelevantExp: Yup.string().required("Years Of Relevant Experience is required").nullable(),
    prevProfessionalExp: Yup.string().required("Previous Professional Experience is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    education: Yup.string().required("Education is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    keyPerson: Yup.string().required("Key Person is required").nullable(),
    memberOfInvesteeCommitte: Yup.string().required("Member Of Investee Committee is required").nullable(),
    directorship: Yup.string().required("Directorship Held is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable()
  });

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // setTeamMember(data);
    // setTeamMember({ ...teamMember, prelimApplicationId: Number(id) })
    handleSubmitForm();
  };
console.log(teamMember)
  return <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
        <Card sx={{ display: 'flex', }}>

          <CardContent sx={{ flex: 1 }}>
            <Grid container spacing={2} >
              <Grid item xs={9}>
                <Box sx={{ display: 'inline-flex' }}>
                  <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Team Member</Typography>
                </Box>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="name"
                  label="Name"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={teamMember.name}
                  {...register("name")}
                  error={(errors.name) ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.name)?errors.name.message : ''}</>
                </Typography>
              </Grid>
              {/*<Grid item xs={2.5}>
                <TextField
                  required
                  id="dob"
                  label="Date Of Birth"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  value={teamMember.dob}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  required
                  id="dateofJoiningAMC"
                  label="Date Of Joining"
                  value={teamMember.dateofJoiningAMC}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
</Grid>*/}
              <Grid item xs={2.25}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <Stack spacing={3}>
                    <Controller
                      name="dob"
                      control={control}
                      defaultValue={null}
                      render={({
                        field: { onChange, value },
                        fieldState: { error, invalid }
                      }) => (
                        // console.log(invalid),
                        (<DesktopDatePicker
                          inputFormat='DD/MM/YYYY'
                          disableFuture={true}
                          label="Date Of Birth"
                          value={teamMember.dob || null}
                          minDate={Today.toString()}
                          onChange={(newValue) => {
                            setValue('dob', newValue);
                            setDateValue("dob", newValue);
                          }}
                          renderInput={(params) => <TextField
                            helperText={(invalid && getValues("dob") == null && (teamMember.dob || '') == '') ? <Typography variant="caption" {...register('dob')} color="error">This value is required</Typography> : null} error={invalid} {...params} />}
                        />
                        )
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={2.25}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <Stack spacing={3}>
                    <Controller
                      name="dateofJoiningAMC"
                      control={control}
                      defaultValue={null}
                      render={({
                        field: { onChange, value },
                        fieldState: { error, invalid }
                      }) => (
                        // console.log(invalid),
                        (<DesktopDatePicker
                          inputFormat='DD/MM/YYYY'
                          disableFuture={true}
                          label="Date Of Joining AMC/IM"
                          value={teamMember.dateofJoiningAMC || null}
                          minDate={Today.toString()}
                          onChange={(newValue) => {
                            setValue('dateofJoiningAMC', newValue);
                            setDateValue("dateofJoiningAMC", newValue);
                          }}
                          renderInput={(params) => <TextField
                            helperText={(invalid && getValues("dateofJoiningAMC") == null && (teamMember.dateofJoiningAMC || '') == '') ? <Typography variant="caption" {...register('dateofJoiningAMC')} color="error">This value is required</Typography> : null} error={invalid} {...params} />}
                        />
                        )
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="location"
                  label="Location"
                  value={teamMember.location}
                  {...register("location")}
                  error={(errors.location) ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.location)?errors.location.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{ display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">Years of Relevent Experience</InputLabel>
                  <Controller
                    name="yearsOfRelevantExp"
                    control={control}
                    defaultValue={null}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid }
                    }) => (
                      console.log(invalid && (getValues("yearsOfRelevantExp") || '')),
                      (
                        <>
                          <Select
                            labelId="yearsOfRelevantExp"
                            id="yearsOfRelevantExp"
                            value={teamMember.yearsOfRelevantExp || ''}
                            onChange={handleChange}
                            name="yearsOfRelevantExp"
                            // defaultValue={teamMember["yearsOfRelevantExp"] === undefined ? " " : teamMember["yearsOfRelevantExp"]}
                            error={invalid && (getValues("yearsOfRelevantExp") == null) ? true : false}
                          >

                            <MenuItem key={"0-5 years"} value={"0-5 years"} selected={teamMember.yearsOfRelevantExp == "0-5 years"}>0-5 years</MenuItem>
                            <MenuItem key={"5-10 years"} value={"5-10 years"} selected={teamMember.yearsOfRelevantExp == "5-10 years"}>5-10 years</MenuItem>
                            <MenuItem key={"10-15 years"} value={"10-15 years"} selected={teamMember.yearsOfRelevantExp == "10-15 years"}>10-15 years</MenuItem>
                            <MenuItem key={"15+ years"} value={"15+ years"} selected={teamMember.yearsOfRelevantExp == "15+ years"}>15+ years</MenuItem>
                          </Select>
                          {invalid && (getValues("yearsOfRelevantExp") == null) ? <FormHelperText>
                            <Typography variant="caption" color="error" sx={{ ml: '10px' }}>
                              <>{errors.yearsOfRelevantExp?.message}</>
                            </Typography>
                          </FormHelperText> : <></>}
                        </>
                      )
                    )}
                  />
                </FormControl>                
              </Grid>
              <Grid item xs={4.5}>

              <TextField
                  required
                  id="prevProfessionalExp"
                  label="Previous Professional Experience"
                  value={teamMember.prevProfessionalExp}
                  {...register("prevProfessionalExp")}
                  error={(errors.prevProfessionalExp) ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.prevProfessionalExp)?errors.prevProfessionalExp.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="education"
                  label="Education"
                  value={teamMember.education}
                  {...register("education")}
                  error={(errors.education) ? true : false}
                  variant="standard"
                  onChange={handleChange}
                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.education)?errors.education.message : ''}</>
                </Typography> 
              </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{ display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">Key Person</InputLabel>
                  <Controller
                    name="keyPerson"
                    control={control}
                    defaultValue={null}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid }
                    }) => (
                      console.log(invalid && (getValues("keyPerson") || '')),
                      (
                        <>
                          <Select
                            labelId="keyPerson"
                            id="keyPerson"
                            value={teamMember.keyPerson || ''}
                            onChange={handleChange}
                            name="keyPerson"
                            // defaultValue={teamMember["keyPerson"] === undefined ? " " : teamMember["keyPerson"]}
                            error={invalid && (getValues("keyPerson") == null) ? true : false}
                          >
        
                            <MenuItem key={"Yes"} value={"Yes"} selected={teamMember.keyPerson == "Yes"}>Yes</MenuItem>
                            <MenuItem key={"No"} value={"No"} selected={teamMember.keyPerson == "No"}>No</MenuItem>
                          </Select>
                          {invalid && (getValues("keyPerson") == null) ? <FormHelperText>
                            <Typography variant="caption" color="error" sx={{ ml: '10px' }}>
                              <>{errors.keyPerson?.message}</>
                            </Typography>
                          </FormHelperText> : <></>}
                        </>
                      )
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{ display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">Member Of Investee Committee</InputLabel>
                  <Controller
                    name="memberOfInvesteeCommitte"
                    control={control}
                    defaultValue={null}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid }
                    }) => (
                      console.log(invalid && (getValues("memberOfInvesteeCommitte") || '')),
                      (
                        <>
                          <Select
                            labelId="memberOfInvesteeCommitte"
                            id="memberOfInvesteeCommitte"
                            value={teamMember.memberOfInvesteeCommitte || ''}
                            onChange={handleChange}
                            name="memberOfInvesteeCommitte"
                            // defaultValue={teamMember["memberOfInvesteeCommitte"] === undefined ? " " : teamMember["memberOfInvesteeCommitte"]}
                            error={invalid && (getValues("memberOfInvesteeCommitte") == null) ? true : false}
                          >
        
                            <MenuItem key={"Yes"} value={"Yes"} selected={teamMember.memberOfInvesteeCommitte == "Yes"}>Yes</MenuItem>
                            <MenuItem key={"No"} value={"No"} selected={teamMember.memberOfInvesteeCommitte == "No"}>No</MenuItem>
                          </Select>
                          {invalid && (getValues("memberOfInvesteeCommitte") == null) ? <FormHelperText>
                            <Typography variant="caption" color="error" sx={{ ml: '10px' }}>
                              <>{errors.memberOfInvesteeCommitte?.message}</>
                            </Typography>
                          </FormHelperText> : <></>}
                        </>
                      )
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="directorship"
                  label="Directorship Held"
                  value={teamMember.directorship}
                  {...register("directorship")}
                  error={(errors.directorship) ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.directorship)?errors.directorship.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                {/* <TextField
                  required
                  id="action"
                  label="Action"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                /> */}
              </Grid>
              <Grid item xs={12} >
                <Button onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{ textTransform: 'none' }} >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

      </Box>
    </Box>
  </Modal>
}
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
    setTeamMember(defaultTeamMember)
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
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
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
                    <DesktopDatePicker
                      disableFuture={true}
                      label="Date Of Birth"
                      value={teamMember.dob || null}
                      // minDate={Today.toString()}
                      onChange={(newValue) => {
                        setDateValue("dob", newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}

                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={2.25}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      disableFuture={true}
                      label="Date Of Joining AMC/IM"
                      value={teamMember.dateofJoiningAMC || null}
                      minDate={Today.toString()}
                      onChange={(newValue) => {
                        setDateValue("dateofJoiningAMC", newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}

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
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{ display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">Years of Relevent Experience</InputLabel>
                  <Select
                    labelId="yearsOfRelevantExp"
                    id="yearsOfRelevantExp"
                    value={String(teamMember.yearsOfRelevantExp)}
                    onChange={handleChange}
                    name="yearsOfRelevantExp"
                  >

                    <MenuItem key={"0-5 years"} value={"0-5 years"}>0-5 years</MenuItem>
                    <MenuItem key={"5-10 years"} value={"5-10 years"}>5-10 years</MenuItem>
                    <MenuItem key={"10-15 years"} value={"10-15 years"}>10-15 years</MenuItem>
                    <MenuItem key={"15+ years"} value={"15+ years"}>15+ years</MenuItem>
                  </Select>
                </FormControl>                
              </Grid>
              <Grid item xs={4.5}>

              <TextField
                  required
                  id="prevProfessionalExp"
                  label="Previous Professional Experience"
                  value={teamMember.prevProfessionalExp}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="education"
                  label="Education"
                  value={teamMember.education}
                  variant="standard"
                  onChange={handleChange}
                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{ display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">Key Person</InputLabel>
                  <Select
                    labelId="keyPerson"
                    id="keyPerson"
                    value={teamMember["keyPerson"]}
                    onChange={handleChange}
                    name="keyPerson"
                    defaultValue={teamMember["keyPerson"] === undefined ? " " : teamMember["keyPerson"]}
                  >

                    <MenuItem key={"Yes"} value={"Yes"}>Yes</MenuItem>
                    <MenuItem key={"No"} value={"No"}>No</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{ display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">Directorship Held</InputLabel>
                  <Select 
                    labelId="directorship"
                    id="directorship"
                    value={teamMember["directorship"]}
                    onChange={handleChange}
                    name="directorship"
                    defaultValue={teamMember["directorship"] === undefined ? " " : teamMember["directorship"]}
                  >

                    <MenuItem key={"Yes"} value={"Yes"} selected={teamMember["directorship"] == "Yes"}>Yes</MenuItem>
                    <MenuItem key={"No"} value={"No"} selected={teamMember["directorship"] == "No"}>No</MenuItem>
                  </Select>
                </FormControl>
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
                <Button onClick={handleSubmitForm} color='success' variant="contained" disableElevation sx={{ textTransform: 'none' }} >
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
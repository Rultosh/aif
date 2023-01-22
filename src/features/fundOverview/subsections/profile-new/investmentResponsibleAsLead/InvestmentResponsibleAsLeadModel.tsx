import { Card, CardContent, Typography, Grid, Box, Button, Modal, TextField, Stack } from "@mui/material";
import { useEffect, useState } from "react"
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import { createInvestmentResponsibleAsLeadAsync, updateInvestmentResponsibleAsLeadAsync } from "./investmentResponsibleAsLeadSlice";
import { IInvestmentResponsibleAsLead, defaultIIInvestmentResponsibleAsLead } from "./IInvestmentResponsibleAsLead";
import uuid from "react-uuid";
import { useAppDispatch } from "../../../../../app/hooks";
import { useParams } from "react-router-dom";
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

interface InvestmentResponsibleAsLeadModelProps {
  investmentResponsibleAsLead: IInvestmentResponsibleAsLead,
  open: boolean,
  onClose: (open: boolean) => void,
}

export const InvestmentResponsibleAsLeadModel = (props: InvestmentResponsibleAsLeadModelProps) => {
  const [open, setOpen] = useState(props.open);
  const [actionId] = useState(uuid());
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setInvestmentResponsibleAsLead(defaultIIInvestmentResponsibleAsLead)
    setOpen(false);
    props.onClose(false);
  }
  const [investmentResponsibleAsLead, setInvestmentResponsibleAsLead] = useState(props.investmentResponsibleAsLead)

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let copiedValue = { ...investmentResponsibleAsLead };
    if (ev.target.id !== undefined) {
      copiedValue[ev.target.id as keyof IInvestmentResponsibleAsLead] = ev.target.value;
    } else {
      copiedValue[ev.target.name as keyof IInvestmentResponsibleAsLead] = ev.target.value;
    }
    
    setInvestmentResponsibleAsLead(copiedValue);
  };

  const setDateValue = (key: String, value: any) => {
    let copiedValue: IInvestmentResponsibleAsLead = { ...investmentResponsibleAsLead };

    copiedValue[key as keyof IInvestmentResponsibleAsLead] = value;

    setInvestmentResponsibleAsLead(copiedValue)
  };

  useEffect(() => {
    console.log(investmentResponsibleAsLead.teamMemberId);
    if (props.open) handleOpen();
  }, [props.open])

  function handleSubmitForm() {
    console.log(investmentResponsibleAsLead.id)
    if (!investmentResponsibleAsLead.id) {
      dispatch(
        createInvestmentResponsibleAsLeadAsync(
          wrapArgument(
            actionId, investmentResponsibleAsLead
          )
        )
      )
    } else {
      dispatch(
        updateInvestmentResponsibleAsLeadAsync(
          wrapArgument(
            actionId, investmentResponsibleAsLead
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
                  <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Investments responsible for (as Lead)</Typography>
                </Box>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="nameOfCompany"
                  label="Name of company"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentResponsibleAsLead.nameOfCompany}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={2.25}>
                <TextField
                  required
                  type="number"
                  id="amountInvested"
                  label="Amount invested"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  value={investmentResponsibleAsLead.amountInvested}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={2.25}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <Stack spacing={3}>                    <DesktopDatePicker
                      disableFuture={true}
                      label="Date Of Investment"
                      value={investmentResponsibleAsLead.dateOfInvestment || null}
                      // minDate={Today.toString()}
                      onChange={(newValue) => {
                        setDateValue("dateOfInvestment", newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
                {/*<TextField
                  required
                  id="dateOfInvestment"
                  label="Date Of Investment"
                  value={investmentResponsibleAsLead.dateOfInvestment}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
/>*/}
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  type="number"
                  id="exitOrWriteOff"
                  label="Exit or writeoff"
                  value={investmentResponsibleAsLead.exitOrWriteOff}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                {/*<TextField
                  required
                  id="dateofExitorWriteOff"
                  value={investmentResponsibleAsLead.dateofExitorWriteOff}
                  label="Date of exit or writeoff"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
/>*/}
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      disableFuture={true}
                      label="Date of exit or writeoff"
                      value={investmentResponsibleAsLead.dateofExitorWriteOff || null}
                      // minDate={Today.toString()}
                      onChange={(newValue) => {
                        setDateValue("dateofExitorWriteOff", newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="comment"
                  label="Comment"
                  value={investmentResponsibleAsLead.comment}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
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
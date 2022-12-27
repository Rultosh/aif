import { Card, CardContent, Typography, Grid, Box, Button, Modal, TextField, Stack } from "@mui/material";
import { useEffect, useState } from "react"
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import { createInvestmentResponsibleAsNonLeadAsync, updateInvestmentResponsibleAsNonLeadAsync } from "./investmentResponsibleAsNonLeadSlice";
import { IInvestmentResponsibleAsNonLead } from "./IInvestmentResponsibleAsNonLead";
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

interface InvestmentResponsibleAsNonLeadModelProps {
  investmentResponsibleAsNonLead: IInvestmentResponsibleAsNonLead,
  open: boolean,
  onClose: (open: boolean) => void,
}

export const InvestmentResponsibleAsNonLeadModel = (props: InvestmentResponsibleAsNonLeadModelProps) => {
  const [open, setOpen] = useState(props.open);
  const [actionId] = useState(uuid());
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.onClose(false);
  }
  const [investmentResponsibleAsNonLead, setInvestmentResponsibleAsNonLead] = useState(props.investmentResponsibleAsNonLead)

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let copiedValue = { ...investmentResponsibleAsNonLead };
    if (ev.target.id !== undefined) {
      copiedValue[ev.target.id as keyof IInvestmentResponsibleAsNonLead] = ev.target.value;
    } else {
      copiedValue[ev.target.name as keyof IInvestmentResponsibleAsNonLead] = ev.target.value;
    }
    setInvestmentResponsibleAsNonLead(copiedValue);
  };

  const setDateValue = (key: String, value: any) => {
    let copiedValue: IInvestmentResponsibleAsNonLead = { ...investmentResponsibleAsNonLead };

    copiedValue[key as keyof IInvestmentResponsibleAsNonLead] = value;

    setInvestmentResponsibleAsNonLead(copiedValue)
  };

  useEffect(() => {
    console.log(investmentResponsibleAsNonLead.teamMemberId);
    if (props.open) handleOpen();
  }, [props.open])

  function handleSubmitForm() {
    console.log(investmentResponsibleAsNonLead.id)
    if (!investmentResponsibleAsNonLead.id) {
      dispatch(
        createInvestmentResponsibleAsNonLeadAsync(
          wrapArgument(
            actionId, investmentResponsibleAsNonLead
          )
        )
      )
    } else {
      dispatch(
        updateInvestmentResponsibleAsNonLeadAsync(
          wrapArgument(
            actionId, investmentResponsibleAsNonLead
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
                  <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Investments responsible for (as Non Lead)</Typography>
                </Box>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="nameOfCompany"
                  label="Name of company"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentResponsibleAsNonLead.nameOfCompany}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  required
                  type='number'
                  id="amountInvested"
                  label="Amount invested"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  value={investmentResponsibleAsNonLead.amountInvested}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              
              <Grid item xs={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      disableFuture={true}
                      label="Date Of Investment"
                      value={investmentResponsibleAsNonLead.dateOfInvestment || null}
                      // minDate={Today.toString()}
                      onChange={(newValue) => {
                        setDateValue("dateOfInvestment", newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  type="number"
                  id="exitOrWriteOff"
                  label="Exit or writeoff"
                  value={investmentResponsibleAsNonLead.exitOrWriteOff}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      disableFuture={true}
                      label="Date of exit or writeoff"
                      value={investmentResponsibleAsNonLead.dateofExitorWriteOff || null}
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
                  value={investmentResponsibleAsNonLead.comment}
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
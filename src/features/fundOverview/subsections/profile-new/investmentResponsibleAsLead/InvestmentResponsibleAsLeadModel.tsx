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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

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
    //setInvestmentResponsibleAsLead(defaultIIInvestmentResponsibleAsLead)
    setInvestmentResponsibleAsLead(props.investmentResponsibleAsLead)
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
    setValue(ev.target.name, ev.target.value);    
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
  
  const validationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name Of Company is required"),
    amountInvested: Yup.string().required("Amount Invested is required"),
    dateOfInvestment: Yup.string().required("Date of Investment is required").nullable(),
    exitOrWriteOff: Yup.string().required("Exit Or Writeoff is required"),
    dateofExitorWriteOff: Yup.string().required("Date of Exit Or Writeoff is required").nullable(),
    comment: Yup.string().required("Comment is required")
  });

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setInvestmentResponsibleAsLead(data);
    // setInvestmentResponsibleAsLead({ ...teamMember, prelimApplicationId: Number(id) })
    handleSubmitForm();
  };

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
                  {...register("nameOfCompany")}
                  error={(errors.nameOfCompany && getValues("nameOfCompany") == '') ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.nameOfCompany && getValues("nameOfCompany") == '') ? errors.nameOfCompany.message : ''}</>
                </Typography>
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
                  {...register("amountInvested")}
                  error={(errors.amountInvested && getValues("amountInvested") == '') ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.amountInvested && getValues("amountInvested") == '') ? errors.amountInvested.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={2.25}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <Stack spacing={3}>
                    <Controller
                      name="dateOfInvestment"
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
                          label="Date Of Investment"
                          value={investmentResponsibleAsLead.dateOfInvestment || null}
                          // minDate={Today.toString()}
                          onChange={(newValue) => {
                            setValue('dateOfInvestment', newValue);
                            setDateValue("dateOfInvestment", newValue);
                          }}
                          renderInput={(params) => <TextField
                            helperText={(invalid && getValues("dateOfInvestment") == null) ? <Typography variant="caption" {...register('dateOfInvestment')} color="error">This value is required</Typography> : null} error={invalid} {...params} />}
                        />
                        )
                      )}
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
                  id="exitOrWriteOff"
                  label="Exit or writeoff"
                  value={investmentResponsibleAsLead.exitOrWriteOff}
                  {...register("exitOrWriteOff")}
                  error={(errors.exitOrWriteOff && getValues("exitOrWriteOff") == '') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.exitOrWriteOff && getValues("exitOrWriteOff") == '') ? errors.exitOrWriteOff.message : ''}</>
                </Typography>
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
                    <Controller
                      name="dateofExitorWriteOff"
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
                          label="Date of exit or writeoff"
                          value={investmentResponsibleAsLead.dateofExitorWriteOff || null}
                          // minDate={Today.toString()}
                          onChange={(newValue) => {
                            setValue('dateofExitorWriteOff', newValue);
                            setDateValue("dateofExitorWriteOff", newValue);
                          }}
                          renderInput={(params) => <TextField
                            helperText={(invalid && getValues("dateofExitorWriteOff") == null) ? <Typography variant="caption" {...register('dateofExitorWriteOff')} color="error">This value is required</Typography> : null} error={invalid} {...params} />}
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
                  id="comment"
                  label="Comment"
                  value={investmentResponsibleAsLead.comment}
                  {...register("comment")}
                  error={(errors.Comment && getValues("comment") == '') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.comment && getValues("comment") == '') ? errors.comment.message : ''}</>
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
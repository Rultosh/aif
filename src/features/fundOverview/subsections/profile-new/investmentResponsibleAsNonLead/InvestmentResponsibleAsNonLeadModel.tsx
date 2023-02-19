import { Card, CardContent, Typography, Grid, Box, Button, Modal, TextField, Stack } from "@mui/material";
import { useEffect, useState } from "react"
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import { createInvestmentResponsibleAsNonLeadAsync, updateInvestmentResponsibleAsNonLeadAsync } from "./investmentResponsibleAsNonLeadSlice";
import { IInvestmentResponsibleAsNonLead, defaultIIInvestmentResponsibleAsNonLead } from "./IInvestmentResponsibleAsNonLead";
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
    setInvestmentResponsibleAsNonLead(props.investmentResponsibleAsNonLead)
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
    setValue(ev.target.name, ev.target.value);    
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
    reset(props.investmentResponsibleAsNonLead);
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
    
  const checkScript = (value: any) => !value.match(/<[^> ]*>/);
  const htmlTagsNotAllowed = "Tags not allowed in input.";
  
  const validationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name Of Company is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    amountInvested: Yup.string().required("Amount Invested is required"),
    dateOfInvestment: Yup.string().required("Date of Investment is required").nullable(),
    exitOrWriteOff: Yup.string().required("Exit Or Writeoff is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    dateofExitorWriteOff: Yup.string().required("Date of Exit Or Writeoff is required").nullable(),
    irrPercent: Yup.string().required("IRR % is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    comment: Yup.string().required("Comment is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable()
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
    setInvestmentResponsibleAsNonLead(data);
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
                  {...register("nameOfCompany")}
                  error={(errors.nameOfCompany) ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.nameOfCompany) ? errors.nameOfCompany.message : ''}</>
                </Typography>
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
              
              <Grid item xs={2}>
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
                          value={investmentResponsibleAsNonLead.dateOfInvestment || null}
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
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="exitOrWriteOff"
                  label="Exit or writeoff"
                  value={investmentResponsibleAsNonLead.exitOrWriteOff}
                  {...register("exitOrWriteOff")}
                  error={(errors.exitOrWriteOff) ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.exitOrWriteOff) ? errors.exitOrWriteOff.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
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
                          value={investmentResponsibleAsNonLead.dateofExitorWriteOff || null}
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
                  id="irrPercent"
                  label="IRR %"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentResponsibleAsNonLead.irrPercent}
                  {...register("irrPercent")}
                  error={(errors.irrPercent) ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.irrPercent) ? errors.irrPercent.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="comment"
                  label="Comment"
                  value={investmentResponsibleAsNonLead.comment}
                  {...register("comment")}
                  error={(errors.comment) ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.comment) ? errors.comment.message : ''}</>
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
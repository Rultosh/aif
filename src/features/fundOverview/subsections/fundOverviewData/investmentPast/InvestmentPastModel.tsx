import { Box, Button, Card, CardContent, Grid, Modal, Stack, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { createInvestmentPastAsync, updateInvestmentPastAsync } from './investmentPastSlice'
import { useAppDispatch } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentPast, IInvestmentPast } from "./IInvestmentPast";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface InvestmentPastModelProps {
  investmentPastFormData: IInvestmentPast,
  prelimApplicationId: Number | undefined,
  open: boolean,
  handleClose: () => void;
}

export const InvestmentPastModel = (props: InvestmentPastModelProps) => {

  const [actionUid] = useState(uuid())
  const [investmentPastFormData, setinvestmentPastFormData] = useState(defaultInvestmentPast)

  const dispatch = useAppDispatch();


  const setDateValue = (key: String, value: any) => {
    let copiedValue: IInvestmentPast = { ...investmentPastFormData };

    copiedValue[key as keyof IInvestmentPast] = value;

    setinvestmentPastFormData(copiedValue)
  };

  function handleSubmitForm() {
    console.log("Saving Past investment ", investmentPastFormData)
    if (investmentPastFormData.id) {
      dispatch(
        updateInvestmentPastAsync(
          wrapArgument(actionUid, investmentPastFormData)
        )
      )
    } else {
      console.log(investmentPastFormData)
      dispatch(
        createInvestmentPastAsync(
          wrapArgument(actionUid, investmentPastFormData)
        )
      )
      setinvestmentPastFormData({ ...props.investmentPastFormData, prelimApplicationId: props.prelimApplicationId })
    }
    props.handleClose();
  }

  useEffect(() => {
    setinvestmentPastFormData({ ...props.investmentPastFormData, prelimApplicationId: props.prelimApplicationId })
    console.log({ ...props.investmentPastFormData, prelimApplicationId: props.prelimApplicationId })
  }, [])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    console.log('handle change', ev.target.id, ev.target.value);

    let copiedValue: IInvestmentPast = { ...investmentPastFormData };

    copiedValue[ev.target.id as keyof IInvestmentPast] =
      ev.target.id !== undefined ? ev.target.value : ev.target.value

    console.log(copiedValue, props.prelimApplicationId)

    setinvestmentPastFormData(copiedValue)
  };

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

  const validationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name of Company is required"),
    sector: Yup.string().required("Sector is required"),
    amountInvested: Yup.string().required("Amount Invested is required"),
    dateOfInvestment: Yup.string().required("Date of Investment is required"),
  });

  const {
    control,
    getValues,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setinvestmentPastFormData(data);
    handleSubmitForm();
  };

  return <Modal
    open={props.open}
    onClose={props.handleClose}
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
                  <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Details of Investment Team</Typography>
                </Box>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="nameOfCompany"
                  label="Name Of Company"
                  {...register("nameOfCompany")}
                  error={errors.nameOfCompany ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPastFormData.nameOfCompany}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{errors.nameOfCompany?.message}</>
                </Typography>
              </Grid>
              <Grid item xs={3.5}>
                <TextField
                  required
                  id="sector"
                  label="Sector"
                  {...register("sector")}
                  error={errors.sector ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPastFormData.sector}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{errors.sector?.message}</>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  type="number"
                  id="amountInvested"
                  label="Amount Invested"
                  {...register("amountInvested")}
                  error={errors.amountInvested ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPastFormData.amountInvested}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{errors.amountInvested?.message}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
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
                          value={investmentPastFormData.dateOfInvestment || null}
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

              <Grid item xs={12} >
                <Button type="submit" onClick={handleSubmit(onSubmit)} color='success' variant="contained" disableElevation sx={{ textTransform: 'none' }} >
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
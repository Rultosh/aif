import { Box, Button, Card, CardContent, CardHeader, Chip, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Modal, Paper, Select, Stack, styled, Switch, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveFormData, submitResults, fetchTableData, fetchInvestmentTeamsPartnerLevelAsync, selectInvestmentPartners, createInvestmentTeamsPartnerLevelAsync, deleteInvestmentTeamPartnerLevelAsync, updateInvestmentTeamsPartnerLevelAsync } from './investmentPartnerSlice'
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'
import React, * as Rect from 'react'
import { createInvestmentTeamsPartnerLevel, fetchInvestmentTeamsPartnerLevel } from "./investmentPartnerApi";
import { ActionWrapper, wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentPartner, IInvestmentPartner } from "./IInvestmentPartner";
import { FetchStatus } from "../../../../../lib/api-status/IStatus";
import { Delete, Edit, SettingsPowerRounded } from '@mui/icons-material';
import { InvestmentPartnerRow } from "./InvestmentPartnerRow";
import { selectPrelimApplication } from "../prelimApplicationDataSlice";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface InvestmentPartnerModelProps {
  investmentPartnerFormData: IInvestmentPartner,
  prelimApplicationId: Number | undefined,
  open: boolean,
  handleClose: () => void;
}

export const InvestmentPartnerModel = (props: InvestmentPartnerModelProps) => {

  const [actionUid] = useState(uuid())
  const [investmentPartnerFormData, setInvestmentPartnerFormData] = useState(defaultInvestmentPartner)

  const dispatch = useAppDispatch();

  function handleSubmitForm() {
    console.log("Saving investpment partner", investmentPartnerFormData)
    if (investmentPartnerFormData.id) {
      dispatch(
        updateInvestmentTeamsPartnerLevelAsync(
          wrapArgument(actionUid, investmentPartnerFormData)
        )
      )
    } else {
      console.log(investmentPartnerFormData)
      dispatch(
        createInvestmentTeamsPartnerLevelAsync(
          wrapArgument(actionUid, investmentPartnerFormData)
        )
      )
      setInvestmentPartnerFormData({ ...props.investmentPartnerFormData, prelimApplicationId: props.prelimApplicationId })
    }
    props.handleClose();
  }

  useEffect(() => {
    setInvestmentPartnerFormData({ ...props.investmentPartnerFormData, prelimApplicationId: props.prelimApplicationId })
    console.log({ ...props.investmentPartnerFormData, prelimApplicationId: props.prelimApplicationId })
  }, [])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    console.log('handle change', ev.target.id, ev.target.value);

    let copiedValue: IInvestmentPartner = { ...investmentPartnerFormData };

    if (ev.target.id !== undefined) {
      copiedValue[ev.target.id as keyof IInvestmentPartner] =
        ev.target.id !== undefined ? ev.target.value : ev.target.value
    } else {
      copiedValue[ev.target.name as keyof IInvestmentPartner] = ev.target.value;
    }
    console.log(copiedValue, props.prelimApplicationId)
    setValue(ev.target.name, ev.target.value);
    setInvestmentPartnerFormData(copiedValue)
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
    name: Yup.string().required("Name is required"),
    designation: Yup.string().required("Designation is required"),
    age: Yup.string().required("Age is required"),
    qualification: Yup.string().required("Qualification is required"),
    description: Yup.string().required("Brief details of VC/PE Experience is required"),
    vcpeExperience: Yup.string().required("VC/PE Experience is required")
  });

  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setInvestmentPartnerFormData(data);
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
                  id="name"
                  label="Name"
                  {...register("name")}
                  error={(errors.name && getValues("name") == '') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPartnerFormData.name}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.name && getValues("name") == '')?errors.name.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={3.5}>
                <TextField
                  required
                  id="designation"
                  label="Designation"
                  {...register("designation")}
                  error={(errors.designation && getValues("designation") == '')? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPartnerFormData.designation}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.designation && getValues("designation") == '')?errors.designation.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <TextField
                  required
                  type="number"
                  id="age"
                  label="Age"
                  {...register("age")}
                  error={(errors.age && getValues("age") == '') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPartnerFormData.age}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.age && getValues("age") == '')?errors.age.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="qualification"
                  label="Qualification"
                  {...register("qualification")}
                  error={(errors.qualification && getValues("qualification") =='') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPartnerFormData.qualification}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.qualification && getValues("qualification") == '')?errors.qualification.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{  display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">VC/PE Experience in investing</InputLabel>
                  <Select
                  required
                    labelId="vcpeExperience"
                    id="vcpeExperience"
                    {...register("vcpeExperience")}
                    error={(errors.vcpeExperience && getValues("vcpeExperience") =='') ? true : false}
                    value={String(investmentPartnerFormData.vcpeExperience)}
                    onChange={handleChange}
                    name="vcpeExperience"
                    // defaultValue={investmentPartnerFormData["vcpeExperience"] === undefined ? " " : investmentPartnerFormData["vcpeExperience"]}
                  >

                    <MenuItem key={"0-5 years"} value={"0-5 years"}>0-5 years</MenuItem>
                    <MenuItem key={"5-10 years"} value={"5-10 years"}>5-10 years</MenuItem>
                    <MenuItem key={"10-15 years"} value={"10-15 years"}>10-15 years</MenuItem>
                    <MenuItem key={"15+ years"} value={"15+ years"}>15+ years</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="error">
                  <>{(errors.vcpeExperience && getValues("vcpeExperience") == '')?errors.vcpeExperience.message : ''}</>
                </Typography>

                {/*<TextField
                  required
                  id="vcpeExperience"
                  label="VC/PE Experience in investing"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPartnerFormData.vcpeExperience}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
/> */}

              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="description"
                  label="Brief details of VC/PE Experience"
                  {...register("description")}
                  error={(errors.description && getValues("description") == '') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentPartnerFormData.description}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.description && getValues("description") == '')?errors.description.message : ''}</>
                </Typography>
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
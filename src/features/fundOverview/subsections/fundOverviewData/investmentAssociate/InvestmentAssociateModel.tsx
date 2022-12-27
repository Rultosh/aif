import { Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { createInvestmentTeamsAssociateLevelAsync, updateInvestmentTeamsAssociateLevelAsync } from './investmentAssociateSlice'
import { useAppDispatch } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultInvestmentAssociate, IInvestmentAssociate } from "./IInvestmentAssociate";

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

  function handleSubmitForm() {
    console.log("Saving investpment Associate", investmentAssociateFormData)
    if (investmentAssociateFormData.id) {
      dispatch(
        updateInvestmentTeamsAssociateLevelAsync(
          wrapArgument(actionUid, investmentAssociateFormData)
        )
      )
    } else {
      console.log(investmentAssociateFormData)
      dispatch(
        createInvestmentTeamsAssociateLevelAsync(
          wrapArgument(actionUid, investmentAssociateFormData)
        )
      )
      setInvestmentAssociateFormData({ ...props.investmentAssociateFormData, prelimApplicationId: props.prelimApplicationId })
    }
    props.handleClose();
  }

  useEffect(() => {
    setInvestmentAssociateFormData({ ...props.investmentAssociateFormData, prelimApplicationId: props.prelimApplicationId })
    console.log({ ...props.investmentAssociateFormData, prelimApplicationId: props.prelimApplicationId })
  }, [])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    console.log('handle change', ev.target.id, ev.target.value);

    let copiedValue: IInvestmentAssociate = { ...investmentAssociateFormData };

    if (ev.target.id !== undefined) {
      copiedValue[ev.target.id as keyof IInvestmentAssociate] =
        ev.target.id !== undefined ? ev.target.value : ev.target.value
    } else {
      copiedValue[ev.target.name as keyof IInvestmentAssociate] = ev.target.value;
    }


    console.log(copiedValue, props.prelimApplicationId)

    setInvestmentAssociateFormData(copiedValue)
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
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentAssociateFormData.name}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={3.5}>
                <TextField
                  required
                  id="designation"
                  label="Designation"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentAssociateFormData.designation}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  required
                  type="number"
                  id="age"
                  label="Age"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentAssociateFormData.age}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="qualification"
                  label="Qalification"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentAssociateFormData.qualification}
                  variant="standard"
                  onChange={handleChange}
                  name="qualification"

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">Investment Experience</InputLabel>
                  <Select
                    labelId="investmentExperience"
                    id="investmentExperience"
                    value={String(investmentAssociateFormData.investmentExperience)}
                    onChange={handleChange}
                    name="investmentExperience"
                  >

                    <MenuItem key={"0-5 years"} value={"0-5 years"}>0-5 years</MenuItem>
                    <MenuItem key={"5-10 years"} value={"5-10 years"}>5-10 years</MenuItem>
                    <MenuItem key={"10-15 years"} value={"10-15 years"}>10-15 years</MenuItem>
                    <MenuItem key={"15+ years"} value={"15+ years"}>15+ years</MenuItem>
                  </Select>
                </FormControl>
                {/*<TextField
                  required
                  type="number"
                  id="investmentExperience"
                  label="Investment Experience"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentAssociateFormData.investmentExperience}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
/>*/}
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="description"
                  label="Brief details of VC/PE Experience"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={investmentAssociateFormData.description}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
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
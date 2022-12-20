import { Box, Button, Card, CardContent,  FormControlLabel, Grid, Modal, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { createContributorDetailsAsync, updateContributorDetailsAsync } from './contributorDetailsSlice'
import { useAppDispatch } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultContributorDetails, IContributorDetails } from "./IContributorDetails";

interface ContrinutorDetailsModelProps {
  contributorDetailsFormData: IContributorDetails,
  prelimApplicationId: Number | undefined,
  open: boolean,
  handleClose: () => void;
}

export const ContributorDetailsModel = (props: ContrinutorDetailsModelProps) => {

  const [actionUid] = useState(uuid())
  const [contributorDetailsFormData, setContributorDetailsFormData] = useState(defaultContributorDetails)

  const dispatch = useAppDispatch();

  function handleSubmitForm() {
    console.log("Saving contributorDetailsFormData", contributorDetailsFormData)
    if (contributorDetailsFormData.id) {
      dispatch(
        updateContributorDetailsAsync(
          wrapArgument(actionUid, contributorDetailsFormData)
        )
      )
    } else {
      console.log(contributorDetailsFormData)
      dispatch(
        createContributorDetailsAsync(
          wrapArgument(actionUid, contributorDetailsFormData)
        )
      )
      setContributorDetailsFormData({ ...props.contributorDetailsFormData, prelimApplicationId: props.prelimApplicationId })
    }
    props.handleClose();
  }

  useEffect(() => {
    setContributorDetailsFormData({ ...props.contributorDetailsFormData, prelimApplicationId: props.prelimApplicationId })
    console.log({ ...props.contributorDetailsFormData, prelimApplicationId: props.prelimApplicationId })
  }, [])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    console.log('handle change', ev.target.id, ev.target.value);

    let copiedValue: IContributorDetails = { ...contributorDetailsFormData };

    copiedValue[ev.target.id as keyof IContributorDetails] =
      ev.target.id !== undefined ? ev.target.value : ev.target.value

    console.log(copiedValue, props.prelimApplicationId)

    setContributorDetailsFormData(copiedValue)
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
                  <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Details of Contributor to the Fund</Typography>
                </Box>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="name"
                  label="Name"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={contributorDetailsFormData.name}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={3.5}>
                <TextField
                  required
                  type='number'
                  id="amount"
                  label="Amount"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={contributorDetailsFormData.amount}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  type="number"
                  required
                  id="age"
                  label="Age"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={contributorDetailsFormData.percentOfCorpus}
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
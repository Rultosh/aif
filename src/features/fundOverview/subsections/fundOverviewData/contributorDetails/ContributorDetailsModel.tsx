import { Box, Button, Card, CardContent,  FormControl,  FormControlLabel, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { createContributorDetailsAsync, updateContributorDetailsAsync } from './contributorDetailsSlice'
import { useAppDispatch } from '../../../../../app/hooks'
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import uuid from "react-uuid";
import { defaultContributorDetails, IContributorDetails } from "./IContributorDetails";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";


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
    handleCloseModal();
  }

  const handleCloseModal = () => {
    reset();
    props.handleClose();
  }

  useEffect(() => {
    setContributorDetailsFormData({ ...props.contributorDetailsFormData, prelimApplicationId: props.prelimApplicationId })

    reset(props.contributorDetailsFormData);

    console.log({ ...props.contributorDetailsFormData, prelimApplicationId: props.prelimApplicationId })
  }, [])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    console.log('handle change', ev, ev.target.id, ev.target.value);

    let copiedValue: IContributorDetails = { ...contributorDetailsFormData };

    copiedValue[(ev.target.id ? ev.target.id : ev.target.name) as keyof IContributorDetails] =
      ev.target.id !== undefined ? ev.target.value : ev.target.value

    console.log(copiedValue, props.prelimApplicationId)
    setValue(ev.target.name, ev.target.value);

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
    
  const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
  const htmlTagsNotAllowed = "Tags not allowed in input.";
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    amount: Yup.string().required("Amount is required"),
    percentOfCorpus: Yup.string().required("Percent Of Corpus is required"),
    contributionType: Yup.string().required("Contribution Type is required"),
  });

  const {
    setValue,
    getValues,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setContributorDetailsFormData(data);
    // setContributorDetailsFormData({ id: 0, prelimApplicationId: props.prelimApplicationId, name: data.name, amount: data.amount, percentOfCorpus: data.age });
    // setContributorDetailsFormData({ ...props.contributorDetailsFormData, amount: data.amount});
    // // setContributorDetailsFormData({ ...props.contributorDetailsFormData, age: data.age});
    //   setContributorDetailsFormData({ ...props.contributorDetailsFormData, percentOfCorpus: data.age});
    // setContributorDetailsFormData({ ...props.contributorDetailsFormData, prelimApplicationId: props.prelimApplicationId });
    handleSubmitForm();
    // setPrelimApplicationFormData(data);
    // savePrelimApplicationForm(data);
  };

  return <Modal
    open={props.open}
    onClose={handleCloseModal}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
        <Card sx={{ display: 'flex', }}>

          <CardContent sx={{ flex: 1 }}>
            <Grid container spacing={2} >
              <Grid item xs={12}>
                <Box sx={{ display: 'inline-flex' }}>
                  <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Details of Contributor to the Fund</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  id="name"
                  label="Name"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={contributorDetailsFormData.name}
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
              <Grid item xs={4}>
                <TextField
                  required
                  type='number'
                  id="amount"
                  label="Amount (₹ Crore)"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={contributorDetailsFormData.amount}
                  {...register("amount")}
                  error={(errors.amount && getValues("amount") == '') ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.amount && getValues("amount") == '')?errors.amount.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  required
                  id="percentOfCorpus"
                  label="% of Corpus"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  value={contributorDetailsFormData.percentOfCorpus}
                  {...register("percentOfCorpus")}
                  error={(errors.percentOfCorpus && getValues("percentOfCorpus") == '') ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                    <>{(errors.percentOfCorpus && getValues("percentOfCorpus") == '')?errors.percentOfCorpus.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <FormControl variant="standard" sx={{ display: 'flex' }}>
                  <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
                  <Select
                    key="contributionType"
                    labelId="contributionType"
                    id="contributionType"
                    value={contributorDetailsFormData["contributionType"] || ""}
                    {...register("contributionType")}
                    error={(errors.contributionType && getValues("contributionType") =='') ? true : false}
                    onChange={handleChange}
                    name="contributionType"
                    defaultValue={contributorDetailsFormData["contributionType"] === undefined ? " " : contributorDetailsFormData["contributionType"]}
                  >

                    <MenuItem key={"Foreign"} value={"Foreign"}>Foreign</MenuItem>
                    <MenuItem key={"Domestic"} value={"Domestic"}>Domestic</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="error">
                  <>{(errors.contributionType && getValues("contributionType") == '')?errors.contributionType.message : ''}</>
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
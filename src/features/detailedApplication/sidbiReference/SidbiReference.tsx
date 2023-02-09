import { Box, Button, Card, CardContent, Divider, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { Controller } from "../../../lib/api-wrappers/Controller";
import { detailedApplicationThunk, selectedDetailedApplications } from "./detailedApplicationSlice";
import { defaultIDetailedApplication } from "./IDetailedApplication";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { updateStepperIndex}from '../../DetailedApplicationComponent/subsections/sideNavBarSlice'

export const SidbiReference = (props:any) => {
  const { id } = useParams()
  const [formData, setFormData] = useState(defaultIDetailedApplication);
  const [actionId] = useState(uuid())
  const controller = new Controller(actionId, detailedApplicationThunk);
  const state = useAppSelector(selectedDetailedApplications);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(props.checkUnAuth){
        navigate('/login')
    }
})

  useEffect(() => {
    dispatch(updateStepperIndex(0))
    if (id && Number(id)) {
      if (!state[0]?.data[id]) {
        controller.fetch({ ...formData, id: Number(id) });
      }
    }
  }, [])

  useEffect(() => {
    dispatch(updateStepperIndex(0))
    let newData = state[0]?.data[Number(id)];
    if (newData) setFormData(newData)
  }, [state[0]?.data])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let copiedValue = { ...formData }
    let key = ev.target.id ? ev.target.id : ev.target.name;
    copiedValue[key as keyof typeof formData] = ev.target.value;
    setFormData(copiedValue);
  };

  const handleSave = () => {
    controller.save(formData);
  }

  const handleNext = () => {
    if (!Number(id) && state[0]) navigate(`/detailed/${state[0].createdId}/detailed2A`)
    else navigate(`/detailed/${id}/detailed2A`)
  }

  const handleClick = (ev: any, navTo: string) => {
    if (!Number(id) && state[0]) navigate(`/detailed/${state[0].createdId}/detailed2A`)
    else navigate(`/detailed/${id}/detailed2A`)
  }

  return <>
    {controller.isActionError(0, state) ?
      <div style={{ margin: "10px", color: "red" }}>{controller.error(0, state)}</div> : <></>}
    <Grid item xs={12}>


      <Card sx={{ display: 'flex', mb: 2, mt: 2 }}>
        <CardContent sx={{ flex: 1 }}>

          <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Preliminary Application</Typography>

          <Divider sx={{ mt: 2 }} />
          <Grid container sx={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Grid item xs={4}>
              <Card sx={{ display: 'flex', mt: 7, mb: 7, background: '#f2f2f2', height: '100px' }}>
                <CardContent sx={{ flex: 1 }}>
                  {/* <TextField
                    required
                    id="sidbiReferenceNumber"
                    label="Reference No."
                    {...register("sidbiReferenceNumber")}
                    error={errors.sidbiReferenceNumber ? true : false}
                    // value={formData.sidbiReferenceNumber || ''}
                    variant="standard"
                    // onChange={handleChange}
                    sx={{ display: 'flex', ml: 2, mb: -3 }}
                  />
                  <Typography variant="caption" color="error" sx={{ ml: '20px' }}>
                      <>{errors.sidbiReferenceNumber?.message}</>
                  </Typography> */}
                  <div>Reference Number:</div>
                  <div style={{fontWeight: "bold", marginTop: "20px"}}>{formData.sidbiReferenceNumber || ''}</div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />
          <Grid container xs={12}>
            <Grid item xs={4}>
              <Button
                onClick={(e) => handleClick(e, "previous")}
                startIcon={<ArrowLeftIcon />}
                variant="contained"
                disableElevation
                disabled
                sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                Back
              </Button>
            </Grid>
            <Grid item xs={4} >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 1 of 5</Typography>
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ justifyContent: 'right' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                {(Number(id) || (!Number(id) && state[0]))?<Button
                  onClick={(e) => handleNext()}
                  endIcon={<ArrowRightIcon />}
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2, mr: 2 }} >
                  Next
                </Button>:<></>}
                {/* <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  // onClick={(e) => handleSave()}
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2, mr: 2 }} >
                  Save
                </Button> */}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  </>
}



import { Card, CardContent, Typography, Grid, Box, Button, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react"
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import { createCompanyContactDetailsAsync, updateCompanyContactDetailsAsync } from "./companyContactDetailsSlice";
import { ICompanyContactDetails } from "./ICompanyContactDetails";
import uuid from "react-uuid";
import { useAppDispatch } from "../../../../../app/hooks";
import { useParams } from "react-router-dom";

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

interface CompanyContactDetailsModelProps {
  companyContactDetails: ICompanyContactDetails,
  open: boolean,
  onClose: (open: boolean) => void,
}

export const CompanyContactDetailsModel = (props: CompanyContactDetailsModelProps) => {
  const [open, setOpen] = useState(props.open);
  const [actionId] = useState(uuid());
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.onClose(false);
  }
  const [investmentResponsibleAsLead, setCompanyContactDetails] = useState(props.companyContactDetails)

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let copiedValue = { ...investmentResponsibleAsLead };
    if (ev.target.id !== undefined) {
      copiedValue[ev.target.id as keyof ICompanyContactDetails] = ev.target.value;
    } else {
      copiedValue[ev.target.name as keyof ICompanyContactDetails] = ev.target.value;
    }
    
    setCompanyContactDetails(copiedValue);
  };

  useEffect(() => {
    console.log(investmentResponsibleAsLead.teamMemberId);
    if(props.open) handleOpen();
  }, [props.open]) 

  function handleSubmitForm() {
    console.log(investmentResponsibleAsLead.id)
    if(!investmentResponsibleAsLead.id) {
      dispatch(
        createCompanyContactDetailsAsync(
          wrapArgument(
            actionId, investmentResponsibleAsLead
          )
        )
      )
    } else {
      dispatch(
        updateCompanyContactDetailsAsync(
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
                  <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Contact details of above Investee Companies</Typography>
                </Box>
              </Grid>
              <Grid item xs={3.5}>
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
              <Grid item xs={2.5}>
                <TextField
                  required
                  id="nameOfPromoter"
                  label="Name of promoter/CEO"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  value={investmentResponsibleAsLead.nameOfPromoter}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  id="address"
                  label="Address"
                  value={investmentResponsibleAsLead.address}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="telephoneNo"
                  label="Telephone No."
                  value={investmentResponsibleAsLead.telephoneNo}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="mobileNo"
                  value={investmentResponsibleAsLead.mobileNo}
                  label="Mobile No"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="email"
                  label="Email"
                  value={investmentResponsibleAsLead.email}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="alternateEmail"
                  label="Alternate Email"
                  value={investmentResponsibleAsLead.alternateEmail}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  type="number"
                  id="yearOfInvestment"
                  label="Year of investment"
                  value={investmentResponsibleAsLead.yearOfInvestment}
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
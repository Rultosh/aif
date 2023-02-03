import { Card, CardContent, Typography, Grid, Box, Button, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react"
import { wrapArgument } from "../../../../../lib/api-status/actionWrapper";
import { createCompanyContactDetailsAsync, updateCompanyContactDetailsAsync } from "./companyContactDetailsSlice";
import { ICompanyContactDetails, defaultIICompanyContactDetails } from "./ICompanyContactDetails";
import uuid from "react-uuid";
import { useAppDispatch } from "../../../../../app/hooks";
import { useParams } from "react-router-dom";
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
    setCompanyContactDetails(props.companyContactDetails)
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
    setValue(ev.target.id, ev.target.value);
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

  const validationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name Of Company is required"),
    nameOfPromoter: Yup.string().required("Name Of Promoter is required"),
    address: Yup.string().required("Address is required"),
    telephoneNo: Yup.string().required("Telephone No is required").test("test-name", "Enter a valid Telephone No", function (value: any) {
      const PhoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change This Regex Based On Requirement
      const IsValidPhone = PhoneRegex.test(value);
      if (!IsValidPhone) {
        return false;
      }
      return true;
    }),
    mobileNo: Yup.string().required("Mobile No is required").test("test-name", "Enter a valid Mobile No", function (value: any) {
      const PhoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change This Regex Based On Requirement
      const IsValidPhone = PhoneRegex.test(value);
      if (!IsValidPhone) {
        return false;
      }
      return true;
    }),
    email: Yup.string().required("Email is required").test("test-name", "Enter a valid Email", function (value: any) {
      const EmailRegex =
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

      const IsValidEmail = EmailRegex.test(value);
      if (!IsValidEmail) {
        return false;
      }
      return true;
    }),
    alternateEmail: Yup.string().required("Alternate Email is required").test("test-name", "Enter a valid Email", function (value: any) {
      const EmailRegex =
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

      const IsValidEmail = EmailRegex.test(value);
      if (!IsValidEmail) {
        return false;
      }
      return true;
    }),
    yearOfInvestment: Yup.string().required("Year Of Investment is required")
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
    setCompanyContactDetails(data);
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
              <Grid item xs={2.5}>
                <TextField
                  required
                  id="nameOfPromoter"
                  label="Name of promoter/CEO"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  value={investmentResponsibleAsLead.nameOfPromoter}
                  {...register("nameOfPromoter")}
                  error={(errors.nameOfPromoter && getValues("nameOfPromoter") == '') ? true : false}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.nameOfPromoter && getValues("nameOfPromoter") == '') ? errors.nameOfPromoter.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  id="address"
                  label="Address"
                  value={investmentResponsibleAsLead.address}
                  {...register("address")}
                  error={(errors.address && getValues("address") == '') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.address && getValues("address") == '') ? errors.address.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  type="tel"
                  required
                  id="telephoneNo"
                  label="Telephone No."
                  value={investmentResponsibleAsLead.telephoneNo}
                  {...register("telephoneNo")}
                  error={(errors.telephoneNo) ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                  inputProps={{ maxLength: 10 }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.telephoneNo) ? errors.telephoneNo.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  type="tel"
                  required
                  id="mobileNo"
                  value={investmentResponsibleAsLead.mobileNo}
                  {...register("mobileNo")}
                  error={(errors.mobileNo) ? true : false}
                  label="Mobile No"
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                  inputProps={{ maxLength: 10 }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.mobileNo) ? errors.mobileNo.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="email"
                  label="Email"
                  value={investmentResponsibleAsLead.email}
                  {...register("email")}
                  error={(errors.email) ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                  <>{(errors.email) ? errors.email.message : ''}</>
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  id="alternateEmail"
                  label="Alternate Email"
                  value={investmentResponsibleAsLead.alternateEmail}
                  {...register("alternateEmail")}
                  error={(errors.alternateEmail && getValues("alternateEmail") == '') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                 <>{(errors.alternateEmail && getValues("alternateEmail") == '') ? errors.alternateEmail.message : ''}</>
               </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <TextField
                  required
                  type="number"
                  id="yearOfInvestment"
                  label="Year of investment"
                  value={investmentResponsibleAsLead.yearOfInvestment}
                  {...register("yearOfInvestment")}
                  error={(errors.yearOfInvestment && getValues("yearOfInvestment") == '') ? true : false}
                  //defaultValue={formValue["NameOfTheFund"] === undefined ? " " : formValue["NameOfTheFund"]}
                  //value={formValue["NameOfTheFund"]}
                  variant="standard"
                  onChange={handleChange}

                  sx={{ display: 'flex' }}
                />
                <Typography variant="caption" color="error">
                <>{(errors.yearOfInvestment && getValues("yearOfInvestment") == '') ? errors.yearOfInvestment.message : ''}</>
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
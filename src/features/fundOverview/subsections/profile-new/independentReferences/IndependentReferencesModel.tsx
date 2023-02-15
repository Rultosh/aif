import { useAppSelector } from '../../../../../app/hooks';
import { useEffect, useState } from "react"
import { defaultIIIndependentReferences, IIndependentReferences } from "./IIndependentReferences";
import { Controller } from "../../../../../lib/api-wrappers/Controller";
import { selectIndependentReferences } from "./independentReferencesSlice";
import { Card, CardContent, Typography, Grid, Box, Button, Modal, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
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

interface IndependentReferencesModelProps {
  independentReference: IIndependentReferences,
  sharedController: Controller<IIndependentReferences>,
  open: boolean,
  add: boolean,
  onClose: (open: boolean) => void,
}

export const IndependentReferencesModel = (props: IndependentReferencesModelProps) => {
  const state = useAppSelector(selectIndependentReferences);
  const [open, setOpen] = useState(props.open);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setIndependentReference(props.independentReference)
    setOpen(false);
    props.onClose(false);
  }
  const [independentReference, setIndependentReference]
    = useState(props.independentReference)
  // const [telephoneTextfield, setTelephoneTextfield] = useState('')

  const handleChange = (ev: any) => {
    let copiedValue = { ...independentReference };
    copiedValue[ev.target.id as keyof IIndependentReferences]
      = ev.target.id ? ev.target.value : ev.target.value;
      setValue(ev.target.id, ev.target.value);
    setIndependentReference(copiedValue);
  };

  useEffect(() => {
    let updatedState = props.sharedController.data(state, props.independentReference);
    if (updatedState) {
      setIndependentReference(
        updatedState
      )
    }
  }, [props.sharedController.data(state, props.independentReference)])

  useEffect(() => {
    if (props.open) {
      handleOpen();
      if (props.add) {
        setIndependentReference(
          {
            ...defaultIIIndependentReferences,
            parentId: props.independentReference.parentId
          })
      }
    }
  }, [props.open])

  function handleSubmitForm() {
    props.sharedController.save(independentReference);
  }

  useEffect(() => {
    reset(props.independentReference);
    if (props.sharedController.isActionCompleted(props.independentReference.parentId, state)) {
      handleClose()
    }
  }, [props.sharedController.isActionCompleted(props.independentReference.parentId, state)])
    
  const checkScript = (value: any) => !value.match(/<[^>]*>/);
  const htmlTagsNotAllowed = "Tags not allowed in input.";
  
  const validationSchema = Yup.object().shape({
    nameOfCompany: Yup.string().required("Name Of Company is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    designation: Yup.string().required("Designation is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    organisation: Yup.string().required("Organisation is required").test("check-script", htmlTagsNotAllowed, checkScript).nullable(),
    telephoneNo: Yup.string().required("Telephone No is required").test("test-name", "Enter a valid Telephone No", function (value: any) {
      const PhoneRegex = /^(\+91-|\+91|0)?\d{15}$/; // Change This Regex Based On Requirement
      const IsValidPhone = PhoneRegex.test(value);
      if (!IsValidPhone) {
        return false;
      }
      return true;
    }).nullable(),
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
    })
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
    // setIndependentReference({...independentReference, telephoneNo: telephoneTextfield});
    // setIndependentReference(data);
    // setInvestmentResponsibleAsLead({ ...teamMember, prelimApplicationId: Number(id) })
    handleSubmitForm();
  };

  return <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <div>
      <Box sx={style}>
        <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
          <Card sx={{ display: 'flex', }}>
            <CardContent sx={{ flex: 1 }}>
              <Grid container spacing={2} >
                <Grid item xs={9}>
                  <Box sx={{ display: 'inline-flex' }}>
                    <Typography variant="subtitle1" sx={{ flex: 1, ml: '10px', textAlign: "left", fontWeight: 'bold' }}>Two Independent references in r/o Team Member with regard to thier investment experience(other than investee companies) </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4.5}>
                  <TextField
                    required
                    id="nameOfCompany"
                    label="Name of company"
                    value={independentReference.nameOfCompany}
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
                <Grid item xs={3.5}>
                  <TextField
                    required
                    id="designation"
                    label="Designation"
                    value={independentReference.designation}
                    {...register("designation")}
                    error={(errors.designation) ? true : false}
                    variant="standard"
                    onChange={handleChange}

                    sx={{ display: 'flex' }}
                  />
                  <Typography variant="caption" color="error">
                    <>{(errors.designation) ? errors.designation.message : ''}</>
                  </Typography>
                </Grid>
                <Grid item xs={3.5}>
                  <TextField
                    required
                    id="organisation"
                    label="Organisation"
                    value={independentReference.organisation}
                    {...register("organisation")}
                    error={(errors.organisation) ? true : false}
                    variant="standard"
                    onChange={handleChange}

                    sx={{ display: 'flex' }}
                  />
                  <Typography variant="caption" color="error">
                    <>{(errors.organisation) ? errors.organisation.message : ''}</>
                  </Typography>
                </Grid>
                <Grid item xs={4.5}>
                  <TextField
                    required
                    id="telephoneNo"
                    label="Telephone No."
                    {...register("telephoneNo")}
                    error={(errors.telephoneNo) ? true : false}
                    variant="standard"
                    value={independentReference.telephoneNo}
                    onChange={handleChange}
                    // onChange={(ev) => {
                      // setValue(ev.target.id, ev.target.value);
                      // setTelephoneTextfield(ev.target.value);
                      // handleChange(e);
                      // validMobileNo('errors.'+ e.target.id, e.target.value);
                    // }}

                    sx={{ display: 'flex' }}
                    inputProps={{ maxLength: 15 }}
                  />
                  <Typography variant="caption" color="error">
                    <>{(errors.telephoneNo) ? errors.telephoneNo.message : ''}</>
                  </Typography>
                </Grid>
                <Grid item xs={4.5}>
                  <TextField
                    required
                    id="mobileNo"
                    value={independentReference.mobileNo}
                    {...register("mobileNo")}
                    error={(errors.mobileNo) ? true : false}
                    label="Mobile No"
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
                    value={independentReference.email}
                    {...register("email")}
                    error={(errors.email) ? true : false}
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
                    value={independentReference.alternateEmail}
                    {...register("alternateEmail")}
                    error={(errors.alternateEmail) ? true : false}
                    variant="standard"
                    onChange={handleChange}

                    sx={{ display: 'flex' }}
                  />
                  <Typography variant="caption" color="error">
                    <>{(errors.alternateEmail) ? errors.alternateEmail.message : ''}</>
                  </Typography>
                </Grid>
                <Grid item xs={12} >
                  <div style={{ color: "red", margin: "10px" }}>{props.sharedController.error(props.independentReference.parentId, state)}</div>
                  <Button 
                    onClick={handleSubmit(onSubmit)}
                    color='success' 
                    variant="contained" disableElevation sx={{ textTransform: 'none' }} >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>
  </Modal>
}
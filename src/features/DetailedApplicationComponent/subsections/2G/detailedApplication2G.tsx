import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, InputLabel } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import uuid from "react-uuid";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { Controller } from "../../../../lib/api-wrappers/Controller";
import { defaultIDetailedApplication2G, IDetailedApplication2G } from "./IDetailedApplication2G";
import { detailedApplication2GThunk, selectDetailedApplication2G } from "./detailedApplication2GSlice";
import { updateNavIndex } from '../sideNavBarSlice'
import UploadComponents from "../uploadComponents";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileUpload from "../../../../components/FileUpload";

export const DetailedApplication2G = (props:any) => {

    const { id } = useParams()
    const [parentId] = useState(Number(id))
    const [formData, setFormData] = useState(defaultIDetailedApplication2G);
    const actionId = useState(uuid());
    const controller = new Controller(actionId, detailedApplication2GThunk);
    const state = useAppSelector(selectDetailedApplication2G);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();


    const handleOnClickUpload = () => {
        setOpen(true)
    }
    useEffect(() => {
        dispatch(updateNavIndex(6))
        if (parentId) {

            if (!state[parentId]?.data[0]) {
                setFormData({ ...formData, parentId: parentId })
                controller.all({ ...formData, parentId: parentId });
            }
        }
    }, [])

    useEffect(() => {
        dispatch(updateNavIndex(6))
        if (id && state[parentId]?.data) {
            Object.keys(state[parentId]?.data).map((key) => {
                let value = state[parentId]?.data[key]
                if (value && value.id) {
                    setFormData(value);
                } else {
                    setFormData({ ...formData, parentId: parentId })
                }
            });
        }
    }, [state[parentId]?.data])

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


    const handleClick = (ev: any, navTo: string) => {
        handleSave()
        if (navTo === 'next') {
            navigate(`/Detailed/${id}/detailed2H`);
        }
        else {
            navigate(`/Detailed/${id}/detailed2F`);
        }
    }

    let listItem = ["a. Company & amount invested - sector, location, investment thesis, years(s) of investment, instruments used, structuring specially, firm which did the Financial/ Legal/ Technical due deligance etc.", "b. Time taken from sourcing to closure", "c. How was the deal sourced?", "d. % holding & valuation (pre-money and post-money)", "e. Key reasons for the investment & basis for valuation", "f. What was / is the value-add made by the respective employee - please give details of strategy, process, operations, business development, any other value add done.", "g. If exited, then exit amount, IRR on exit, method of exit.", "h. Any loss / write-off? If yes, details along with reasons.", "i. Any learning from past investments / divestments?", "j. Given a chance, what would you do differently compared to the past?", "k. If not exited (as on date), then valuation, notional 100 %. basis of valuation, whether EVCA or any other valuation guideline used. "]

    return (<>
        <SideNavBar></SideNavBar>
        <Grid item xs={9}>


            <Card sx={{ display: 'flex', mb: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Detailed Application</Typography>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>G. Investment Manager </Typography>
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>32. What is the shareholding pattern of the Investment Manager?</Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{margin: "15px"}}>
                                    <UploadComponents id={`imShareholdingPattern${id}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="subsidiaryOfAnotherCompany"
                                label="33. Is the Investment Manager a subsidiary of another Company? If yes, details of the same and please attach copies of the Annual Reports of the Holding Company for the last 3 years. "
                                //defaultValue={formData.subsidiaryOfAnotherCompany === undefined ? " " : formData["subsidiaryOfAnotherCompany"]}
                                value={formData["subsidiaryOfAnotherCompany"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{margin: "15px"}}>
                                    <UploadComponents id={`imSubsidiary${id}`}></UploadComponents>
                                </div>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>34. Please attach the organisation structure / chart of the Investment Manager. </Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{margin: "15px"}}>
                                    <UploadComponents id={`imOrgStructure${id}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>35. Please attach CVs of the MD / CEO / CIO / CFO / Investment Manager(s) / Key personnel of the Investment Manager (anyone drawing CTC of more than Rs.24 lakh p.a.) </Typography>
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{margin: "15px"}}>
                                    <UploadComponents id={`imCVS${id}`}></UploadComponents>
                                </div>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Divider sx={{ mt: 2 }} />

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 4 }}>36. Team's relevant Investment experience (for each investment, employee-wise) .</Typography>


                    <Card sx={{ display: 'flex', mb: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            {listItem.map((item) => (
                                <div>
                                    <ListItem>
                                        <Typography variant="body2" sx={{ flex: 1, color: '#363062' }}>{item}</Typography>
                                    </ListItem>

                                </div>
                            ))}
                            <Card sx={{ display: 'flex', mt: 2, mb: 2, borderRadius: '8px' }}>
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ flex: 1, color: '#363062' }}> <b>Note:</b> In particular, each key employee has to state the Fund name with which he/she was associated, the time period for which he/she was associated with the fund along with designation and responsibilities handled and the overall performance of the Fund(s).</Typography>

                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                    
                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid item xs={3}>
                                <div style={{margin: "15px"}}>
                                    <UploadComponents id={`imTeamsExperience${id}`}></UploadComponents>
                                </div>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="overallEmployeeCost"
                                label="37. What is the overall employee cost for the last 3 years? Please indicate the CTC bands of various grades of employees (total, fixed & variable)."
                                //defaultValue={formData.monitoringPractices === undefined ? " " : formData["monitoringPractices"]}
                                value={formData["overallEmployeeCost"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="employeeCarry"
                                label="38. What is the policy regarding carry How much do the employees get? How are the carried interest tied up if key man provisions are triggered? "
                                //defaultValue={formData.approvers === undefined ? " " : formData["approvers"]}
                                value={formData["employeeCarry"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="regulartoryInvestigation"
                                label="39. Has any of the member(s) of the Board of Directors of Investment Manager, Trustee, Sponsor or employes(e)of the Investment Manager been reported to / investigated by any regulatory authority during the last 5 years? If yes, please give .11 details of the same."
                                //defaultValue={formData.approvers === undefined ? " " : formData["approvers"]}
                                value={formData["regulartoryInvestigation"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="vcExlusive"
                                label="40. Is the Investment Manager exclusively handling VC business or is it also doing any other business or activity?"
                                //defaultValue={formData.otherVCFsManaged === undefined ? " " : formData["otherVCFsManaged"]}
                                value={formData["vcExlusive"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="directorship"
                                label="41. How many directorships does each Investment Manager (employee) hold? What is the policy in this regard?"
                                //defaultValue={formData.approvers === undefined ? " " : formData["approvers"]}
                                value={formData["directorship"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ display: 'flex', mt: 2, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <TextField
                                required
                                id="employeeShareHolding"
                                label="42. Details of shareholding (controlling stake) by any employee in any investee company / public / private company, directly or indirectly."
                                //defaultValue={formData.shareHoldingPattern === undefined ? " " : formData["shareHoldingPattern"]}
                                value={formData["employeeShareHolding"] || ''}
                                variant="standard"
                                onChange={handleChange}

                                sx={{ display: 'flex', ml: 2, mb: -3 }}
                            />
                        </CardContent>
                    </Card>

                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                onClick={(e) => handleClick(e, "previous")}
                                startIcon={<ArrowLeftIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={4} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(G) of 5</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={4} sx={{ justifyContent: 'right' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <Button
                                    onClick={(e) => handleClick(e, "next")}
                                    endIcon={<ArrowRightIcon />}
                                    variant="contained"
                                    disableElevation
                                    sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2, mr: 2 }} >
                                    Next
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    </>
    );
}


export default DetailedApplication2G;
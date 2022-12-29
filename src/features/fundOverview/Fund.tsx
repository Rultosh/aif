import { Card, Divider, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button } from "@mui/material";
import FundOverviewData from "./subsections/fundOverviewData/FundOverviewData";
import InvestmentPartner from "./subsections/fundOverviewData/investmentPartner/InvestmentPartner";
import ContributorDetails from "./subsections/fundOverviewData/contributorDetails/ContributorDetails";
import InvestmentAssociate from "./subsections/fundOverviewData/investmentAssociate/InvestmentAssociate";
import InvestmentPast from "./subsections/fundOverviewData/investmentPast/InvestmentPast";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import PrelimApplicationData from "./subsections/fundOverviewData/PrelimApplication";
import { clearPrelimApplication, selectPrelimApplication } from "./subsections/fundOverviewData/prelimApplicationDataSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FetchStatus } from "../../lib/api-status/IStatus";
import UploadComponents from "../DetailedApplicationComponent/subsections/uploadComponents";

export const Fund = () => {

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [prelimApplicationId, setPrelimApplicationId] = useState(id);

    const prelimApplicationState = useAppSelector(selectPrelimApplication)

    const handleApplicationIdCreation = (value: String | undefined) => {
        if (value) setPrelimApplicationId(String(value));
    }

    // useEffect(() => {
    //     dispatch(clearPrelimApplication);
    //     if(prelimApplicationId == "NEW" || !Number(prelimApplicationId)) {
    //         setPrelimApplicationId(undefined);
    //     }
    // })

    useEffect(() => {
        console.log('use effect fund', prelimApplicationState.prelimApplication.id)
        setPrelimApplicationId(String(prelimApplicationState.prelimApplication.id))
    }, [prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    useEffect(() => {
        setPrelimApplicationId(id);
        if (!Number(id)) {
            console.log('clearing prelim applicaiton', Number(id))
            dispatch(clearPrelimApplication());
            console.log('cleared prelim application')
        }
    }, [id])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>("1");

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate(`/preliminary/${prelimApplicationId}/profile`)
        }
    }
    return (
        <Card sx={{ display: 'flex', mb: 2 }}>
            <CardContent sx={{ flex: 1 }}>
                <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062' }}>Fund Overview</Typography>
                <Divider color='#363062' />
                <Typography variant="subtitle1" sx={{ flex: 1, textAlign: "center", mt: 4, mb: 1, color: '#363062', fontWeight: '500' }}>Details of the Fund</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Accordion sx={{ backgroundColor: '#363062' }} expanded={expanded === "1"} onChange={handleChange("1")}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            >
                                <Typography sx={{ color: 'white' }}>
                                    1.Fund Overview
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ backgroundColor: "#f2f2f2" }}>
                                    {/*<FundOverviewData ></FundOverviewData>*/}
                                    <PrelimApplicationData
                                        prelimApplicationId={prelimApplicationId}
                                        setPrelimApplicationId={handleApplicationIdCreation}
                                    ></PrelimApplicationData>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    {Number(prelimApplicationId) ? <Grid item xs={12}>
                        <Accordion sx={{ backgroundColor: '#363062' }} expanded={expanded === "2"} onChange={handleChange("2")}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            >
                                <Typography sx={{ color: 'white' }}>
                                    2. Details of Investment team(at Partner level)
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ backgroundColor: "#f2f2f2" }}>
                                    <InvestmentPartner prelimApplicationId={Number(prelimApplicationId)}></InvestmentPartner>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid> : <></>}
                    {Number(prelimApplicationId) ? <Grid item xs={12}>
                        <Accordion sx={{ backgroundColor: '#363062' }} expanded={expanded === "3"} onChange={handleChange("3")}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            >
                                <Typography sx={{ color: 'white' }}>
                                    3. Details of Contributor to the Fund
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ backgroundColor: "#f2f2f2" }}>
                                    <ContributorDetails prelimApplicationId={Number(prelimApplicationId)}></ContributorDetails>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid> : <></>}
                    {Number(prelimApplicationId) ? <Grid item xs={12}>
                        <Accordion sx={{ backgroundColor: '#363062' }} expanded={expanded === "4"} onChange={handleChange("4")}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            >
                                <Typography sx={{ color: 'white' }}>
                                4. Details of Investment team(at Associate level)
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ backgroundColor: "#f2f2f2" }}>
                                    <InvestmentAssociate prelimApplicationId={Number(prelimApplicationId)}></InvestmentAssociate>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid> : <></>}
                    {Number(prelimApplicationId) ? <Grid item xs={12}>
                        <Accordion sx={{ backgroundColor: '#363062' }} expanded={expanded === "5"} onChange={handleChange("5")}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            >
                                <Typography sx={{ color: 'white' }}>
                                5. Investments made, if any from the current Fund
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ backgroundColor: "#f2f2f2" }}>
                                    <InvestmentPast prelimApplicationId={Number(prelimApplicationId)}></InvestmentPast>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid> : <></>}
                    {Number(prelimApplicationId) ? <Grid item xs={12}>
                        <Accordion sx={{ backgroundColor: '#363062' }} expanded={expanded === "6"} onChange={handleChange("6")}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            >
                                <Typography sx={{ color: 'white' }}>
                                6. Past investment track record of the AMC
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ backgroundColor: "#f2f2f2" }}>
                                    <div style={{display: "inline", padding: "10px"}}><a href="">Download Template</a></div>
                                    <div style={{display: "inline", padding: "10px"}}><UploadComponents id={`pastInvestmentTrackRecord${id}`}></UploadComponents></div>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid> : <></>}
                </Grid>
                {Number(prelimApplicationId) ? <Button onClick={(e) => handleClick(e, "next")} endIcon={<ArrowRightIcon />} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Profile
                </Button> : <></>}
            </CardContent>
        </Card>
    );
}


export default Fund;
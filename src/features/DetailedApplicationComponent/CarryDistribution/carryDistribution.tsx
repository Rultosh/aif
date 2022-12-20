import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, FormControlLabel, Switch, FormControl, InputLabel } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MasterData from "../../../components/master-data/MasterData";


export const CarryDistribution = () => {

    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate("/preliminary/profile")
        }
    }

    const handleSelectChange = (id: String, value: any) => {
        /* let copiedValue: IPrelimApplicationData = { ...prelimApplicationFormData };
         copiedValue[id as keyof IPrelimApplicationData] = value;
         setPrelimApplicationFormData(copiedValue);*/
    }

    return (<>

        <Grid item xs={12}>


            <Card sx={{ display: 'flex', mb: 2, mt: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Illustration of carry distribution of the Fund</Typography>

                    <Divider sx={{ mt: 2 }} />
                    <Card sx={{ display: 'flex', mt: 3, background: '#f2f2f2' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>Carry Distribution</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        id="captionDetails"
                                        label="Corpus[Rs. In crore]"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', ml: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Hurdle</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={0}
                                            //propertyValue={prelimApplicationFormData.fundManager || 0}
                                            onChange={handleSelectChange} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Catchup(%)</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={0}
                                            //propertyValue={prelimApplicationFormData.fundManager || 0}
                                            onChange={handleSelectChange} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl variant="standard" sx={{ ml: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Carry(%)</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={0}
                                            //propertyValue={prelimApplicationFormData.fundManager || 0}
                                            onChange={handleSelectChange} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl variant="standard" sx={{ ml: 2, mt: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Profit to investors(%)</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={0}
                                            //propertyValue={prelimApplicationFormData.fundManager || 0}
                                            onChange={handleSelectChange} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl variant="standard" sx={{ ml: 2, mt: 2, display: 'flex' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Distributable corpus assumed for illustration[Rs. Crore]</InputLabel>

                                        <MasterData propertyType="fundManager"
                                            propertyValue={0}
                                            //propertyValue={prelimApplicationFormData.fundManager || 0}
                                            onChange={handleSelectChange} />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Divider sx={{ mt: 7, mb: 2 }} />

                            <Grid container spacing={6} >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Amount</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Balance Amount</Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>1.Capital to Investors (Rs. Crore)</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>2.Hurdle to the Investors (…….% on Capital to Investors) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>3.Catchup to Fund Manager (…….% on Hurdle to Investors) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>4.Profit to the Investors(..% after catch up i.e, 80% on Rs..cr)– Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>5.Carry to Fund Manager (…….% on Rs ………………… crore) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Total</Typography>
                                </Grid>

                            </Grid>

                            <Divider sx={{ mt: 2 }} />

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>6.Profit to Investors (2+4) ) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, ml: 2, justifyContent: 'center' }}>7.Distribution/Carry with Catchup to IM (3+5) ) – Rs. Crore</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        required
                                        type="number"
                                        id="captionDetails"
                                        //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                        //value={formData["fundLaunchedDate"]}
                                        variant="standard"
                                        // onChange={handleChange}

                                        sx={{ display: 'flex', mt: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Total</Typography>
                                </Grid>

                            </Grid>

                            <Divider sx={{ mt: 2 }} />

                        </CardContent>
                    </Card>
                    <Button
                        onClick={(e) => handleClick(e, "previous")}
                        variant="outlined"
                        disableElevation
                        sx={{ textTransform: 'none', mt: 9, mb: 3, ml: 2, width: '90px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} >
                        Download
                    </Button>
                    <Button
                        onClick={(e) => handleClick(e, "previous")}
                        variant="outlined"
                        disableElevation
                        sx={{ textTransform: 'none', mt: 9, mb: 3, ml: 2, width: '90px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} >
                        Upload
                    </Button>
                    <Divider sx={{ mt: 2 }} />
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
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 4 of 5</Typography>
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


export default CarryDistribution;
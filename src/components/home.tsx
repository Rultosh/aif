import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Container, Grid, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Home = () => {
    const navigate = useNavigate();

    type dropDownValues = {
        data: any,
        arrowUp: boolean,

    }

    type InitialState = {
        id: string,
        value: any
    }


    const initialState: InitialState = {
        id: "1",
        value: { data: [], arrowUp: true } as dropDownValues
    };
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
      (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
      };


    const toolbarHeaders = [{ "id": "1", "value": "1.Fund Overview" },
    { "id": '2', "value": "2.Details of Investment team(at Partner level)" },
    { "id": '3', "value": "3.Details of Contributor to the Fund" },
    { "id": '4', "value": "4.Details of Investment Team(at Associate level)" },
    { "id": '5', "value": "5.Investment made, if any from the current Fund" },
    { "id": '6', "value": "6.Past investment track record of the AMC" },
    ]

    let outputComponents = []

    for (let i = 0; i < toolbarHeaders.length; i++) {

        let val = toolbarHeaders[i].id

        outputComponents.push(

           
            <React.Fragment >
                 <Grid item xs={12}>
                <Accordion sx={{ backgroundColor: '#363062'}}expanded={expanded === val} onChange={handleChange(val)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{color:'white'}}/>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{   color: 'white' }}>
                        {toolbarHeaders[i].value}
                        </Typography>
                        
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{backgroundColor: "#f2f2f2"}}>
                        <Typography sx={{   color: 'black' }}>
                            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                            Aliquam eget maximus est, id dignissim quam.
                        </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                </Grid>
            </React.Fragment>

        );
    }


    return (
        <div className="homeComp">
            <NavigationBar></NavigationBar>
            <div >  
                <Container maxWidth={false} sx={{ mt: '90px' }} >
                 Home page in Construction{/*
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Card sx={{ display: 'flex', height: '550px', mb: 2 }}>

                                    <CardContent sx={{ flex: 1 }}>
                                        Box1
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={10}>
                                <Card sx={{ display: 'flex', mb: 2 }}>
                                    <CardContent sx={{ flex: 1 }}>

                                        <Typography sx={{ flex: 1 }}>Fund Overview</Typography>
                                        <Typography variant="subtitle2" sx={{ flex: 1, textAlign: "center", mt: 4, mb: 1 }}>Details of the Fund</Typography>
                                        <Grid container spacing={2}>

                                            {outputComponents}
                                            */}

                                            {/*} <Grid item xs={12}>
                                                <Box>
                                                    <Toolbar disableGutters sx={{ color: 'white', backgroundColor: '#363062' }}>
                                                        <Typography sx={{ flex: 1, ml: '10px', textAlign: "left" }}> {toolbarHeaders[0]} </Typography>
                                                        <Box><i className="arrow down" ></i></Box>
                                                    </Toolbar>
                                                    <Box sx={{ backgroundColor: "#f2f2f2" }}>
                                                        <Typography sx={{ flex: 1, ml: '10px', textAlign: "left" }}> Test </Typography>
                                                        <Typography sx={{ flex: 1, ml: '10px', textAlign: "left" }}> Test </Typography>
                                                        <Typography sx={{ flex: 1, ml: '10px', textAlign: "left" }}> Test </Typography>
                                                        <Typography sx={{ flex: 1, ml: '10px', textAlign: "left" }}> Test </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <Toolbar disableGutters sx={{ color: 'white', backgroundColor: '#363062' }}>
                                                        <Typography sx={{ flex: 1, ml: '10px', textAlign: "left" }}> {toolbarHeaders[1]} </Typography>
                                                        <Box><i className="arrow down" ></i></Box>
                                                    </Toolbar>
                                                </Box>
    </Grid>*/}
                                      {/*}  </Grid>
                                    </CardContent>
                                </Card>


                            </Grid>
                        </Grid>

                    </Box>*/}
</Container>
            </div>

        </div>
    )
}
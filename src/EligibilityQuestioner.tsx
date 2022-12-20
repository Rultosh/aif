import { Box, Button, Card, CardActionArea, CardContent, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, ToggleButton } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, * as Rect from 'react'
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

const EligibilityQuestioner = (props: any) => {

    const { question, results } = props;


    function convertStringToComponent(text: string) {
        const newText = text.split('<br>').map(str => <p>{str}</p>);
        return newText;
    }

    const handleChange = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        const ev = (e.target as HTMLInputElement);
        props.onclick(ev.id, ev.value);
    };

    let outputComponents = []

    for (let i = 0; i < question.length; i++) {

        let qes = question[i].id.toString().concat('. ', question[i].text);
        let qesId = question[i].id.toString();

        if (question[i] && question[i].options === undefined) {
            qes = convertStringToComponent(qes);
            outputComponents.push(
                <React.Fragment >
                    <Box >
                        <h4>{qes}</h4>
                        <ToggleButtonGroup
                            color="primary"
                            value={results[qesId]}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"

                        >
                            <ToggleButton value="yes" id={qesId} >Yes</ToggleButton>
                            <ToggleButton value="no" id={qesId} >No</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </React.Fragment>

            );
        }
        else {
            outputComponents.push(
                <React.Fragment >
                    <Box>
                        <h4>{qes}</h4>
                        <ToggleButtonGroup
                            color="primary"
                            value={results[qesId]}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                        >
                            {
                                question[i].options.map((obj: any) => (
                                    <ToggleButton value={obj.text} id={qesId} >{obj.text}</ToggleButton>
                                ))
                            }

                        </ToggleButtonGroup>
                    </Box>
                </React.Fragment>
            );



        }

    }

    return (
        <div>
            <Container maxWidth={false} sx={{ mt: '90px', }}>
          <Grid   >
            <CardActionArea component="a" disableRipple >
              <Card sx={{ display: 'flex' }}>
                <CardContent sx={{ flex: 1 }}>
            {outputComponents}
            <Box display="flex"
                justifyContent="center"
                alignItems="center">
                <Button variant="contained" disableElevation sx={{ textTransform: 'none' }} onClick={props.onSubmit}>
                    Check Eligibility
                </Button>
            </Box>
            </CardContent>

              </Card>


            </CardActionArea>
          </Grid>
        </Container>
        </div>


    )

}

export default EligibilityQuestioner;
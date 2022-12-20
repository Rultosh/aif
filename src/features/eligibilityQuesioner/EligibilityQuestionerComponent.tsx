import { Box, Button, Card, CardActionArea, CardContent, Container, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, ToggleButton, Typography } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, * as Rect from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchQuestions, selected, getQuestions } from './eligibiltyQuestionerSlice'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


type resultSchema = {
    id: string,
    value: string
}


const EligibilityQuestioner = () => {

    //const { question, results } = props;
    const [scheme, setScheme] = React.useState(undefined);
    const question = useAppSelector(state => state.eligibilityQuestioner.questions)
    const results = useAppSelector(state => state.eligibilityQuestioner.results)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({} as resultSchema);
    const [enableCheck, setEnableCheck] = useState(false);
    const schemeNames = ["Fund of funds", "Asipre for Start-ups", "UP Start-up Fund"]

    useEffect(() => {
        // dispatch(fetchQuestions())
        dispatch(getQuestions())
    }, [])

    useEffect(() => {
        updateCheckButton()
    }, [formData])


    function convertStringToComponent(text: string) {
        const newText = text.split('<br>').map(str => <p>{str}</p>);
        return newText;
    }

    const handleChange = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        const ev = (e.target as HTMLInputElement);
        //const obj: resultSchema = { id: ev.id, value: ev.value }
        let copiedValue = { ...formData };
        copiedValue[ev.id as keyof resultSchema] = ev.value;
        setFormData(copiedValue);

        //setFormData(formData => ({...formData,obj}))
        //dispatch(selected(obj));
    };

    const handleSelectChange = (e: any) => {
        setFormData({} as resultSchema);
        console.log('e.target.value', e.target.value)
        console.log('e.target.key', e.target.key)
        setScheme(e.target.value);
        console.log('scheme', scheme)
    }
    function updateCheckButton() {
        if (scheme !== undefined && question[schemeNames[scheme]].length === Object.keys(formData).length) {
            setEnableCheck(true)
        }
        else {
            setEnableCheck(false)
        }
    }

    function submitOnCheckEligibility() {
        console.log(results);
        dispatch(selected(formData));
        navigate('/eligibilityResults')
    }

    let outputComponents = []


    for (let i = 0; scheme !== undefined && i < question[schemeNames[scheme]].length; i++) {
        let quest = question[schemeNames[scheme]];
        let qes = quest[i].id.toString().concat('. ', quest[i].text);
        let qesId = quest[i].id.toString();

        if (quest[i] && quest[i].options === undefined) {
            qes = convertStringToComponent(qes);
            outputComponents.push(
                <React.Fragment >
                    <Box >
                        <Typography sx={{ flex: 1, }}>{qes}</Typography>
                        <ToggleButtonGroup
                           color="primary"
                            value={formData[qesId as keyof resultSchema]}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                            
                        >
                            <ToggleButton sx={{fontWeight:'bold',color:'black',}} value="yes" id={qesId} >Yes</ToggleButton>
                            <ToggleButton sx={{fontWeight:'bold',color:'black'}} value="no" id={qesId} >No</ToggleButton>
            
            </ToggleButtonGroup>
                    </Box>
                </React.Fragment>

            );
        }
        else {
            outputComponents.push(
                <React.Fragment >
                    <Box>
                        <Typography sx={{ flex: 1,mt:1 }}>{qes}</Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={formData[qesId as keyof resultSchema]}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                            sx={{mt:1,}}
                        >
                            {
                                quest[i].options.map((obj: any) => (
                                    <ToggleButton sx={{fontWeight:'bold',color:'#000000'}} value={obj.text} id={qesId} >{obj.text}</ToggleButton>
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
            <Container maxWidth={false} sx={{ mt: '15px', }}>
                <Grid   >
                    <CardActionArea component="a" disableRipple >
                        <Card sx={{ display: 'flex' }}>
                            <CardContent sx={{ flex: 1 }}>
                                {scheme === undefined ? <Typography variant="h6" sx={{ flex: 1, ml: '10px', textAlign: "left" }}>Select any scheme to proceed</Typography> : null}

                                <FormControl sx={{ m: 1, minWidth: 250 }} size="medium">

                                    <InputLabel id="demo-select-small">Scheme</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={scheme}
                                        label="scheme"
                                        onChange={handleSelectChange}
                                    >

                                        <MenuItem key={"Fund of funds"} value={0}>Fund of funds</MenuItem>
                                        <MenuItem key={"Asipre for Start-ups"} value={1}>Asipre for Start-ups</MenuItem>
                                        <MenuItem key={"UP Start-up Fund"} value={2}>UP Start-up Fund</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </CardActionArea>
                </Grid>
            </Container>
            <Container maxWidth={false} sx={{ mt: '10px', }}>
                <Grid   >{scheme !== undefined ?
                    <CardActionArea component="a" disableRipple >
                        <Card sx={{ display: 'flex' }}>
                            <CardContent sx={{ flex: 1 }}>
                                {outputComponents}
                                <Box display="flex"
                                    justifyContent="center"
                                    alignItems="center">
                                    <Button variant="contained" disabled={!enableCheck} disableElevation sx={{ textTransform: 'none', mt: 2 }} onClick={submitOnCheckEligibility}>
                                        Check Eligibility
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </CardActionArea> : null}
                </Grid>
            </Container>
        </div>


    )

}

export default EligibilityQuestioner;
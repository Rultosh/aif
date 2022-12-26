import { Card, CardContent, Typography, Grid, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, TextField } from "@mui/material";
import { useState, useEffect } from "react"
import { questions } from './selfRatingQuestions'
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, * as Rect from 'react'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { ISelfRating } from "./ISelfRating";
import { selectSelfRatings, fetchSelfRatingAsync, createSelfRatingAsync, updateSelfRatingAsync } from "./selfRatingSlice";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import uuid from 'react-uuid';
import { FetchStatus } from "../../../../lib/api-status/IStatus";



type InitialState = {
    selfRatingData: any
}

export const SelfRating = () => {

    const { id } = useParams();
    const [actionUid] = useState(uuid());

    const selfRatingState = useAppSelector(selectSelfRatings)

    const [selfRatingValue, setSelfRatingValue] = useState(selfRatingState.selfRatings);
    const [scoreBoard, setScoreBoard] = useState({} as any);
    const [score, setScore] = useState('0');

    const navigate = useNavigate()
    const dispatch = useAppDispatch()


    useEffect(() => {
        dispatch(
            fetchSelfRatingAsync(
                wrapArgument(actionUid,
                    Number(id))
            )
        )
    }, [selfRatingState.actionStatus.fetchStatus === FetchStatus.IDLE])

    useEffect(() => {
        console.log(selfRatingState.selfRatings);
        setSelfRatingValue(selfRatingState.selfRatings);
    }, [selfRatingState.status.fetchStatus === FetchStatus.IDLE])

    useEffect(() => {
        updateScore()
        console.log("use Effect running due to scoreBoard chnage");

    }, [scoreBoard])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'previous') {
            navigate(`/preliminary/${id}/profile`)
        } else {
            navigate(`/preliminary/${id}/declaration`)
        }
    }

    function handleClickSave() {
        console.log(selfRatingValue.id)
        if (!selfRatingValue.id) {
            dispatch(
                createSelfRatingAsync(
                    wrapArgument(actionUid, { ...selfRatingValue, prelimApplicationId: Number(id) })
                )
            )
        } else {
            dispatch(
                updateSelfRatingAsync(
                    wrapArgument(actionUid, { ...selfRatingValue, prelimApplicationId: Number(id) })
                )
            )
        }
    }

    function calculateScore(v: any, sel: string, idx: number) {
        let i = v.options.indexOf(sel);
        let weight = v.weightage[i]
        let copiedValue = { ...scoreBoard };
        copiedValue[idx] = weight;
        setScoreBoard(copiedValue);
    }
    function updateScore() {
        let sum = 0;
        let arr: any = Object.values(scoreBoard)
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        let sumStr = sum.toFixed(2);
        //setScore(sumStr)
        let copiedValue = { ...selfRatingValue };
        copiedValue['score'] = sumStr;
        setSelfRatingValue(copiedValue);
    }




    const handleChange = (e: any, idx: any) => {
        e.preventDefault();
        console.log('checking state value', selfRatingValue, e.target.value, idx)
        let copiedValue = { ...selfRatingValue };
        let key = "q" + idx;
        copiedValue[key as keyof ISelfRating] = e.target.value as any;
        setSelfRatingValue(copiedValue);
    };

    let selfRatingQuestionComponents = []

    let selfQuestions = questions.selfRatingQuestions

    for (let i = 0; i < selfQuestions.length; i++) {
        let qes = selfQuestions[i].id.toString().concat('. ', selfQuestions[i].text);
        let idxVal = i;
        if (selfQuestions[i] && (selfRatingState.status.fetchStatus === FetchStatus.IDLE) || (id?.toString() == 'NEW')) {
            selfRatingQuestionComponents.push(
                <React.Fragment >
                    < Card sx={{ display: 'flex', mt: 2, backgroundColor: "#f2f2f2" }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ justifyContent: 'left', ml: 1, mt: 1 }}>
                                        <FormControl >
                                            <Box >
                                                <FormLabel >{qes}</FormLabel>
                                            </Box>
                                            <RadioGroup
                                                row
                                                defaultValue={selfRatingValue["q" + (i + 1).toString() as keyof ISelfRating]}
                                                //defaultValue= ">=5% but less than 10% of corpus"
                                                name="position"
                                                onChange={(e) => handleChange(e, i + 1)}
                                            >
                                                {selfQuestions[i].options.map((val, index) => (
                                                    <Grid item xs={selfQuestions[idxVal].size}>
                                                        <FormControlLabel onChange={() => calculateScore(selfQuestions[i], val, idxVal)} value={val} control={<Radio />}
                                                            // checked={selfRatingValue["Q" + (idxVal + 1)] === val} 
                                                            label={val} />
                                                    </Grid>
                                                ))}
                                            </RadioGroup>

                                        </FormControl>
                                        <Grid container >
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id={"q" + (i + 1).toString()+"Comments"}
                                                    label="Comments if any"
                                                    //defaultValue={formData.corpus === undefined ? " " : formData["corpus"]}
                                                    //value={selfRatingValue["q" + (i + 1).toString()+"Comments" as key of  as keyof ISelfRating]] || ''}
                                                    value={selfRatingValue["q" + (i + 1).toString()+"Comments" as keyof ISelfRating] || ''}
                                                    
                                                    variant="standard"
                                                    onChange={(e) => handleChange(e, (i + 1).toString()+"Comments")}

                                                    sx={{ display: 'flex', ml: 2 }}
                                                />
                                            </Grid>
                                        </Grid>
                                        
                                    </Box>
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>
                </React.Fragment>)
        }
    }

    return (
        <Card sx={{ display: 'flex', mb: 2 }}>
            <CardContent sx={{ flex: 1 }}>
                <Grid container spacing={2} >
                    <Grid item xs={11}>
                        <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Self Rating</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Box sx={{ position: 'fixed', backgroundColor: '#D586F7' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column-reverse', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'flex-end', }}>
                                <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Score:{selfRatingValue.score || 0}</Typography>
                            </Box></Box></Grid>
                </Grid>

                {selfRatingQuestionComponents}
                <Button
                    onClick={(e) => handleClick(e, "previous")}
                    startIcon={<ArrowLeftIcon />}
                    variant="contained"
                    disableElevation
                    sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Profile
                </Button>
                <Button
                    color='success'
                    onClick={handleClickSave}
                    variant="contained"
                    disableElevation
                    sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Save
                </Button>
                <Button
                    onClick={(e) => handleClick(e, "next")}
                    endIcon={<ArrowRightIcon />}
                    variant="contained"
                    disableElevation
                    sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Declaration
                </Button>
            </CardContent >
        </Card >
    );
}

export default SelfRating;
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
import { selectUsers } from '../../../admin/adminSlice'
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import useCookie, { getCookie } from 'react-use-cookie';



type InitialState = {
    selfRatingData: any
}

export const SelfRating = (props: any) => {

    const { id } = useParams();
    const [actionUid] = useState(uuid());

    const selfRatingState = useAppSelector(selectSelfRatings)

    const [selfRatingValue, setSelfRatingValue] = useState<ISelfRating>(selfRatingState.selfRatings);
    const [scoreBoard, setScoreBoard] = useState({} as any);
    const [score, setScore] = useState('0');
    const usersState = useAppSelector(selectUsers)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    // const selfRatingCookie = getCookie('selfRating') || '0';
    // const [selfRating, setSelfRating] = useCookie('selfRating', selfRatingCookie);

    useEffect(() => {
        if (props.checkUnAuth) {
            navigate('/login')
        }

        // if(getCookie('selfRating') == '1'){
        //     handleClickSave();
        // }
    })

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

        handleClickSave();

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
        // if(selfRatingValue){
        // setSelfRating('0');
        // }
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
        // setValue(e.target.id, e.target.value);
        setSelfRatingValue(copiedValue);
    };

    function getValue(key: string): string {
        if (selfRatingValue && selfRatingValue[key as keyof ISelfRating]) {
            return String(selfRatingValue[key as keyof ISelfRating]);
        }
        else {
            return "";
        }
    }

    let selfRatingQuestionComponents = []

    let selfQuestions = questions.selfRatingQuestions


    // const validationSchema = Yup.object().shape({
    //     comments: Yup.string().required("Comments is required")
    //   });

    //   const {
    //     control,
    //     register,
    //     handleSubmit,
    //     getValues,
    //     setValue,
    //     reset,
    //     formState: { errors },
    //   } = useForm({
    //     resolver: yupResolver(validationSchema),
    //   });

    //   const onSubmit = (data: any) => {
    //     console.log(data);
    //     handleClickSave();
    //   };

    for (let i = 0; i < selfQuestions.length; i++) {
        let qes = selfQuestions[i].id.toString().concat('. ', selfQuestions[i].text);
        let idxVal = i;
        if (selfQuestions[i] && (selfRatingState.status.fetchStatus === FetchStatus.IDLE) || (id?.toString() == 'NEW')) {
            selfRatingQuestionComponents.push(
                <React.Fragment key={i}>
                    <Card sx={{
                        display: 'flex',
                        mt: 3,
                        borderRadius: '12px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }
                    }}>
                        <CardContent sx={{ p: 3, width: '100%' }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#363062' }}>
                                                {qes}
                                            </Typography>
                                        </Box>
                                        <RadioGroup
                                            row
                                            value={getValue("q" + (i + 1).toString())}
                                            name={"q" + (i + 1).toString()}
                                            onChange={(e) => handleChange(e, i + 1)}
                                            sx={{ mb: 2 }}
                                        >
                                            {selfQuestions[i].options.map((val, index) => (
                                                <Grid item xs={selfQuestions[idxVal].size} key={index}>
                                                    <FormControlLabel
                                                        onChange={() => calculateScore(selfQuestions[i], val, idxVal)}
                                                        value={val}
                                                        control={<Radio color="primary" />}
                                                        label={<Typography variant="body2">{val}</Typography>}
                                                    />
                                                </Grid>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>

                                    <Divider sx={{ mb: 3, opacity: 0.6 }} />

                                    <TextField
                                        fullWidth
                                        id={"q" + (i + 1).toString() + "Comments"}
                                        label="Comments (Optional)"
                                        value={getValue("q" + (i + 1).toString() + "Comments") || ''}
                                        variant="outlined"
                                        multiline
                                        rows={2}
                                        onChange={(e) => handleChange(e, (i + 1).toString() + "Comments")}
                                        placeholder="Add any additional context here..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                backgroundColor: 'rgba(54, 48, 98, 0.01)'
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </React.Fragment>)
        }
    }

    return (
        <div className="formAnimation">
            <Card sx={{
                display: 'flex',
                mb: 3,
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <CardContent sx={{ p: 4, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#363062' }}>
                            Self Rating
                        </Typography>

                        {['ADMIN', 'USERADMIN'].includes(usersState.role != undefined ? usersState.role : '') && (
                            <Box sx={{
                                backgroundColor: '#D586F7',
                                color: 'white',
                                px: 3,
                                py: 1.5,
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(213, 134, 247, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, opacity: 0.9 }}>Total Score:</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>{selfRatingValue.score || 0}</Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        {selfRatingQuestionComponents}
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            onClick={(e) => handleClick(e, "previous")}
                            startIcon={<ArrowLeftIcon />}
                            variant="outlined"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: 3,
                                fontWeight: 600,
                                color: '#363062',
                                borderColor: '#363062',
                                '&:hover': {
                                    borderColor: '#4d4585',
                                    backgroundColor: 'rgba(54, 48, 98, 0.04)'
                                }
                            }} >
                            Back to Profile
                        </Button>

                        <Box>
                            <Button
                                color='success'
                                onClick={handleClickSave}
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    px: 4,
                                    fontWeight: 600,
                                    backgroundColor: '#363062',
                                    boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                                    '&:hover': {
                                        backgroundColor: '#4d4585',
                                        boxShadow: '0 6px 16px rgba(54, 48, 98, 0.3)'
                                    },
                                    mr: 2
                                }} >
                                Save
                            </Button>
                            <Button
                                onClick={(e) => handleClick(e, "next")}
                                endIcon={<ArrowRightIcon />}
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    px: 4,
                                    fontWeight: 600,
                                    backgroundColor: '#D586F7',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(213, 134, 247, 0.2)',
                                    '&:hover': {
                                        backgroundColor: '#c466e8',
                                        boxShadow: '0 6px 16px rgba(213, 134, 247, 0.3)'
                                    }
                                }} >
                                Declaration
                            </Button>
                        </Box>
                    </Box>
                </CardContent >
            </Card >
        </div>
    );
}

export default SelfRating;
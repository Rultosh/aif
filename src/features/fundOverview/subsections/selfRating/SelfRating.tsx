import { Card, CardContent, Typography, Grid, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, TextField, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react"
import { questions } from './selfRatingQuestions'
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SaveIcon from '@mui/icons-material/Save';
import React, * as Rect from 'react'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { ISelfRating } from "./ISelfRating";
import { selectSelfRatings, fetchSelfRatingAsync, createSelfRatingAsync, updateSelfRatingAsync, createIndependentSelfRatingAsync } from "./selfRatingSlice";
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

    const handleClick = async (ev: any, navTo: string) => {

        await handleClickSave();

        if (navTo === 'previous') {
            // No back button from first step
        } else {
            navigate(`/preliminary/${id}/fund`)
        }
    }

    async function handleClickSave() {
        console.log(selfRatingValue.id)
        if (!selfRatingValue.id) {
            if (Number(id)) {
                await dispatch(
                    createSelfRatingAsync(
                        wrapArgument(actionUid, { ...selfRatingValue, prelimApplicationId: Number(id) })
                    )
                ).unwrap();
            } else {
                await dispatch(
                    createIndependentSelfRatingAsync(
                        wrapArgument(actionUid, { ...selfRatingValue })
                    )
                ).unwrap();
            }
        } else {
            await dispatch(
                updateSelfRatingAsync(
                    wrapArgument(actionUid, { ...selfRatingValue, prelimApplicationId: Number(id) })
                )
            ).unwrap();
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

                                    {/* <Divider sx={{ mb: 3, opacity: 0.6 }} />

                                    <TextField
                                        fullWidth
                                        id={"q" + (i + 1).toString() + "Comments"}
                                        label="Comments (Optional)"
                                        value={getValue("q" + (i + 1).toString() + "Comments") || ''}
                                        variant="outlined"
                                        multiline
                                        maxRows={4}
                                        onChange={(e) => handleChange(e, (i + 1).toString() + "Comments")}
                                        placeholder="Add any additional context here..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                backgroundColor: 'rgba(54, 48, 98, 0.01)'
                                            }
                                        }}
                                    /> */}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </React.Fragment>)
        }
    }

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitClick = async () => {
        setIsLoading(true);
        try {
            await handleClickSave();
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextClick = async (e: any) => {
        setIsLoading(true);
        try {
            await handleClick(e, "next");
        } finally {
            setIsLoading(false);
        }
    };

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
                            Initial Assessment
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
                                            <RadioGroup
                                                row
                                                defaultValue="First Time Fund Manager"
                                            >
                                                <Grid item xs={3}>
                                                    <FormControlLabel
                                                        value={"First Time Fund Manager"}
                                                        control={<Radio color="primary" />}
                                                        label={<Typography variant="body2">First Time Fund Manager</Typography>}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControlLabel
                                                        value={"Managed >= One Fund"}
                                                        control={<Radio color="primary" />}
                                                        label={<Typography variant="body2">Managed {'>'}= One Fund</Typography>}
                                                    />
                                                </Grid>
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        {selfRatingQuestionComponents}
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* Sticky Save Icon will be handled outside this Box for screen positioning */}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {!isSubmitted ? (
                                <Button
                                    onClick={handleSubmitClick}
                                    variant="contained"
                                    disabled={isLoading}
                                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 6,
                                        py: 1.5,
                                        fontWeight: 700,
                                        backgroundColor: '#363062',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                                        '&:hover': {
                                            backgroundColor: '#4d4585',
                                            boxShadow: '0 6px 16px rgba(54, 48, 98, 0.3)'
                                        }
                                    }}
                                >
                                    Submit
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNextClick}
                                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                                    endIcon={!isLoading && <ArrowRightIcon />}
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 700,
                                        backgroundColor: '#363062',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                                        '&:hover': {
                                            backgroundColor: '#4d4585',
                                            boxShadow: '0 6px 16px rgba(54, 48, 98, 0.3)'
                                        }
                                    }} >
                                    Save & Continue to Fund Overview
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent >
            </Card >

            {/* Sticky Save Button */}
            <Box
                sx={{
                    position: 'fixed',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
            >
                <Button
                    onClick={(e) => !isSubmitted ? handleSubmitClick() : handleNextClick(e)}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                        minWidth: 'auto',
                        width: isLoading ? '80px' : '48px',
                        height: '48px',
                        borderRadius: '12px 0 0 12px',
                        backgroundColor: '#363062',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        boxShadow: '-2px 0 10px rgba(54, 48, 98, 0.3)',
                        '&:hover': {
                            backgroundColor: '#4d4585',
                            width: isLoading ? '80px' : '56px',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isLoading && <CircularProgress size={20} color="inherit" />}
                        <SaveIcon />
                    </Box>
                </Button>
            </Box>
        </div>
    );
}

export default SelfRating;
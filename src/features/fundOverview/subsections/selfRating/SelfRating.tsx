import { Card, CardContent, Typography, Grid, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, TextField, CircularProgress, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState, useEffect } from "react"
import { questionsForMoreThanOne } from './selfRatingQuestionsMoreThanOne'
import { questionsForFirstTime } from './selfRatingQuestionsFirstTime'
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SaveIcon from '@mui/icons-material/Save';
import React, * as Rect from 'react'
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { defaultIISelfRating, ISelfRating } from "./ISelfRating";
import { selectSelfRatings, fetchSelfRatingAsync, createSelfRatingAsync, updateSelfRatingAsync, createIndependentSelfRatingAsync } from "./selfRatingSlice";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import uuid from 'react-uuid';
import { FetchStatus } from "../../../../lib/api-status/IStatus";
import { selectUsers } from '../../../admin/adminSlice'
import { Controller } from "react-hook-form";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import useCookie, { getCookie } from 'react-use-cookie';



type InitialState = {
    selfRatingData: any
}

export const SelfRating = (props: any) => {

    const { id } = useParams();
    console.log(id)
    const [actionUid] = useState(uuid());

    const selfRatingState = useAppSelector(selectSelfRatings)

    const [selfRatingValue, setSelfRatingValue] = useState<ISelfRating>(selfRatingState.selfRatings);
    console.log("selfRatingValue", selfRatingValue)
    const [firstTime] = useState<boolean>(selfRatingState.selfRatings.id !== undefined);
    const [scoreBoard, setScoreBoard] = useState({} as any);
    const [score, setScore] = useState('0');
    const usersState = useAppSelector(selectUsers)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const controlSx = {
        color: '#FF671F',
        '&.Mui-checked': {
            color: '#FF671F',
        },
    };

    const getRefinedQuestions = (mType: string | undefined, aifType: string | undefined) => {
        const manager = mType || "First Time Fund Manager";
        const category = aifType || "Equity Oriented Fund";

        const questions = manager === "First Time Fund Manager"
            ? JSON.parse(JSON.stringify(questionsForFirstTime.selfRatingQuestions))
            : JSON.parse(JSON.stringify(questionsForMoreThanOne.selfRatingQuestions));

        const qIndices = manager === "First Time Fund Manager" ? [10] : [13, 14];

        if (category === "Debt Oriented Fund") {
            qIndices.forEach(idx => {
                if (questions[idx]) {
                    questions[idx].options = [">=18%", ">=15% & <18%", ">=12% & <15%", "<12%"];
                }
            });
        }
        return questions;
    };

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
        console.log("SelfRating data loaded:", selfRatingState.selfRatings);
        setSelfRatingValue(selfRatingState.selfRatings);

        // Initialize questions and scoreboard based on loaded data
        const currentManagerType = selfRatingState.selfRatings.managerType || "First Time Fund Manager";
        const currentOrientedType = selfRatingState.selfRatings.fundType || "Equity Oriented Fund";

        const questions = getRefinedQuestions(String(currentManagerType), String(currentOrientedType));

        setSelfQuestions(questions);
        setManagerType(currentManagerType);


        const newScoreBoard: any = {};
        questions.forEach((q: any, index: number) => {
            const answer = selfRatingState.selfRatings[`q${index + 1}` as keyof ISelfRating];
            if (answer) {
                const optIndex = q.options.indexOf(String(answer));
                if (optIndex !== -1) {
                    newScoreBoard[index] = {
                        weight: q.weightage[optIndex],
                        contribution: q.contribution
                    };
                }
            }
        });
        console.log("Initialized ScoreBoard:", newScoreBoard);
        setScoreBoard(newScoreBoard);

        // Set isSubmitted based on initial data
        const initialScore = Number(selfRatingState.selfRatings.score || 0);
        // if (selfRatingState.selfRatings.id && initialScore >= 0.7) {
        if (selfRatingState.selfRatings.id) {
            setIsSubmitted(true);
        } else {
            setIsSubmitted(false);
        }
    }, [selfRatingState.status.fetchStatus === FetchStatus.IDLE])

    useEffect(() => {
        updateScore()
        console.log("use Effect running due to scoreBoard change");
    }, [scoreBoard])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleClick = async (ev: any, navTo: string) => {
        try {
            await handleClickSave();

            if (navTo !== 'previous') {
                navigate(`/preliminary/${id}/fund`)
            }
        } catch (error: any) {
            console.error("Save failure:", error);
            alert(error?.message || "An unexpected error occurred while saving.");
        }
    }

    async function handleClickSave() {
        console.log(selfRatingValue.id)
        // console.log((!selfRatingValue.id))
        // console.log(id)
        try {
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
        } catch (error) {
            // Re-throw to be caught by callers (handleSubmitClick, handleClick)
            throw error;
        }
    }

    function calculateScore(v: any, sel: string, idx: number) {
        let i = v.options.indexOf(sel);
        let weight = v.weightage[i]
        console.log('calculateScore', v);
        let contribution = v.contribution
        let copiedValue = { ...scoreBoard };
        copiedValue[idx] = { weight, contribution };
        setScoreBoard(copiedValue);
    }
    function updateScore() {
        let sum = 0;
        let arr: { weight: number, contribution: number }[] = Object.values(scoreBoard)
        for (let i = 0; i < arr.length; i++) {
            let delta = arr[i] && arr[i].weight * arr[i].contribution;
            console.log('delta' + i, delta, sum)
            sum += delta || 0;
        }
        let sumStr = sum.toFixed(2);
        //setScore(sumStr)
        let copiedValue = { ...selfRatingValue };
        copiedValue['score'] = sumStr;
        setSelfRatingValue(copiedValue);
    }


    const handleChangeFundManagerType = (e: any) => {
        // ev.preventDefault();
        // let copiedValue = { ...formData }
        // let key = ev.target.id ? ev.target.id : ev.target.name;
        // copiedValue[key as keyof typeof formData] = ev.target.value;
        // setFormData(copiedValue);

        e.preventDefault?.();
        const copiedValue: any = { ...defaultIISelfRating };
        const key = e.target.id ? e.target.id : e.target.name;
        const newValue = e.target.value;
        copiedValue[key] = newValue;

        const mType = key === "managerType" ? newValue : (managerType || "First Time Fund Manager");
        const aifType = key === "fundType" ? newValue : (copiedValue.fundType || "Equity Oriented Fund");

        console.log("managerType", mType);
        setManagerType(mType);

        const questions = getRefinedQuestions(String(mType), String(aifType));
        setSelfQuestions(questions);

        setScoreBoard({});
        setSelfRatingValue(copiedValue);
        setIsSubmitted(false);
    };



    const handleChange = (e: any, idx: any) => {
        e.preventDefault();
        console.log('checking state value', selfRatingValue, e.target.value, idx)
        let copiedValue = { ...selfRatingValue };
        let key = "q" + idx;
        copiedValue[key as keyof ISelfRating] = e.target.value as any;
        // setValue(e.target.id, e.target.value);
        setSelfRatingValue(copiedValue);
        setIsSubmitted(false);
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

    const [managerType, setManagerType] = useState<String | undefined>(selfRatingValue.managerType)

    const [selfQuestions, setSelfQuestions] = useState(!managerType || managerType === "First Time Fund Manager" ?
        questionsForFirstTime.selfRatingQuestions : questionsForMoreThanOne.selfRatingQuestions);

    // determine if every question has been answered (mandatory fields)
    const allAnswered = React.useMemo(() => {
        if (!selfQuestions || selfQuestions.length === 0) return false;
        return selfQuestions.every((q, idx) => {
            const key = `q${idx + 1}` as keyof ISelfRating;
            const val = selfRatingValue[key];
            return val !== undefined && val !== null && String(val).trim() !== '';
        });
    }, [selfQuestions, selfRatingValue]);

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
                                            <Typography variant="subtitle1" className="question-text" sx={{ fontWeight: 700, color: '#000000', transition: 'color 0.2s ease' }}>
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
                                                        control={<Radio sx={{
                                                            color: 'primary',
                                                            '&.Mui-checked': {
                                                                color: '#FF671F',
                                                            },
                                                        }} />}
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
    const [showResultModal, setShowResultModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalType, setModalType] = useState<'success' | 'fail'>('success');

    const handleSubmitClick = async () => {
        setIsLoading(true);
        try {
            await handleClickSave();
            const currentScore = Number(selfRatingValue.score || 0);
            // alert(currentScore)
            // if (currentScore >= 0.7) {
            setModalType('success');
            setIsSubmitted(true);
            // } else {
            //     setModalType('fail');
            //     setIsSubmitted(false);
            // }
            setShowResultModal(true);
        } catch (error: any) {
            console.error("Submit failure:", error);
            alert(error?.message || "An unexpected error occurred while submitting.");
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
                borderRadius: '6px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <CardContent sx={{ p: 4, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
                        {/* <Card sx={{
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
                            <CardContent sx={{ p: 3, width: '100%' }}> */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(54, 48, 98, 0.02)',
                                    border: '1px dashed rgba(54, 48, 98, 0.2)'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000000' }}>
                                            First time IM/AMC?
                                        </Typography>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={managerType === "First Time Fund Manager" || !managerType}
                                                    onChange={(e) => {
                                                        const value = e.target.checked ? "First Time Fund Manager" : "Experienced Fund Manager";
                                                        handleChangeFundManagerType({ target: { name: "managerType", value } });
                                                    }}
                                                    color="primary"
                                                    sx={{
                                                        '& .MuiSwitch-switchBase': {
                                                            color: '#FF671F',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#FF671F',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#FF671F',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: managerType === "First Time Fund Manager" || !managerType ? '#000000' : '#666' }}>
                                                    {managerType === "First Time Fund Manager" || !managerType ? "Yes" : "No"}
                                                </Typography>
                                            }
                                        />
                                    </Box><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000000' }}>
                                            Type of Fund?
                                        </Typography>
                                        <RadioGroup
                                            row
                                            value={selfRatingValue.fundType || "Equity Oriented Fund"}
                                            name="fundType"
                                            onChange={(e) => {
                                                handleChangeFundManagerType(e);
                                            }}
                                        >
                                            <FormControlLabel value="Equity Oriented Fund" control={<Radio size="small" sx={controlSx} />} label="Equity Oriented Fund" />
                                            <FormControlLabel value="Debt Oriented Fund" control={<Radio size="small" sx={controlSx} />} label="Debt Oriented Fund" />
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        {/* </CardContent>
                        </Card> */}
                        {selfRatingQuestionComponents}
                        {/* <Card sx={{
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
                                        Score: {selfRatingValue.score || '-'} First Time: {firstTime === true ? "Yes" : "No"}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card> */}
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* Sticky Save Icon will be handled outside this Box for screen positioning */}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {!isSubmitted ? (
                                <Button
                                    onClick={() => setShowConfirmModal(true)}
                                    variant="contained"
                                    disabled={isLoading || !allAnswered}
                                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '6px',
                                        px: 6,
                                        py: 1.5,
                                        fontWeight: 700,
                                        backgroundColor: '#FF671F',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                                        '&:hover': {
                                            border: '1px solid #FF671F',
                                            color: '#FF671F',
                                            backgroundColor: 'rgb(255 103 30 / 19%)'
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
                                        borderRadius: '6px',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 700,
                                        backgroundColor: '#FF671F',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                                        '&:hover': {
                                            border: '1px solid #FF671F',
                                            color: '#FF671F',
                                            backgroundColor: 'rgb(255 103 30 / 19%)'
                                        }
                                    }} >
                                    Continue to Fund Information
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
                    onClick={(e) => !isSubmitted ? setShowConfirmModal(true) : handleNextClick(e)}
                    variant="contained"
                    disabled={isLoading || (!isSubmitted && !allAnswered)}
                    sx={{
                        minWidth: 'auto',
                        width: isLoading ? '80px' : '48px',
                        height: '48px',
                        borderRadius: '12px 0 0 12px',
                        backgroundColor: '#FF671F',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        boxShadow: '-2px 0 10px rgba(54, 48, 98, 0.3)',
                        '&:hover': {
                            border: '1px solid #FF671F',
                            color: '#FF671F',
                            backgroundColor: '#ffffff'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isLoading && <CircularProgress size={20} color="inherit" />}
                        <SaveIcon />
                    </Box>
                </Button>
            </Box>
            {/* Confirmation Modal */}
            <Dialog
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        p: 1,
                        maxWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#000000', pb: 1 }}>
                    Confirm Submission
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.6 }}>
                        Are you sure you want to proceed with submission?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button
                        onClick={() => setShowConfirmModal(false)}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '6px',
                            px: 3,
                            py: 1,
                            fontWeight: 700,
                            color: '#000000',
                            borderColor: '#FF671F'
                        }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => {
                            setShowConfirmModal(false);
                            handleSubmitClick();
                        }}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '6px',
                            px: 3,
                            py: 1,
                            fontWeight: 700,
                            backgroundColor: '#FF671F',
                            '&:hover': {
                                border: '1px solid #FF671F',
                                color: '#FF671F',
                                backgroundColor: 'rgb(255 103 30 / 19%)'
                            }
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assessment Result Modal */}
            <Dialog
                open={showResultModal}
                onClose={() => setShowResultModal(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        p: 1,
                        maxWidth: '500px'
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#000000', pb: 1 }}>
                    {modalType === 'success' ? 'Assessment Successful' : 'Assessment Result'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.6 }}>
                        {modalType === 'success'
                            ? "Thank you for your interest in the NPS Bharat Fund of Funds (NB-FoFs). We are happy to inform you that you have secured the minimum score to be eligible to apply for consideration under the NB-FoFs."
                            : "Thank you for your interest in the NPS Bharat Fund of Funds (NB-FoFs). We regret to inform you that you have not secured the minimum score to be eligible to apply for consideration under the NB-FoFs."
                        }
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    {modalType === 'success' ? (
                        <Button
                            onClick={(e) => {
                                setShowResultModal(false);
                                handleNextClick(e);
                            }}
                            variant="contained"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '6px',
                                px: 3,
                                py: 1,
                                fontWeight: 700,
                                backgroundColor: '#FF671F',
                                '&:hover': {
                                    border: '1px solid #FF671F',
                                    color: '#FF671F',
                                    backgroundColor: 'rgb(255 103 30 / 19%)'
                                }
                            }}
                        >
                            Continue to Fund Information
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowResultModal(false)}
                            variant="outlined"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '6px',
                                px: 4,
                                py: 1,
                                fontWeight: 700,
                                color: '#000000',
                                borderColor: '#FF671F'
                            }}
                        >
                            OK
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SelfRating;
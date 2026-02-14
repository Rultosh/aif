import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, Checkbox, FormGroup } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, * as Rect from 'react'
import { iteratorSymbol } from "immer/dist/internal";
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { fetchData, submitResults } from './declarationSlice'
import { getPrelimApplicationData, selectPrelimApplication, updatePrelimApplicationAsync } from "../fundOverviewData/prelimApplicationDataSlice";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import { defaultIPrelimApplicationData } from "../fundOverviewData/IPrelimApplicationData";
import uuid from 'react-uuid';
import { FetchStatus } from "../../../../lib/api-status/IStatus";

export const Declaration = (props: any) => {

    const { id } = useParams();

    const navigate = useNavigate()

    // const isAgreed = useAppSelector(state => state.declaration.agreed)

    const prelimApplicationState = useAppSelector(selectPrelimApplication)

    const [agreed, setAgreed] = useState<boolean>(!!prelimApplicationState.prelimApplication.declarationAccepted);

    console.log(agreed, !!prelimApplicationState.prelimApplication.declarationAccepted)

    const dispatch = useAppDispatch()

    const [actionUid] = useState(uuid());

    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'previous') {
            navigate(`/preliminary/${prelimApplicationState.prelimApplication.id}/selfRating`)
        } else {
            navigate(`/preliminary/${prelimApplicationState.prelimApplication.id}/preview`)
        }
    }

    useEffect(() => {
        if (props.checkUnAuth) {
            navigate('/login')
        }
    })

    useEffect(() => {
        window.scrollTo(0, 0)
        if (!prelimApplicationState.prelimApplication.id && id) {
            dispatch(getPrelimApplicationData(
                wrapArgument(actionUid, Number(id))
            ))
        }
    }, [])

    useEffect(() => {
        setAgreed(!!prelimApplicationState.prelimApplication.declarationAccepted)
    }, [prelimApplicationState.status.fetchStatus === FetchStatus.IDLE])

    function handleChange() {

        setAgreed(!agreed)
    }

    function handleClickSave() {
        console.log("prelimId", Number(id))
        const obj = { value: agreed }
        dispatch(
            updatePrelimApplicationAsync(
                wrapArgument(
                    actionUid, { ...defaultIPrelimApplicationData, id: Number(id), declarationAccepted: agreed }
                )
            )
        );
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
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#363062', mb: 3 }}>
                        Declaration
                    </Typography>

                    <Card sx={{
                        display: 'flex',
                        mt: 2,
                        backgroundColor: 'rgba(54, 48, 98, 0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(54, 48, 98, 0.1)'
                    }}>
                        <CardContent sx={{ p: 3, width: '100%' }}>
                            <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <CardContent sx={{ p: 0 }}>
                                    <Box sx={{ p: 3, backgroundColor: 'rgba(54, 48, 98, 0.04)' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#363062' }}>
                                            I / We (Partner/Directors) hereby declare that:
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body1" sx={{ display: 'flex', gap: 2, mb: 1, fontWeight: 600, color: '#363062' }}>
                                                <span>A.</span>
                                                The information given above and the statements and other papers enclosed are to the best of our knowledge and belief, true and correct in all particulars.
                                            </Typography>
                                            <Divider sx={{ my: 2, opacity: 0.5 }} />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body1" sx={{ display: 'flex', gap: 2, mb: 1, fontWeight: 600, color: '#363062' }}>
                                                <span>B.</span>
                                                There are no arrears of statutory dues and no government enquiries / proceedings / prosecution / legal action are pending/initiated against the Fund / Sponsor / AMC / Trustee Company / promoters / directors / partners except as indicated in the application.
                                            </Typography>
                                            <Divider sx={{ my: 2, opacity: 0.5 }} />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body1" sx={{ display: 'flex', gap: 2, mb: 1, fontWeight: 600, color: '#363062' }}>
                                                <span>C.</span>
                                                I / We also confirm that I / none of the Sponsors / promoters or directors or partners have at any time declared themselves as insolvent.
                                            </Typography>
                                            <Divider sx={{ my: 2, opacity: 0.5 }} />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body1" sx={{ display: 'flex', gap: 2, mb: 1, fontWeight: 600, color: '#363062' }}>
                                                <span>D.</span>
                                                I / We have no objection if SIDBI furnishes the information submitted by me/us to other banks / FIs / CIBIL / RBI / any other agency as may be deemed fit in connection with consideration of my/our application for capital commitment to the proposed venture capital fund.
                                            </Typography>
                                            <Divider sx={{ my: 2, opacity: 0.5 }} />
                                        </Box>

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="body1" sx={{ display: 'flex', gap: 2, mb: 1, fontWeight: 600, color: '#363062' }}>
                                                <span>E.</span>
                                                I / We have no objection if SIDBI and/or its representatives making necessary enquiries/verification (including in CIBIL or any other credit information agencies database) while considering my/our application for capital contribution. I / We undertake to furnish all other information that may be required by SIDBI in connection with my/our application for capital commitment.
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            backgroundColor: agreed ? 'rgba(76, 175, 80, 0.08)' : 'rgba(54, 48, 98, 0.04)',
                                            p: 2,
                                            borderRadius: '12px',
                                            border: agreed ? '1px solid rgba(76, 175, 80, 0.2)' : '1px solid rgba(54, 48, 98, 0.1)',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox checked={!!agreed} onChange={handleChange} color="success" />}
                                                    label={<Typography sx={{ fontWeight: 700, color: agreed ? '#2e7d32' : '#363062' }}>
                                                        I Accept and Agree to the above Declaration
                                                    </Typography>}
                                                />
                                            </FormGroup>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
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
                            Back to Self Rating
                        </Button>

                        <Box>
                            <Button
                                color='success'
                                onClick={handleClickSave}
                                disabled={!agreed}
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
                                    mr: 2,
                                    '&.Mui-disabled': {
                                        backgroundColor: 'rgba(0,0,0,0.12)'
                                    }
                                }} >
                                Save
                            </Button>

                            <Button
                                onClick={(e) => handleClick(e, "next")}
                                disabled={!agreed}
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
                                    },
                                    '&.Mui-disabled': {
                                        backgroundColor: 'rgba(0,0,0,0.12)'
                                    }
                                }} >
                                Preview
                            </Button>
                        </Box>
                    </Box>
                </CardContent >
            </Card >
        </div>
    );
}


export default Declaration;
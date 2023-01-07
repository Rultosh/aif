import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, Checkbox, FormGroup, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, * as Rect from 'react'
import { iteratorSymbol } from "immer/dist/internal";
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { getPrelimApplicationData, selectPrelimApplication, updatePrelimApplicationAsync } from "../fundOverviewData/prelimApplicationDataSlice";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import { defaultIPrelimApplicationData } from "../fundOverviewData/IPrelimApplicationData";
import uuid from 'react-uuid';
import { FetchStatus } from "../../../../lib/api-status/IStatus";
import DocumentChip from "../../../../components/DocumentChip";

export const Preview = () => {

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
            navigate(`/preliminary/${prelimApplicationState.prelimApplication.id}/declaration`)
        }
    }

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
        <Card sx={{ display: 'flex', mb: 2 }}>
            <CardContent sx={{ flex: 1 }}>

                <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Preview</Typography>
                <Card sx={{ display: 'flex', mt: 2, backgroundColor: "#f2f2f2" }}>
                    <CardContent sx={{ flex: 1 }}>

                        <Card>
                            <CardContent>

                            </CardContent>
                        </Card>



                    </CardContent>
                </Card>

                <Card sx={{ display: 'flex', mt: 2, backgroundColor: "#f2f2f2" }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography sx={{ flex: 1, mb: 1 }}>Please follow below steps:</Typography>
                        <Divider color='#363062' sx={{ mb: 2 }} />
                        <Card sx={{mb:2}}>
                            <CardContent>
                                <Typography sx={{ flex: 1, mb: 1 }}>1. Download Application</Typography>
                                <Typography sx={{ flex: 1, mb: 1 }}>2. Either digitally sign the application and upload Digitally Signed Application</Typography>
                                <Typography sx={{ flex: 1, }}>3. Or Upload Digital Certificate and manually Signed application on letter head of IM/AMC</Typography>

                            </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex' }}>
                            <div style={{ margin: '5px' }}>
                                <DocumentChip
                                    label="Download Applicaton"
                                    id={''} />
                            </div>
                            <div style={{ margin: '5px' }}>
                                <DocumentChip
                                    label="Upload Digitally Signed Application"
                                    id={''} />
                            </div>
                            <div style={{ margin: '5px' }}>
                                <DocumentChip
                                    label="Upload Digital Certificates"
                                    id={''} />
                            </div>
                            <div style={{ margin: '5px' }}>
                                <DocumentChip
                                    label="Upload"
                                    id={''} />
                            </div>
                        </Box>
                        <TextField
                            required
                            id="previewComments"
                            label="Leave a comment"
                            //defaultValue={formData.commitmentReceived === undefined ? " " : formData["commitmentReceived"]}
                            //value={formData["commitmentReceived"] || ''}
                            variant="standard"
                            // onChange={handleChange}

                            sx={{ display: 'flex',  }}
                        />


                    </CardContent>
                </Card>


                <Button onClick={(e) => handleClick(e, "previous")} startIcon={<ArrowLeftIcon />} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Declaration
                </Button>

                <Button color='success' onClick={handleClickSave} disabled={!agreed} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Submit
                </Button>



            </CardContent >
        </Card >
    );
}


export default Preview;
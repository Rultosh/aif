import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Chip, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, Checkbox, FormGroup } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, * as Rect from 'react'
import { iteratorSymbol } from "immer/dist/internal";
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import {fetchData,submitResults} from  './declarationSlice'
import { getPrelimApplicationData, selectPrelimApplication, updatePrelimApplicationAsync } from "../fundOverviewData/prelimApplicationDataSlice";
import { wrapArgument } from "../../../../lib/api-status/actionWrapper";
import { defaultIPrelimApplicationData } from "../fundOverviewData/IPrelimApplicationData";
import uuid from 'react-uuid';
import { FetchStatus } from "../../../../lib/api-status/IStatus";

export const Declaration = () => {

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
        window.scrollTo(0, 0)
        if(!prelimApplicationState.prelimApplication.id && id) {
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

    function handleClickSave(){
        console.log("prelimId", Number(id))
        const obj = {value:agreed}
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

                <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Declaration</Typography>
                <Card sx={{ display: 'flex', mt: 2, backgroundColor: "#f2f2f2" }}>
                    <CardContent sx={{ flex: 1 }}>

                        <Card>
                            <CardContent>
                                <Typography sx={{ flex: 1, fontWeight: 'bold' }}>I / We (Partner/Directors) hereby declare that</Typography>
                                <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>A.  The information given above and the statements and other papers enclosed are to be the best of our knowledge and belief,true and correct in all particulars.</Typography>
                                <Divider />
                                <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>B.  There are no arrears of statutory dues and no government enquiries/proceedings/prosecution/legal acrtion are pending/initiated against the Fund / Sponsor/ AMC / Trustee Company / promoters / directors / partners except as indicated in the application.</Typography>
                                <Divider />
                                <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>C.  I / We also confirm that I/none of the Sponsors / promoters or directors or partners have at any time declared themselves as insolvent;</Typography>
                                <Divider />
                                <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>D.  I / We have no objection if SIDBI furnishes the information submitted by me/us to other banks /FIs/CIBIL/RBI/any other agency may be deemed fit in connection with considaration of my.our application for capital Commitment to the proposed venture capital fund.</Typography>
                                <Divider />
                                <Typography sx={{ flex: 1, mt: 2, mb: 2 }}>E.  I / We have no objection if SIDBI and/or its representatives making necessary enquiries/verification (incuding in CIBIL or any other credit information agencies database) while considering my/our application for capital contribution. I / We undertake to furnish all other information that may be by SIDBI in connection with my/ our application for capital Commitment.</Typography>
                                <Divider />
                                <FormGroup>
                                    <FormControlLabel sx={{mt:2}} control={
                                        <Checkbox  checked={!!agreed}  onChange={handleChange}/>} 
                                        label= {<Typography sx={{ flex: 1, fontWeight: 'bold' }}>
                                            I / We (Partner/Directors) hereby declare that</Typography>} />
                                </FormGroup>
                            </CardContent>
                        </Card>



                    </CardContent>
                </Card>


                <Button onClick={(e) => handleClick(e, "previous")} startIcon={<ArrowLeftIcon />} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Self Rating
                </Button>
                
                <Button color='success' onClick={handleClickSave} disabled={!agreed} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Save
                </Button>

                <Button onClick={(e) => handleClick(e, "next")} disabled={!agreed} endIcon={<ArrowRightIcon />} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                    Preview
                </Button>

            </CardContent >
        </Card >
    );
}


export default Declaration;
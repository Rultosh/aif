import { IconButton, Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Box, Button, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, TextField, FormControlLabel, Switch, Checkbox, FormGroup } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SideNavBar from '../SideNavBar'
import { useParams } from "react-router-dom";
import { updateNavIndex } from '../sideNavBarSlice'
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import DocumentUpload from "../../../../components/DocumentUpload";
import uuid from "react-uuid";
import ListFiles from "../../../../components/ListFiles";
import SaveIcon from '@mui/icons-material/Save';

export const DetailedApplication2J = (props: any) => {

    const params = useParams()
    const parentId  = Number(params.id)
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState<string | false>(false);
    const [agreed, setAgreed] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })
    

    useEffect(() => {
        dispatch(updateNavIndex(9))

    })

    const handleSave = () => {
        
    }


    const handleClick = (ev: any, navTo: string) => {
        if (navTo === 'next') {
            navigate(`/Detailed/${parentId}/detailed2K`);
        }
        else {
            navigate(`/Detailed/${parentId}/detailed2I`);
        }
    }

    function handleChange() {

        setAgreed(!agreed)
    }

    const [uploadAnnexure1SuccessRefreshId, setUploadAnnexure1Success] = useState(uuid());
    const uploadAnnexure1Success = () => {
        setUploadAnnexure1Success(uuid());
    }

    const [uploadAnnexure2SuccessRefreshId, setUploadAnnexure2Success] = useState(uuid());
    const uploadAnnexure2Success = () => {
        setUploadAnnexure2Success(uuid());
    }

    const [uploadAnnexure3SuccessRefreshId, setUploadAnnexure3Success] = useState(uuid());
    const uploadAnnexure3Success = () => {
        setUploadAnnexure3Success(uuid());
    }

    const [uploadResolutionRefreshId, setUploadResolutionRefreshId] = useState(uuid());
    const uploadResolutionSuccess = () => {
        setUploadResolutionRefreshId(uuid());
    }

    return (<>
        <SideNavBar></SideNavBar>
        <Grid item xs={9}>
            <Card sx={{ display: 'flex', mb: 2 }}>
                <CardContent sx={{ flex: 1 }}>

                <Grid container spacing={2} >
                        <Grid item xs={11}>
                            <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2 }}>Detailed Application</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            {/*} <IconButton onClick={handleSave} style={{ float: 'right' }} sx={{ position: 'fixed', backgroundColor: '#D586F7', display: 'flex', borderRadius: '8%', cursor: 'pointer' }}>
                                <SaveIcon  ></SaveIcon>
    </IconButton>*/}
                            <Button
                                onClick={handleSave}
                                endIcon={<SaveIcon />}
                                variant="contained"
                                disableElevation
                                color='success'
                                sx={{ textTransform: 'none', position: 'fixed'}} >
                                Save
                            </Button>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                    <Typography sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mb: 2, mt: 2 }}>J. KYC Details and Undertakings</Typography>

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>53. Details of Board of Directors of Trustee Company, AMC, Sponsor, Advisory Board, Members of IC, I nvestment/Management Team to be provided in the format attached (Annexure I) for verification of Defaulter's Checklist.</Typography>
                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                href="/templates/Fundname_Annexure I.doc"
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Download Annexure - I
                            </Button>
                            {/* <Button href="/templates/SASF_Fund Track Record Template.xlsx">Download Template</Button> */}
                        </Grid>
                        <Grid item xs={4}>
                            <DocumentUpload id={`uploadAnnexure1${parentId}`} onSuccess={uploadAnnexure1Success}>
                                <Button
                                    //onClick={(e) => handleClick(e, "previous")}
                                    startIcon={<FileUploadIcon />}
                                    variant="contained"
                                    disableElevation
                                    sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                    Upload Annexure - I
                                </Button>
                            </DocumentUpload>
                            <div style={{ margin: "10px" }}>
                                <ListFiles
                                    id={`uploadAnnexure1${parentId}`} refreshId={uploadAnnexure1SuccessRefreshId} />
                            </div>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>54. Whether provision of the connected lending by the select all-India Financial Institutions (Fls) of RBI vide letter dated December 21, 2002 attracted, (Annexure II).</Typography>
                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                href="/templates/Fundname_Annexure II.zip"
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Download Annexure - II
                            </Button>

                        </Grid>
                        <Grid item xs={4}>
                            <DocumentUpload id={`uploadAnnexure2${parentId}`}
                                onSuccess={uploadAnnexure2Success}>
                                <Button
                                    //onClick={(e) => handleClick(e, "previous")}
                                    startIcon={<FileUploadIcon />}
                                    variant="contained"
                                    disableElevation
                                    sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                    Upload Annexure - II
                                </Button>
                            </DocumentUpload>
                            <div style={{ margin: "10px" }}>
                                <ListFiles
                                    id={`uploadAnnexure2${parentId}`} refreshId={uploadAnnexure2SuccessRefreshId} />
                            </div>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />

                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>55. KYC Form of the Board of Directors of Trustee Company, AMC, Sponsor, Advisory Board, Members of IC, Investment/Management Team to be provided in the format attached in Annexure III. Along with the self-attested copy of POI (Proof of Identity), POA (Proof of address permanent and correspondent), Two passport size photograph for purpose of KYC.</Typography>
                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                href="/templates/Annexure III_SIDBI KYC.zip"
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Download Annexure - III
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                        <DocumentUpload id={`uploadAnnexure3${parentId}`}
                                onSuccess={uploadAnnexure3Success}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileUploadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Upload Annexure - III
                            </Button>
                            </DocumentUpload>
                            <div style={{ margin: "10px" }}>
                                <ListFiles
                                    id={`uploadAnnexure3${parentId}`} refreshId={uploadAnnexure3SuccessRefreshId} />
                            </div>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="body2" sx={{ flex: 1, color: '#363062', mb: 2, mt: 2, ml: 2 }}>56. Board resolution or the requisite documents for such authorization to submit application on behalf of the IM</Typography>
                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Download
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                        <DocumentUpload id={`uploadResolution${parentId}`}
                                onSuccess={uploadResolutionSuccess}>
                            <Button
                                //onClick={(e) => handleClick(e, "previous")}
                                startIcon={<FileUploadIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ backgroundColor: '#363062', textTransform: 'none', mt: 3, mb: 3, ml: 2, width: '70%', height: '30px' }} >
                                Upload
                            </Button>
                            </DocumentUpload>
                            <div style={{ margin: "10px" }}>
                                <ListFiles
                                    id={`uploadResolution${parentId}`} refreshId={uploadResolutionRefreshId} />
                            </div>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />


                    <Grid container xs={12}>
                        <Grid item xs={4}>
                            <Button
                                onClick={(e) => handleClick(e, "previous")}
                                startIcon={<ArrowLeftIcon />}
                                variant="contained"
                                disableElevation
                                sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={4} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center' }}>Step 2(J) of 5</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={4} sx={{ justifyContent: 'right' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <Button
                                    onClick={(e) => handleClick(e, "next")}
                                    endIcon={<ArrowRightIcon />}
                                    variant="contained"
                                    disableElevation
                                    sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2, mr: 2 }} >
                                    Next
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    </>
    );
}


export default DetailedApplication2J;
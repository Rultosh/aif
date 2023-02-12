import { Modal, Box, Card, CardContent, Typography, Divider, TextField, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { defaultIQueryResolution, IQueryResolution } from "./IQueryResolution";
import { fetchQuriesAsync, postQuriesAsync, selectqueryResolution } from './queryResolutionSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { FetchStatus } from "../../lib/api-status/IStatus";
import { selectUsers } from '../admin/adminSlice'

export const QueryResolutionModal = (props: any) => {

    const id = props?.prelimDetails?.id
    const [formData, setFormData] = useState(defaultIQueryResolution);
    const [formDataList, setFormDataList] = useState([] as any);
    const state = useAppSelector(selectqueryResolution)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const usersState = useAppSelector(selectUsers)


    useEffect(() => {
        console.log('calling fetchQuriesAsync');
        dispatch(fetchQuriesAsync(
            wrapArgument(actionUid, id)
        ))

    }, [state.actionStatus.fetchStatus === FetchStatus.IDLE, state.status.fetchStatus == FetchStatus.IDLE])

    function handleSubmit(){
        
        dispatch(postQuriesAsync(
            wrapArgument(actionUid, formData)
        ))
        setFormData(defaultIQueryResolution)
    }

    const handleChange = (ev: any) => {
        ev.preventDefault();
        let copiedValue = { ...formData }
        copiedValue.query = ev.target.value;
        copiedValue.id = id;
        setFormData(copiedValue);
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className= "special_modal"
    >
        <Box sx={style}>
            <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
            <Typography variant="subtitle1" sx={{ flex: 1,fontWeight: 'bolder', color: '#363062', mb: 2 }}>{"To: " +  (usersState.role === 'ADMIN' ? props?.prelimDetails?.createdByName || "User" : 'VCF ADMIN')}</Typography>
            <Divider sx={{ mb: 2 }} />
                <Card sx={{ display: 'flex', background: '#f2f2f2' }}>
                    
                    <CardContent sx={{ flex: 1 }}>
                        {state?.queries?.map((q: IQueryResolution) => (
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 'bolder', color: '#363062', mt: 2 }}>{q.query}</Typography>
                                <Typography variant="caption" sx={{ flex: 1, color: '#363062', mb: 2 }}>{"by "+q.createdByName+" on " + q.createdOn}</Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Box>
                        ))}

                    </CardContent>
                </Card>

                <Card sx={{ mt: 2, display: 'flex', background: '#f2f2f2' }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Grid container xs={12}>
                            <Grid item xs={11}>
                                <TextField
                                    required
                                    id="query"
                                    label={usersState.role == 'USER' ? "Add a new Query" : "Provide a Resolution for the Query"}
                                    //defaultValue={formData.fundLaunchedDate === undefined ? " " : formData["fundLaunchedDate"]}
                                    value={formData["query"] || ''}
                                    variant="standard"
                                    onChange={handleChange}

                                    sx={{ display: 'flex', ml: 2 }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Button
                                    onClick={handleSubmit}
                                    //startIcon={<ArrowLeftIcon />}
                                    variant="contained"
                                    disableElevation
                                    sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

            </Box>
        </Box>
    </Modal>
}

export default QueryResolutionModal;
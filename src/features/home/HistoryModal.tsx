import { Modal, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { defaultIQueryResolution, IQueryResolution } from "./IQueryResolution";
import { fetchQuriesAsync, postQuriesAsync, selectqueryResolution } from './queryResolutionSlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { FetchStatus } from "../../lib/api-status/IStatus";

export const QueryResolutionModal = (props: any) => {

    const id = props?.prelimDetails?.id
    const [formData, setFormData] = useState(defaultIQueryResolution);
    const [formDataList, setFormDataList] = useState([] as any);
    const state = useAppSelector(selectqueryResolution)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const navigate = useNavigate();


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
                {/* <TableContainer component={Paper}  >
                    <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                        <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                            <TableRow>
                                {headerComponent}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                prelimApplications.prelimApplications ? prelimApplications.prelimApplications.map((row) => {
                                    return <TableRow key={`${row.nameOfTheFund}`}>
                                        {row.stage === "PRELIM" ? <TableCell align="center" component="th" scope="row">
                                            <a href={`/preliminary/${row.id}/${String(getPath(row.status))}`}>{row.nameOfTheFund}</a>
                                        </TableCell> : <TableCell align="center" component="th" scope="row">
                                            <a href={`/detailed/${row.detailedApplicationId}/SidbiReference`}>{row.nameOfTheFund}</a>
                                        </TableCell>}
                                        <TableCell align="center">{row.investmentManager}</TableCell>
                                        <TableCell align="center">{String(getStatusDescription(row.stage, row.status))}</TableCell>
                                        <TableCell align="center">{row.detailedApplicationCreatedOn}</TableCell>
                                        <TableCell align="center">{Moment(String(row.createdOn)).format("DD/MM/YYYY")}</TableCell>
                                        <TableCell align="center">{String(row.sdTotalTargetCorpus)}</TableCell>
                                        <TableCell align="center">{String(row.contributionSought || 0)}</TableCell>
                                        {row.stage === "PRELIM" ? <TableCell align="center" component="th" scope="row">
                                            <Tooltip title="Download">
                                                <IconButton>
                                                    <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadPreview?access_token=${localStorage.getItem('token')}`)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download All">
                                                <IconButton>
                                                    <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/prelims/${row.id}/downloadAsZip?access_token=${localStorage.getItem('token')}`)} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell> : <TableCell align="center" component="th" scope="row">
                                            <Tooltip title="Download">
                                                <IconButton>
                                                    <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/detailedApplications/${row.detailedApplicationId}/downloadPreview?access_token=${localStorage.getItem('token')}`)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download All">
                                                <IconButton>
                                                    <FileDownloadIcon onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/api/detailedApplications/${row.detailedApplicationId}/downloadAsZip?access_token=${localStorage.getItem('token')}`)} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>}
                                        <TableCell align="center"><MailIcon onClick={() => openModel(row)} ></MailIcon></TableCell>
                                        <TableCell align="center"><HistoryIcon onClick={() => openModelHistory(row)} ></HistoryIcon></TableCell>
                                        <TableCell align="center">
                                            <Grid container xs={12} spacing={0.5}>
                                                <Grid item >
                                                    <Tooltip title={row.stage == 'PRELIM' ? "Preliminary application - " + row.status : "Preliminary application - APPROVED"}>
                                                        <Box
                                                            component="img"
                                                            sx={{ width: '15px', height: '15px', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                            alt="success"
                                                            src={row.stage == 'PRELIM' ? getStatusImg(row) : greenImg}
                                                        />
                                                    </Tooltip>
                                                </Grid>
                                                {row.stage == 'DETAILED' ? 
                                                <Grid item >
                                                    <Tooltip title={"Detailed application - " + row.status}>
                                                        <Box
                                                            component="img"
                                                            sx={{ width: '15px', height: '15px', position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
                                                            alt="success"
                                                            src={getStatusImg(row)}
                                                        />
                                                    </Tooltip>
                                                </Grid> : <></>}

                                            </Grid>
                                        </TableCell>

                                    </TableRow>
                                }) : <></>
                            }
                        </TableBody>
                    </Table>
                </TableContainer> */}
            </Box>
        </Box>
    </Modal>
}

export default QueryResolutionModal;
import React, * as Rect from 'react'
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

    const tableHeaders = [
        "Stage",
        "Status",
        "Created On",
        "Remarks"]

    let headerComponent = []

    for (let i = 0; i < tableHeaders.length; i++) {
        headerComponent.push(
            <React.Fragment >
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{tableHeaders[i]}</TableCell>
            </React.Fragment>)
    }

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
                                        <TableCell align="center">{row.investmentManager}</TableCell>
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
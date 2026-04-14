import { Modal, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import uuid from "react-uuid";
import dayjs from "dayjs";
import { IHistory } from "./IHistory";
import { fetchHistoryAsync, selecthistory } from './historySlice'
import { wrapArgument } from "../../lib/api-status/actionWrapper";
import { FetchStatus } from "../../lib/api-status/IStatus";
import { selectUsers } from '../admin/adminSlice'
import React, * as Rect from 'react'

export const HistoryModal = (props: any) => {

    const id = props?.prelimDetails?.id
    const state = useAppSelector(selecthistory)
    const [actionUid] = useState(uuid())
    const dispatch = useAppDispatch()
    const usersState = useAppSelector(selectUsers)


    useEffect(() => {
        if (!props.open || !id) return;
        dispatch(fetchHistoryAsync(
            wrapArgument(actionUid, String(id))
        ));
    }, [props.open, id])

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
        // "Stage",
        "Status",
        "Created On",
        "Remarks",
        "Document"]

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
        className="special_modal"
    >
        <Box sx={style}>
            <Box sx={{ backgroundColor: 'white', borderRadius: 1, }}>
                <TableContainer>
                    <Table sx={{ minWidth: 700, mt: 1, mb: 1 }} aria-label="customized table">
                        <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                            <TableRow>
                                {headerComponent}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state?.histories ? state?.histories?.map((row: IHistory) => (
                                <TableRow key={`${row.id}`}>
                                    {/* <TableCell align="center">{row.stage}</TableCell> */}
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">
                                        {row.createdOn ? dayjs(row.createdOn).format("DD MMM YYYY") : "-"}
                                    </TableCell>
                                    <TableCell align="center">{row.remarks || '-'}</TableCell>
                                    <TableCell align="center">
                                        {row.attachmentBucket && row.attachmentName ? (
                                            <a
                                                href={`${process.env.REACT_APP_FILE_SERVER_URL || process.env.REACT_APP_API_BASE_URL}/files/${row.attachmentBucket}/${row.attachmentName}?access_token=${localStorage.getItem('token')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View
                                            </a>
                                        ) : '-'}
                                    </TableCell>
                                </TableRow>
                            )) : <>
                                <TableRow>
                                    <TableCell align="center" colSpan={5}>No Rows To Display</TableCell>
                                </TableRow> </>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    </Modal>
}

export default HistoryModal;
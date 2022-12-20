import { useAppSelector } from '../../../../../app/hooks';
import { Delete, Edit } from '@mui/icons-material'
import { Box, Grid, Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import React, { useEffect } from "react"
import { useState } from "react"
import { Controller } from '../../../../../lib/api-wrappers/Controller';
import { defaultIIIndependentReferences, IIndependentReferences } from './IIndependentReferences'
import { IndependentReferencesModel } from './IndependentReferencesModel';
import { independentReferencesThunk, selectIndependentReferences } from './independentReferencesSlice';
import ErrorIcon from '@material-ui/icons/Error';
import uuid from "react-uuid";

interface IndependentReferencesRowProps {
  independentReferences: IIndependentReferences,
  sharedController: Controller<IIndependentReferences>
}

export const IndependentReferencesRow = (props: IndependentReferencesRowProps) => {
  const [independentReferences, setIndependentReferences] = useState(props.independentReferences)
  const state = useAppSelector(selectIndependentReferences);
  const actionId = useState(uuid());
  const [controller] = useState(new Controller(actionId, independentReferencesThunk));
  const [action, setAction] = useState('')

  useEffect(() => {
    let updatedState =
      controller.data(state, props.independentReferences)
    if (updatedState)
      setIndependentReferences(
        updatedState
      )

  }, [controller.data(state, props.independentReferences)])



  function handleDelete() {
    setAction('Deleting...')
    controller.delete(independentReferences)
  }

  const [open, setOpen] = useState(false);

  function handleOpen() {
    setAction('Updating...')
    setOpen(true);
  }

  if (controller.isActionCompleted(props.independentReferences.parentId, state) ||
    controller.isActionError(props.independentReferences.parentId, state)) {
    return <><TableRow key={independentReferences.id}>
      <TableCell align="center" component="th" scope="row">
        {independentReferences.nameOfCompany}
      </TableCell>
      <TableCell align="center">{independentReferences.designation}</TableCell>
      <TableCell align="center">{independentReferences.organisation}</TableCell>
      <TableCell align="center">{independentReferences.telephoneNo}</TableCell>
      <TableCell align="center">{independentReferences.mobileNo}</TableCell>
      <TableCell align="center">{independentReferences.email}</TableCell>
      <TableCell align="center">{independentReferences.alternateEmail}</TableCell>
      <TableCell align="center">
        {controller.isActionError(props.independentReferences.parentId, state)?
        <Tooltip style={{color:"red"}} title={controller.error(props.independentReferences.parentId, state)}>
        <IconButton>
          <ErrorIcon />
        </IconButton>
      </Tooltip>:<></>}
        <Edit onClick={handleOpen} />&nbsp;
        <Delete onClick={handleDelete}></Delete>
      </TableCell>
    </TableRow>
      <IndependentReferencesModel
        independentReference={independentReferences}
        sharedController={controller}
        open={open}
        add={false}
        onClose={setOpen} /></>
  } else {
    return <div style={{ margin: "10px" }}>{action}</div>
  }
}
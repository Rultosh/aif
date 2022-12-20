import React, * as Rect from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { wrapArgument } from '../../../../../lib/api-status/actionWrapper';
import { getAllTeamMembersAsnyc, selectTeamMembers } from './teamMemberSlice';
import { defaultTeamMember, ITeamMember } from "./ITeamMember";
import uuid from "react-uuid";
import { useEffect, useState } from 'react';
import { TeamMemberModel } from './TeamMemberModel';
import { Button } from '@mui/material';
import { FetchStatus } from '../../../../../lib/api-status/IStatus';
import { TeamMemberRow } from './TeamMemberRow';

export const TeamMemberList = () => {
    const { id } = useParams();
    const [actionUid] = useState(uuid());
    const teamMembersState = useAppSelector(selectTeamMembers);

    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);

    function openModel() {
        setOpen(true);
    }

    useEffect(() => {
        console.log(id);
        if (Number(id)) {
            dispatch(getAllTeamMembersAsnyc(
                wrapArgument(actionUid, Number(id))
            ))
        }
    }, [teamMembersState.actionStatus.fetchStatus === FetchStatus.IDLE])

    return (<div>
    {teamMembersState.teamMembers.length > 0?
        teamMembersState.teamMembers.map((teamMember : ITeamMember) => {
            return (<TeamMemberRow teamMember={teamMember}/>)
        }):<></>}
        <Button onClick={openModel} variant="contained" disableElevation sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
            Add new team member
        </Button>
        <TeamMemberModel 
            teamMember={defaultTeamMember} 
            open={open}
            onClose={setOpen}/>
    </div>)
}
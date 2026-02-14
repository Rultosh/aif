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
import { useNavigate } from 'react-router-dom';

export const TeamMemberList = (props: any) => {
    const { id } = useParams();
    const [actionUid] = useState(uuid());
    const teamMembersState = useAppSelector(selectTeamMembers);
    const navigate = useNavigate()

    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);

    function openModel() {
        setOpen(true);
    }

    useEffect(() => {
        if (props.checkUnAuth) {
            navigate('/login')
        }
    })

    useEffect(() => {
        console.log(id);
        if (Number(id)) {
            dispatch(getAllTeamMembersAsnyc(
                wrapArgument(actionUid, Number(id))
            ))
        }
    }, [teamMembersState.actionStatus.fetchStatus === FetchStatus.IDLE])

    return (<div>
        {teamMembersState.teamMembers.length > 0 ?
            teamMembersState.teamMembers.map((teamMember: ITeamMember) => {
                return (<TeamMemberRow teamMember={teamMember} />)
            }) : <></>}
        <Button
            onClick={openModel}
            variant="outlined"
            sx={{
                textTransform: 'none',
                mt: 2,
                borderRadius: '8px',
                fontWeight: 600,
                color: '#363062',
                borderColor: 'rgba(54, 48, 98, 0.4)',
                borderStyle: 'dashed',
                borderWidth: '2px',
                width: '100%',
                py: 2,
                '&:hover': {
                    borderColor: '#363062',
                    backgroundColor: 'rgba(54, 48, 98, 0.04)',
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                }
            }}
        >
            + Add New Team Member
        </Button>
        <TeamMemberModel
            teamMember={defaultTeamMember}
            open={open}
            onClose={setOpen} />
    </div>)
}
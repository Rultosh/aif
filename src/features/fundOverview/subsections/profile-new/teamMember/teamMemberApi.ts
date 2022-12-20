import api from "../../../../../app/api";
import { ITeamMember } from "./ITeamMember";

export function getAllTeamMembers(prelimAppId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/prelims/${prelimAppId}/teamMembers`
  });
}

export function createTeamMember(teamMember:ITeamMember) {
  return api({
    method: 'post',
    data: teamMember,
    url: `api/prelims/${teamMember.prelimApplicationId}/teamMembers`
  });
}

export function updateTeamMember(teamMember:ITeamMember) {
  return api({
    method: 'patch',
    data: teamMember,
    url: `api/prelims/${teamMember.prelimApplicationId}/teamMembers/${teamMember.id}`
  });
}

export function deleteTeamMember(teamMember:ITeamMember) {
  return api({
    method: 'delete',
    url: `api/prelims/${teamMember.prelimApplicationId}/teamMembers/${teamMember.id}`
  });
}

import api from "../../../../../app/api";
import { ICompanyContactDetails } from "./ICompanyContactDetails";

export function getAllCompanyContactDetails(teamMemberId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/teamMembers/${teamMemberId}/companyContactDetails`
  });
}

export function createCompanyContactDetails(investment:ICompanyContactDetails) {
  return api({
    method: 'post',
    data: investment,
    url: `api/teamMembers/${investment.teamMemberId}/companyContactDetails`
  });
}

export function updateCompanyContactDetails(investment:ICompanyContactDetails) {
  return api({
    method: 'patch',
    data: investment,
    url: `api/teamMembers/${investment.teamMemberId}/companyContactDetails/${investment.id}`
  });
}

export function deleteCompanyContactDetails(investment:ICompanyContactDetails) {
  return api({
    method: 'delete',
    url: `api/teamMembers/${investment.teamMemberId}/companyContactDetails/${investment.id}`
  });
}

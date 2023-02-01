import api from "../../../../../app/api";
import { ICompanyContactDetails } from "./ICompanyContactDetails";

export function getAllCompanyContactDetails(teamMemberId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/teamMembers/${teamMemberId}/companyContactDetails`
  });
}

export function createCompanyContactDetails(companyDetails:ICompanyContactDetails) {
  return api({
    method: 'post',
    data: companyDetails,
    url: `api/teamMembers/${companyDetails.teamMemberId}/companyContactDetails`
  });
}

export function updateCompanyContactDetails(companyDetails:ICompanyContactDetails) {
  return api({
    method: 'patch',
    data: companyDetails,
    url: `api/teamMembers/${companyDetails.teamMemberId}/companyContactDetails/${companyDetails.id}`
  });
}

export function deleteCompanyContactDetails(companyDetails:ICompanyContactDetails) {
  return api({
    method: 'delete',
    url: `api/teamMembers/${companyDetails.teamMemberId}/companyContactDetails/${companyDetails.id}`
  });
}

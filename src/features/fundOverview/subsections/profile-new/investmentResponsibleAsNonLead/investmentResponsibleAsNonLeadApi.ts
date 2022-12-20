import api from "../../../../../app/api";
import { IInvestmentResponsibleAsNonLead } from "./IInvestmentResponsibleAsNonLead";

export function getAllInvestmentResponsibleAsNonLeads(teamMemberId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/teamMembers/${teamMemberId}/investmentsResponsibleForNonLead`
  });
}

export function createInvestmentResponsibleAsNonLead(investment:IInvestmentResponsibleAsNonLead) {
  return api({
    method: 'post',
    data: investment,
    url: `api/teamMembers/${investment.teamMemberId}/investmentsResponsibleForNonLead`
  });
}

export function updateInvestmentResponsibleAsNonLead(investment:IInvestmentResponsibleAsNonLead) {
  return api({
    method: 'patch',
    data: investment,
    url: `api/teamMembers/${investment.teamMemberId}/investmentsResponsibleForNonLead/${investment.id}`
  });
}

export function deleteInvestmentResponsibleAsNonLead(investment:IInvestmentResponsibleAsNonLead) {
  return api({
    method: 'delete',
    url: `api/teamMembers/${investment.teamMemberId}/investmentsResponsibleForNonLead/${investment.id}`
  });
}

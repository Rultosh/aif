import api from "../../../../../app/api";
import { IInvestmentResponsibleAsLead } from "./IInvestmentResponsibleAsLead";

export function getAllInvestmentResponsibleAsLeads(teamMemberId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/teamMembers/${teamMemberId}/investmentsResponsibleAsLead`
  });
}

export function createInvestmentResponsibleAsLead(investment:IInvestmentResponsibleAsLead) {
  return api({
    method: 'post',
    data: investment,
    url: `api/teamMembers/${investment.teamMemberId}/investmentsResponsibleAsLead`
  });
}

export function updateInvestmentResponsibleAsLead(investment:IInvestmentResponsibleAsLead) {
  return api({
    method: 'patch',
    data: investment,
    url: `api/teamMembers/${investment.teamMemberId}/investmentsResponsibleAsLead/${investment.id}`
  });
}

export function deleteInvestmentResponsibleAsLead(investment:IInvestmentResponsibleAsLead) {
  return api({
    method: 'delete',
    url: `api/teamMembers/${investment.teamMemberId}/investmentsResponsibleAsLead/${investment.id}`
  });
}

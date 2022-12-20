import api from "../../../../../app/api";
import { IInvestmentPartner } from "./IInvestmentPartner";
import { IPrelimApplicationData } from "../IPrelimApplicationData";

export function fetchInvestmentTeamsPartnerLevel(prelimAppId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/prelims/${prelimAppId}/investmentTeamsPartnerLevel`
  });
}


export function updateInvestmentTeamsPartnerLevel(investmentPartner:IInvestmentPartner) {
  return api({
    method: 'patch',
    data: investmentPartner,
    url: `api/prelims/${investmentPartner.prelimApplicationId}/investmentTeamsPartnerLevel/${investmentPartner.id}`
  });
}

export function createInvestmentTeamsPartnerLevel(investmentPartner:IInvestmentPartner) {
  return api({
    method: 'post',
    data: investmentPartner,
    url: `api/prelims/${investmentPartner.prelimApplicationId}/investmentTeamsPartnerLevel`
  });
}

export function deleteInvestmentTeamPartnerLevel(investmentPartner:IInvestmentPartner) {
  return api({
    method: 'delete',
    url: `api/prelims/${investmentPartner.prelimApplicationId}/investmentTeamsPartnerLevel/${investmentPartner.id}`
  });
}


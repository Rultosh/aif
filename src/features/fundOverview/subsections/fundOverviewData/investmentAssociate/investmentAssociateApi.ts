import api from "../../../../../app/api";
import { IInvestmentAssociate } from "./IInvestmentAssociate";

export function fetchInvestmentTeamsAssociateLevel(prelimAppId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/prelims/${prelimAppId}/investmentTeamsAssociateLevel`
  });
}


export function updateInvestmentTeamsAssociateLevel(investmentAssociate:IInvestmentAssociate) {
  return api({
    method: 'patch',
    data: investmentAssociate,
    url: `api/prelims/${investmentAssociate.prelimApplicationId}/investmentTeamsAssociateLevel/${investmentAssociate.id}`
  });
}

export function createInvestmentTeamsAssociateLevel(investmentAssociate:IInvestmentAssociate) {
  return api({
    method: 'post',
    data: investmentAssociate,
    url: `api/prelims/${investmentAssociate.prelimApplicationId}/investmentTeamsAssociateLevel`
  });
}

export function deleteInvestmentTeamsAssociateLevel(investmentAssociate:IInvestmentAssociate) {
  return api({
    method: 'delete',
    url: `api/prelims/${investmentAssociate.prelimApplicationId}/investmentTeamsAssociateLevel/${investmentAssociate.id}`
  });
}


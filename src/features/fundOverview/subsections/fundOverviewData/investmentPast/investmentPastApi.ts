import api from "../../../../../app/api";
import { IInvestmentPast } from "./IInvestmentPast";

export function fetchInvestmentPast(prelimAppId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/prelims/${prelimAppId}/investmentsMade`
  });
}


export function updateInvestmentPast(investmentPast:IInvestmentPast) {
  return api({
    method: 'patch',
    data: investmentPast,
    url: `api/prelims/${investmentPast.prelimApplicationId}/investmentsMade/${investmentPast.id}`
  });
}

export function createInvestmentPast(investmentPast:IInvestmentPast) {
  return api({
    method: 'post',
    data: investmentPast,
    url: `api/prelims/${investmentPast.prelimApplicationId}/investmentsMade`
  });
}

export function deleteInvestmentPast(investmentPast:IInvestmentPast) {
  return api({
    method: 'delete',
    url: `api/prelims/${investmentPast.prelimApplicationId}/investmentsMade/${investmentPast.id}`
  });
}


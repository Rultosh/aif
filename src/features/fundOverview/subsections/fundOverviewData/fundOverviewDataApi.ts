import api from "../../../../app/api";
import { IPrelimApplicationData } from "./IPrelimApplicationData";
import { IPageInfo } from "./prelimApplicationDataSlice";

export function fetchFundOverviewData(prelimAppId:Number) {
  return api({
    method: 'get',
    url: `/api/prelims/${prelimAppId}`
  });
}

export function fetchFundOverviewList(pageInfo : IPageInfo | undefined) {
  return api({
    method: 'get',
    url: `/api/prelims/page/${pageInfo?.pageNumber}/${pageInfo?.pageSize}`
  });
}

export function postPrelimApplication(prelimAppData:IPrelimApplicationData) {
  return api({
    method: 'post',
    data: prelimAppData,
    url: `/api/prelims`
  });
}

export function patchPrelimApplication(prelimAppData:IPrelimApplicationData) {
  console.log("API", prelimAppData);
  return api({
    method: 'patch',
    data: prelimAppData,
    url: `/api/prelims/${prelimAppData.id}`
  });
}
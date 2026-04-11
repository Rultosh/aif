import api from "../../../../app/api";
import { IPrelimApplicationData, IApplicationData } from "./IPrelimApplicationData";
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

export function fetchFundOverviewAllList(pageInfo : IPageInfo | undefined) {
  return api({
    method: 'get',
    url: `/api/prelims`
  });
}

/** Maker/checker: preliminary apps not yet in workflow (shell or CREATED/REVISE). */
export function fetchPrelimDraftsList() {
  return api({
    method: 'get',
    url: `/api/prelims/drafts`
  });
}

export function postPrelimApplicationShell(prelimAppData:IPrelimApplicationData) {
  return api({
    method: 'post',
    // data: prelimAppData,
    // url: `/api/prelims`
    url: `/api/prelims/createShell`
  });
}

export function postPrelimApplication(prelimAppData:IPrelimApplicationData) {
  return api({
    method: 'post',
    data: prelimAppData,
    url: `/api/prelims`
  });
}

export function postApplication(prelimAppData:IApplicationData) {
  return api({
    method: 'post',
    data: {'remark': prelimAppData.statusComments, 'actionDate': prelimAppData.actionDate},
    url: `/api/application/${prelimAppData.id}/${prelimAppData.status}`
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

export function postWorkflowAction(
  applicationId: Number | undefined,
  action: string,
  payload: any
) {
  return api({
    method: 'post',
    data: payload,
    url: `/api/application/${applicationId}/${action}`
  });
}

export function fetchMakerUsers() {
  return api({
    method: 'get',
    url: `/api/users/makers`
  });
}
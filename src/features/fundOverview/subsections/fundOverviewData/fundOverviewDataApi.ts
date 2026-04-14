import api from "../../../../app/api";
import { IPrelimApplicationData, IApplicationData } from "./IPrelimApplicationData";
import { IPageInfo } from "./prelimApplicationDataSlice";

export function fetchFundOverviewData(prelimAppId:Number) {
  return api({
    method: 'get',
    url: `/api/prelims/${prelimAppId}`
  });
}

/** KMP rows missing past-10-years doc and/or resume (ids per category). */
export function fetchKmpMandatoryDocumentsStatus(prelimAppId: Number) {
  return api({
    method: 'get',
    url: `/api/prelims/${prelimAppId}/kmpMandatoryDocumentsStatus`,
  });
}

/** Non-KMP associate rows missing mandatory resume/CV on the file server (ids only). */
export function fetchAssociateMandatoryDocumentsStatus(prelimAppId: Number) {
  return api({
    method: 'get',
    url: `/api/prelims/${prelimAppId}/associateMandatoryDocumentsStatus`,
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

/** Draft prelims with no linked self-rating yet (still in initial assessment, before fund step). */
export function fetchPrelimsInitialAssessmentOnly() {
  return api({
    method: 'get',
    url: `/api/prelims/initial-assessment-in-progress`,
  });
}

/** Creates a new preliminary application (empty starter); legacy API path unchanged. */
export function postNewPreliminaryStarter(_prelimAppData: IPrelimApplicationData) {
  return api({
    method: 'post',
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
    data: {
      'remark': prelimAppData.statusComments,
      'actionDate': prelimAppData.actionDate,
      'attachmentBucket': prelimAppData.attachmentBucket,
      'attachmentName': prelimAppData.attachmentName,
    },
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
import api from "../../app/api";
import { IQueryResolution } from "./IQueryResolution";


export function postQuery(queryDetails:IQueryResolution) {
  return api({
    method: 'post',
    data: {
      query: queryDetails.query,
      attachmentBucket: queryDetails.attachmentBucket,
      attachmentName: queryDetails.attachmentName,
    },
    url: `api/prelims/${queryDetails.id}/queries`
  });
}

export function getQuery(id:string) {
  return api({
    method: 'get',
    url: `api/prelims/${id}/queries`
  });
}

export function markQueriesAsRead(applicationId: string | number) {
  return api({
    method: 'post',
    url: `api/prelims/${applicationId}/queries/mark-as-read`
  });
}

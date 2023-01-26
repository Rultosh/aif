import api from "../../app/api";
import { IQueryResolution } from "./IQueryResolution";


export function postQuery(queryDetails:IQueryResolution) {
  return api({
    method: 'post',
    data: {query:queryDetails.query},
    url: `api/prelims/${queryDetails.id}/queries`
  });
}

export function getQuery(id:string) {
  return api({
    method: 'get',
    url: `api/prelims/${id}/queries`
  });
}


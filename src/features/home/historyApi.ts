import api from "../../app/api";
import { IHistory } from "./IHistory";

export function getHistory(id:string) {
  return api({
    method: 'get',
    url: `api/application/${id}/statuses`
  });
}


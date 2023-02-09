import api from "../../app/api";

export function getHistory(selectedRow:string) {
  return api({
    method: 'get',
    url: `api/application/${selectedRow}/statuses`
  });
}


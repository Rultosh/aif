import api from "../../../../app/api";


export function isAllDocsAvailable(id: string, application:string) {
  return api({
    method: 'get',
    url: `api/${application}/${id}/isAllDocAvailable`
  });
}

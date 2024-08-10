import api from "../../app/api";

class MasterDataService {
  load(type) {
    return api({
      method: 'get',
      url: `/api/masterData/${type}`,
    });
  }
}

export default new MasterDataService();
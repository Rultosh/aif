import api from "../../app/api";

class MasterDataService {
  load(type) {
    return api({
      method: 'get',
      url: `/admin/masterData/${type}`,
    });
  }
}

export default new MasterDataService();
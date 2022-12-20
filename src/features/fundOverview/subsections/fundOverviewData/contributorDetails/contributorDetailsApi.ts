import api from "../../../../../app/api";
import { IContributorDetails } from "./IContributorDetails";

export function fetchContributorDetails(prelimAppId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/prelims/${prelimAppId}/fundContributors`
  });
}


export function updateContributorDetails(contributorDetails:IContributorDetails) {
  return api({
    method: 'patch',
    data: contributorDetails,
    url: `api/prelims/${contributorDetails.prelimApplicationId}/fundContributors/${contributorDetails.id}`
  });
}

export function createContributorDetails(contributorDetails:IContributorDetails) {
  return api({
    method: 'post',
    data: contributorDetails,
    url: `api/prelims/${contributorDetails.prelimApplicationId}/fundContributors`
  });
}

export function deleteContributorDetails(contributorDetails:IContributorDetails) {
  return api({
    method: 'delete',
    url: `api/prelims/${contributorDetails.prelimApplicationId}/fundContributors/${contributorDetails.id}`
  });
}


import api from "../../../../app/api";
import { ISelfRating } from "./ISelfRating";

export function fetchSelfRating(prelimAppId:Number | undefined) {
  return api({
    method: 'get',
    url: `api/prelims/${prelimAppId}/selfRatings`
  });
}

export function updateSelfRating(selfRating:ISelfRating) {
  return api({
    method: 'patch',
    data: selfRating,
    url: `api/prelims/${selfRating.prelimApplicationId}/selfRatings/${selfRating.id}`
  });
}

export function createSelfRating(selfRating:ISelfRating) {
  return api({
    method: 'post',
    data: selfRating,
    url: `api/prelims/${selfRating.prelimApplicationId}/selfRatings`
  });
}

export function createIndependentRating(selfRating:ISelfRating) {
  return api({
    method: 'post',
    data: selfRating,
    url: `api/selfRatings`
  });
}

export function deleteSelfRating(selfRating:ISelfRating) {
  return api({
    method: 'delete',
    url: `api/prelims/${selfRating.prelimApplicationId}/selfRatings/${selfRating.id}`
  });
}


import api from "../../app/api";
import { IEntity } from "./IEntity";

export class APIAdaptor<T> {

  private entity : string;
  private parentEntity : string | undefined;

  constructor(parentEntity:string|undefined, entity:string) {
    this.parentEntity = parentEntity;
    this.entity = entity;
  }

  all(object:T) : any {
    if(this.parentEntity) {
      return api({
        method: 'get',
        url: `/api/${this.parentEntity}/${this.getParentId(object)}/${this.entity}`
      });  
    } else {
      return api({
        method: 'get',
        url: `/api/${this.entity}`
      });  
    }
  }

  get(object:T) : any {
    if(this.parentEntity) {
      return api({
        method: 'get',
        url: `/api/${this.parentEntity}/${this.getParentId(object)}/${this.entity}/${this.getId(object)}`
      });
    } else {
      return api({
        method: 'get',
        url: `/api/${this.entity}/${this.getId(object)}`
      });
    }
  }

  read(object:T) : any {
    if(this.parentEntity) {
      return api({
        method: 'get',
        url: `/api/${this.parentEntity}/${this.getParentId(object)}/${this.entity}/${this.getId(object)}`
       // url: `/api/prelims/page/${pageInfo?.pageNumber}/${pageInfo?.pageSize}`
      });
    } else {
      return api({
        method: 'get',
        url: `/api/${this.entity}`
        //url: `/api/prelims/page/${pageInfo?.pageNumber}/${pageInfo?.pageSize}`
      });
    }
  }

  post(object:T) : any {
    if(this.parentEntity) {
      return api({
        method: 'post',
        data: object,
        url: `/api/${this.parentEntity}/${this.getParentId(object)}/${this.entity}`
      });
    } else {
      return api({
        method: 'post',
        data: object,
        url: `/api/${this.entity}`
      });
    }
  }

  patch(object:T) : any {
    if(this.parentEntity) {
      return api({
        method: 'patch',
        data: object,
        url: `/api/${this.parentEntity}/${this.getParentId(object)}/${this.entity}/${this.getId(object)}`
      });
    } else {
      return api({
        method: 'patch',
        data: object,
        url: `/api/${this.entity}/${this.getId(object)}`
      });
    }
  }

  delete(object:T) : any {
    if(this.parentEntity) {
      return api({
        method: 'delete',
        url: `/api/${this.parentEntity}/${this.getParentId(object)}/${this.entity}/${this.getId(object)}`
      });
    } else {
      return api({
        method: 'delete',
        url: `/api/${this.entity}/${this.getId(object)}`
      });
    }
  }

  private getId(object: T) {
    return (<IEntity><unknown>object).id;
  }

  private getParentId(object:T) {
    return (<IEntity><unknown>object).parentId;
  }
  
}
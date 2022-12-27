import { useAppDispatch } from "../../app/hooks";
import { IEntity } from "./IEntity";
import { ICommonState, Thunk } from "./Thunk";
import { wrapArgument } from "../api-status/actionWrapper";
import { FetchStatus, IStatus } from "../api-status/IStatus";
import { IIndependentReferences } from "../../features/fundOverview/subsections/profile-new/independentReferences/IIndependentReferences";

export class Controller<T extends IEntity> {
  data(state: ICommonState<T>, object: T): T | undefined {
    return state[this.getDefined(this.getParentId(object))]
        ?.data[this.getDefined(this.getId(object))]
  }

  getDefined(id: number | undefined) : number {
    if(id) return id;
    else return 0;
  }
  
  getParentId(input: T | undefined) : number {
    let parentId = (input as IEntity).parentId;
    if(input && parentId) {
      return parentId;
    } else {
      return 0;
    }
  }

  getId(item: T | undefined): number {
    let id = (item as IEntity).id;
    if (item && id) return id;
    else {
      return 0;
    }
  }
  
  dispatch = useAppDispatch();
  actionId : any;
  thunk : Thunk<T>;

  public constructor(actionId : any, thunk : Thunk<T>) {
    this.thunk = thunk;
    this.actionId = actionId;
  }

  public all(data: T) {
    this.dispatch(this.thunk.getAllAsync(
      wrapArgument(
        this.actionId,
        data
      )
    ));
  }

  public save(data:T) {
    console.log(data);
    if(data.id) {
      this.dispatch(
        this.thunk.updateAsync(
          wrapArgument(
            this.actionId,
            data
          )
        )
      )
    } else {
      this.dispatch(
        this.thunk.createAsync(
          wrapArgument(
            this.actionId,
            data
          )
        )
      )
    }
  }

  public fetch(data:T) {
    this.dispatch(
      this.thunk.getAsync(
        wrapArgument(
          this.actionId,
          data
        )
      )
    )
  }

  public delete(data:T) {
    this.dispatch(
      this.thunk.deleteAsync(
        wrapArgument(
          this.actionId,
          data
        )
      )
    )
  }

  public read(data:T) {
    this.dispatch(
      this.thunk.readAsync(
        wrapArgument(
          this.actionId,
          data
        )
      )
    )
  }

  public isActionCompleted(parentId:number|undefined, state: ICommonState<T>): boolean {
    parentId = parentId?parentId:0;
    if(state[parentId])
    {
      console.log(JSON.stringify(state[parentId]
        .status[this.actionId]?.actionStatus.fetchStatus))
      return (
        state[parentId]
          .status[this.actionId]?.actionStatus.fetchStatus 
            === FetchStatus.IDLE || !state[parentId]
            .status[this.actionId]?.actionStatus.fetchStatus)
    } else {
      return false;
    }
  }

  public isActionError(parentId:number|undefined, state: ICommonState<T>): boolean {
    parentId = parentId?parentId:0;
    console.log('isActionError', parentId, this.actionId);
    if(state[parentId])
    {
      console.log(state[parentId]
        .status[this.actionId]?.actionStatus.fetchStatus)
      return (
        state[parentId]
          .status[this.actionId]?.actionStatus.fetchStatus 
            === FetchStatus.FAILED)
    } else {
      return false;
    }
  }

  public error(parentId:number|undefined, state: ICommonState<T>): string | undefined {
    parentId = parentId?parentId:0;
    if(state[parentId])
    {
      return (
        state[parentId]
          .status[this.actionId]?.actionStatus.message)
    } else {
      return undefined;
    }
  }

  public isAllActionError(parentId:number|undefined, state: ICommonState<T>): boolean {
    parentId = parentId?parentId:0;
    if(state[parentId])
    {
      return (
        state[parentId]
          .status[this.actionId]?.allStatus.fetchStatus 
            === FetchStatus.FAILED)
    } else {
      return false;
    }
  }

  public allError(parentId:number|undefined, state: ICommonState<T>): string | undefined {
    parentId = parentId?parentId:0;
    if(state[parentId])
    {
      return (
        state[parentId]
          .status[this.actionId]?.allStatus.message)
    } else {
      return undefined;
    }
  }

  public isAllActionCompleted(parentId:number|undefined, state: ICommonState<T>): boolean {
    parentId = parentId?parentId:0;
    if(state[parentId])
      return (
        state[parentId]
          .status[this.actionId]?.allStatus.fetchStatus 
            === FetchStatus.IDLE)
    return false;
  }

  public getCreatedOrUpdatedData(
    parentId:number|undefined, 
    id: number | undefined, state: ICommonState<T>) {

    parentId = parentId?parentId:0;
    let specificState = state[parentId];

    if(specificState) {
      if(id && specificState.data[String(id)]) 
        return specificState.data[String(id)]
      else if (specificState.createdId && specificState.data[String(specificState.createdId)])
        return specificState.data[String(specificState.createdId)]
    } 

    return undefined;
  }
}
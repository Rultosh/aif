import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { ActionWrapper } from "../api-status/actionWrapper";
import { getError } from "../api-status/errorHandler";
import { FetchStatus, IStatus } from "../api-status/IStatus";
import { APIAdaptor } from "./APIAdaptor";
import { IEntity } from "./IEntity";

export type ICommonState2B<T> =
  {
    [key: string]: { /*parent hash map*/
      data: {
        [key: string]: /*object hash map*/
          T | undefined /*object*/
      },
      hashData : {
        [key: string]: /*object hash map*/ {
          [key: string]: /*object hash map*/
            T | undefined
        }
      }
      status: {
        [key: string]: { /*status hash map*/
          actionStatus: IStatus, /*Individual action like GET, POST, PATCH, DELETE*/
          allStatus: IStatus, /* All action, getting list of object using GET*/
        }
      },
      createdId: number | undefined /*if a new object was created in the last action*/
    }
  }

export class Thunk2B<T extends IEntity> {

  initialState: ICommonState2B<T> = {}

  getEntityName(): string {
    console.log(this.entity);
    if (this.entity) return this.entity;
    else throw new Error('Entity name cannot be null');
  }

  private spreadArrayAsHash(payload: T[]): any {
    let items: { [key: string]: T } = {}
    payload.map((item) => {
      let id = this.getId(item);
      if (id) {
        items[id] = item
      }
    });
    return { ...items };
  }

  entity: string | undefined = undefined;
  parentEntity: string | undefined = undefined;
  apiAdaptor: APIAdaptor<T> | undefined;

  constructor(parentEntity: string | undefined, entity: string) {
    this.entity = entity;
    this.parentEntity = parentEntity;
    this.apiAdaptor = new APIAdaptor<T>(parentEntity, entity);
  }

  getAllAsync = createAsyncThunk(
    `getAll${this.entity}Async/all`,
    async (args: ActionWrapper<T>, { rejectWithValue }) => {
      try {
        if (args.argument) {
          const response = await this.apiAdaptor?.all(args.argument);
          return response.data;
        }

      } catch (reason) {
        console.log("Error: " + reason)
        return rejectWithValue(getError(reason));
      }
    }
  );

  getAsync = createAsyncThunk(
    `get${this.entity}Async/all`,
    async (args: ActionWrapper<T>, { rejectWithValue }) => {
      try {
        if (args.argument) {
          const response = await this.apiAdaptor?.get(args.argument);
          return response.data;
        }
      } catch (reason) {
        console.log("Error: " + reason)
        return rejectWithValue(getError(reason));
      }
    }
  );

  createAsync = createAsyncThunk(
    `create${this.entity}Async/all`,
    async (args: ActionWrapper<T>, { rejectWithValue }) => {
      try {
        if (args.argument) {
          const response = await this.apiAdaptor?.post(args.argument);
          return response.data;
        }
      } catch (reason) {
        console.log("Error: " + reason)
        return rejectWithValue(getError(reason));
      }
    }
  );

  updateAsync = createAsyncThunk(
    `update${this.entity}Async/all`,
    async (args: ActionWrapper<T>, { rejectWithValue }) => {
      try {
        if (args.argument) {
          const response = await this.apiAdaptor?.patch(args.argument);
          return response.data;
        }
      } catch (reason) {
        console.log("Error: " + reason)
        return rejectWithValue(getError(reason));
      }
    }
  );

  deleteAsync = createAsyncThunk(
    `delete${this.entity}Async/all`,
    async (args: ActionWrapper<T>, { rejectWithValue }) => {
      try {
        if (args.argument) {
          const response = await this.apiAdaptor?.delete(args.argument);
          return response.data;
        }
      } catch (reason) {
        console.log("Error: " + reason)
        return rejectWithValue(getError(reason));
      }
    }
  );

  
  readAsync = createAsyncThunk(
    `read${this.entity}Async/all`,
    async (args: ActionWrapper<T>, { rejectWithValue }) => {
      try {
        if (args.argument) {
          const response = await this.apiAdaptor?.read(args.argument);
          return response.data;
        }
      } catch (reason) {
        console.log("Error: " + reason)
        return rejectWithValue(getError(reason));
      }
    }
  );

  setDefaultValues(state: ICommonState2B<T>, trackingid: string, parentId: number) {
    if(!state[parentId]) {
      state[parentId] = {
        data: {},
        hashData: {},
        status : {},
        createdId: undefined
      };
      state[parentId].hashData[this.getEntityName()] = {}
    }

    if (!state[parentId].status[trackingid]){
      console.log('doing 2')
      state[parentId].status[trackingid] = {
        actionStatus: { fetchStatus: FetchStatus.IDLE },
        allStatus: { fetchStatus: FetchStatus.IDLE }
      }
    }
  }

  extraReducers = (builder: ActionReducerMapBuilder<ICommonState2B<T>>) => {
    builder
      .addCase(this.getAllAsync.pending, (state, action) => {
        let input = action.meta.arg;
        this.setDefaultValues(
          state as ICommonState2B<T>, 
          input.trackingid, 
          this.getParentId(input.argument));
        state[this.getParentId(input.argument)]
          .status[input.trackingid].allStatus.fetchStatus = FetchStatus.DOING;
        state[this.getParentId(input.argument)].data = {}
        console.log('ganesan', this.getParentId(input.argument), 'setting state data to blank', state[this.getParentId(input.argument)].data)
      })
      .addCase(this.getAllAsync.fulfilled, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].allStatus.fetchStatus = FetchStatus.IDLE;
        state[this.getParentId(input.argument)]
          .data = this.spreadArrayAsHash(action.payload);
        state[this.getParentId(input.argument)]
          .hashData[this.getEntityName()] = this.spreadArrayAsHash(action.payload);
        console.log('getAllSync', this.entity,
          this.getParentId(input.argument), 
          input.trackingid, 
          JSON.stringify(state[this.getParentId(input.argument)]
            .status[input.trackingid]),
          JSON.stringify(state[this.getParentId(input.argument)]
            .data));
      })
      .addCase(this.getAllAsync.rejected, (state, action) => {
        let input = action.meta.arg;
        console.log('GetAllAsync', this.getParentId(input.argument))
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus = getError(action.payload);
      })
      .addCase(this.getAsync.pending, (state, action) => {
        let input = action.meta.arg;
        this.setDefaultValues(
          state as ICommonState2B<T>, 
          input.trackingid, 
          this.getParentId(input.argument));
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.DOING;
      })
      .addCase(this.getAsync.fulfilled, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.IDLE;
        state[this.getParentId(input.argument)]
          .data[this.getId(input.argument)] = action.payload;
        state[this.getParentId(input.argument)]
          .hashData[this.getEntityName()][this.getId(input.argument)] = action.payload;
      })
      .addCase(this.getAsync.rejected, (state, action) => {
        let input = action.meta.arg;
        console.log('getAsync Error', this.getParentId(input.argument), input.trackingid)
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus = getError(action.payload);
      })
      .addCase(this.createAsync.pending, (state, action) => {
        let input = action.meta.arg;
        this.setDefaultValues(
            state as ICommonState2B<T>, 
            input.trackingid, 
            this.getParentId(input.argument)
        )
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.DOING;
      })
      .addCase(this.createAsync.fulfilled, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.IDLE;
        
        let id = action.payload.id;
        state[this.getParentId(input.argument)]
          .data[id] = action.payload;
        state[this.getParentId(input.argument)]
          .hashData[this.getEntityName()][id] = action.payload;
        state[this.getParentId(input.argument)].createdId = id;
      })
      .addCase(this.createAsync.rejected, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus = getError(action.payload);
      })
      .addCase(this.updateAsync.pending, (state, action) => {
        let input = action.meta.arg;
        this.setDefaultValues(
          state as ICommonState2B<T>, 
          input.trackingid, 
          this.getParentId(input.argument));
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.DOING;
      })
      .addCase(this.updateAsync.fulfilled, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.IDLE;
        state[this.getParentId(input.argument)]
          .data[this.getId(input.argument)] = action.payload;
        state[this.getParentId(input.argument)]
          .hashData[this.getEntityName()][this.getId(input.argument)] = action.payload;
        console.log(
          this.getParentId(input.argument), 
          input.trackingid, action.payload,
          JSON.stringify(state[this.getParentId(input.argument)]
          .status[input.trackingid]))
      })
      .addCase(this.updateAsync.rejected, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus = getError(action.payload);
      })
      .addCase(this.deleteAsync.pending, (state, action) => {
        let input = action.meta.arg;
        this.setDefaultValues(
          state as ICommonState2B<T>, 
          input.trackingid, 
          this.getParentId(input.argument));
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.DOING;
      })
      .addCase(this.deleteAsync.fulfilled, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.IDLE;
        state[this.getParentId(input.argument)]
          .data[this.getId(input.argument)] = undefined;
        state[this.getParentId(input.argument)]
          .hashData[this.getEntityName()][this.getId(input.argument)] = undefined;
      })
      .addCase(this.deleteAsync.rejected, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus = getError(action.payload);
      })
      .addCase(this.readAsync.pending, (state, action) => {
        let input = action.meta.arg;
        this.setDefaultValues(
          state as ICommonState2B<T>, 
          input.trackingid, 
          this.getParentId(input.argument));
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.DOING;
      })
      .addCase(this.readAsync.fulfilled, (state, action) => {
        let input = action.meta.arg;
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus.fetchStatus = FetchStatus.IDLE;
        state[this.getParentId(input.argument)]
          .data[this.getId(input.argument)] = action.payload;
        state[this.getParentId(input.argument)]
          .hashData[this.getEntityName()][this.getId(input.argument)] = action.payload;
        //state['0'].status = FetchStatus.IDLE;
        //state[0].data[0] = action.payload;
       // state['applications'] = action.payload;
      })
      .addCase(this.readAsync.rejected, (state, action) => {
        let input = action.meta.arg;
        console.log('getAsync Error', this.getParentId(input.argument), input.trackingid)
        state[this.getParentId(input.argument)]
          .status[input.trackingid].actionStatus = getError(action.payload);
      })
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
      console.log("Entity and entity id cannot be null!");
      throw Error("Entity and entity id cannot be null!");
    }
  }
}
export interface ActionWrapper<T> {
    trackingid: string,
    argument?: T
}

export function wrapArgument<T> (trackingid: string, argument: T) : ActionWrapper<T> {
    return {"trackingid": trackingid, "argument": argument};
}
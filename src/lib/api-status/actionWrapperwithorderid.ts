export interface ActionWrapperWithOrderId<T> {
    trackingid: string,
    argument?: T,
    orderid?:string
}

export function wrapArgumentWithOrderId<T> (trackingid: string, argument: T,orderid?:string) : ActionWrapperWithOrderId<T> {
    return {"trackingid": trackingid, "argument": argument,"orderid":orderid};
}
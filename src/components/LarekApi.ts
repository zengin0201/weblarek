import { IApi, IOrder, IOrderResult, IProductList } from '../types';

export interface ILarekApi {
    getProductList: () => Promise<IProductList>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi implements ILarekApi {
    private _api: IApi;
    constructor(api: IApi) {
        this._api = api;
    }
    getProductList(): Promise<IProductList> {
        return this._api.get<IProductList>('/product');
    }
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order);
    }
}
